import mediasoup from 'mediasoup'
import type {
  Worker,
  Router,
  WebRtcTransport,
  Producer,
  Consumer,
  RtpCapabilities,
  DtlsParameters,
} from 'mediasoup/types'
import transmit from '@adonisjs/transmit/services/main'
import env from '#start/env'

// ─── Codec RTP supportés ──────────────────────────────────────────────────────
const mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: { 'x-google-start-bitrate': 1000 },
  },
  {
    kind: 'video',
    mimeType: 'video/H264',
    clockRate: 90000,
    parameters: {
      'packetization-mode': 1,
      'profile-level-id': '4d0032',
      'level-asymmetry-allowed': 1,
    },
  },
]

/**
 * Gestion du Worker pool mediasoup
 * En production, on crée un worker par CPU
 */
class MediasoupService {
  private workers: Worker[] = []
  private routers: Map<string, Router> = new Map()
  private transports: Map<string, WebRtcTransport> = new Map()
  private producers: Map<string, Producer> = new Map()
  private consumers: Map<string, Consumer> = new Map()

  // Associe chaque room (routerId) à ses producers
  private roomProducers: Map<string, Set<string>> = new Map()

  private workerIndex = 0

  /**
   * Démarre les workers au boot de l'app
   */
  async init(numWorkers = 1) {
    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: 'warn',
        rtcMinPort: env.get('MEDIASOUP_MIN_PORT', 10000) as number,
        rtcMaxPort: env.get('MEDIASOUP_MAX_PORT', 10999) as number,
      })

      worker.on('died', () => {
        console.error('mediasoup Worker died, exiting...', worker.pid)
        process.exit(1)
      })

      this.workers.push(worker)
    }

    console.info(`mediasoup: ${numWorkers} worker(s) démarré(s)`)
  }

  /**
   * Round-robin sur les workers
   */
  private getNextWorker(): Worker {
    const worker = this.workers[this.workerIndex]
    this.workerIndex = (this.workerIndex + 1) % this.workers.length
    return worker
  }

  /**
   * Crée un router mediasoup (1 par room)
   */
  async createRouter(): Promise<string> {
    const worker = this.getNextWorker()
    const router = await worker.createRouter({ mediaCodecs })
    this.routers.set(router.id, router)

    // Initialiser le set de producers de cette room
    this.roomProducers.set(router.id, new Set())

    return router.id
  }

  /**
   * Ferme le router d'une room (en fin de conférence)
   */
  async closeRouter(routerId: string): Promise<void> {
    const router = this.routers.get(routerId)
    if (!router) return

    router.close()
    this.routers.delete(routerId)
    this.roomProducers.delete(routerId)
  }

  /**
   * Capacités RTP du router (envoyées au client pour négociation)
   */
  getRouterRtpCapabilities(routerId: string): RtpCapabilities {
    const router = this.routers.get(routerId)
    if (!router) throw new Error('Router introuvable')
    return router.rtpCapabilities
  }

  /**
   * Crée un WebRTC Transport bidirectionnel pour un participant
   */
  async createWebRtcTransport(
    routerId: string
  ): Promise<{ transport: WebRtcTransport; params: object }> {
    const router = this.routers.get(routerId)
    if (!router) throw new Error('Router introuvable')

    const transport = await router.createWebRtcTransport({
      listenIps: [
        {
          ip: env.get('MEDIASOUP_LISTEN_IP', '0.0.0.0'),
          announcedIp: env.get('MEDIASOUP_ANNOUNCED_IP', '127.0.0.1'),
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: 1_000_000,
    })

    this.transports.set(transport.id, transport)

    const params = {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    }

    return { transport, params }
  }

  /**
   * Connecte le transport côté client (DTLS handshake)
   */
  async connectTransport(transportId: string, dtlsParameters: DtlsParameters): Promise<void> {
    const transport = this.transports.get(transportId)
    if (!transport) throw new Error('Transport introuvable')
    await transport.connect({ dtlsParameters })
  }

  /**
   * Ferme un transport (départ d'un participant)
   */
  async closeTransport(transportId: string): Promise<void> {
    const transport = this.transports.get(transportId)
    if (!transport) return
    transport.close()
    this.transports.delete(transportId)
  }

  /**
   * Crée un Producer (participant qui publie son flux vidéo/audio)
   */
  async createProducer(
    transportId: string,
    routerId: string,
    roomCode: string,
    participantId: number,
    kind: 'audio' | 'video',
    rtpParameters: object
  ): Promise<{ producerId: string }> {
    const transport = this.transports.get(transportId)
    if (!transport) throw new Error('Transport introuvable')

    const producer = await transport.produce({ kind, rtpParameters } as any)

    this.producers.set(producer.id, producer)
    this.roomProducers.get(routerId)?.add(producer.id)

    producer.on('transportclose', () => {
      this.producers.delete(producer.id)
      this.roomProducers.get(routerId)?.delete(producer.id)
    })

    // Notifier la room qu'un nouveau flux est disponible
    await transmit.broadcast(`rooms/${roomCode}/events`, {
      event: 'rtc:new-producer',
      payload: {
        producerId: producer.id,
        kind,
        participantId,
      },
    })

    return { producerId: producer.id }
  }

  /**
   * Crée un Consumer (participant qui reçoit le flux d'un autre)
   */
  async createConsumer(
    consumerTransportId: string,
    routerId: string,
    producerId: string,
    rtpCapabilities: object
  ): Promise<{
    consumerId: string
    kind: string
    rtpParameters: object
    type: string
    producerPaused: boolean
  }> {
    const router = this.routers.get(routerId)
    if (!router) throw new Error('Router introuvable')

    // Vérifier que le client peut consommer ce producer
    if (!router.canConsume({ producerId, rtpCapabilities } as any)) {
      throw new Error("Le client ne peut pas consommer ce flux (RTP incompatible)")
    }

    const transport = this.transports.get(consumerTransportId)
    if (!transport) throw new Error('Transport consommateur introuvable')

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true, // Démarrer en pause, le client reprend quand prêt
    } as any)

    this.consumers.set(consumer.id, consumer)

    consumer.on('transportclose', () => this.consumers.delete(consumer.id))
    consumer.on('producerclose', () => this.consumers.delete(consumer.id))

    return {
      consumerId: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
    }
  }

  /**
   * Reprend un consumer (après que le client est prêt)
   */
  async resumeConsumer(consumerId: string): Promise<void> {
    const consumer = this.consumers.get(consumerId)
    if (!consumer) throw new Error('Consumer introuvable')
    await consumer.resume()
  }

  /**
   * Liste des producers actifs dans une room
   */
  getRoomProducers(routerId: string): string[] {
    return [...(this.roomProducers.get(routerId) ?? [])]
  }
}

export default new MediasoupService()