import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Room from '#models/room'
import Participant from '#models/participant'
import MediasoupService from '#services/mediasoup_service'

const connectTransportValidator = vine.compile(
  vine.object({
    transportId: vine.string(),
    dtlsParameters: vine.any(),
  })
)

const produceValidator = vine.compile(
  vine.object({
    transportId: vine.string(),
    kind: vine.enum(['audio', 'video']),
    rtpParameters: vine.any(),
  })
)

const consumeValidator = vine.compile(
  vine.object({
    transportId: vine.string(),
    producerId: vine.string(),
    rtpCapabilities: vine.any(),
  })
)

const resumeConsumerValidator = vine.compile(
  vine.object({
    consumerId: vine.string(),
  })
)

// ─── Controller ──────────────────────────────────────────────────────────────

export default class RtcController {
  /**
   * GET /rooms/:code/rtc/capabilities
   * Retourne les capacités RTP du router (à envoyer au client mediasoup)
   */
  async capabilities({ params, response }: HttpContext) {
    const room = await Room.findByOrFail('code', params.code)

    if (!room.mediasoupRouterId) {
      return response.serviceUnavailable({ message: 'Le router WebRTC n\'est pas encore prêt.' })
    }

    const capabilities = MediasoupService.getRouterRtpCapabilities(room.mediasoupRouterId)

    return response.ok({ data: capabilities })
  }

  /**
   * POST /rooms/:code/rtc/transport
   * Crée un WebRTC transport pour le participant courant
   */
  async createTransport({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const room = await Room.findByOrFail('code', params.code)

    if (!room.mediasoupRouterId) {
      return response.serviceUnavailable({ message: 'Router WebRTC indisponible.' })
    }

    const participant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', user.id)
      .where('status', 'joined')
      .firstOrFail()

    const { transport, params: transportParams } = await MediasoupService.createWebRtcTransport(
      room.mediasoupRouterId
    )

    // Sauvegarder le transport ID sur le participant
    await participant.merge({ transportId: transport.id }).save()

    return response.created({ data: transportParams })
  }

  /**
   * POST /rooms/:code/rtc/transport/connect
   * Connecte le transport (DTLS handshake)
   */
  async connectTransport({ request, response }: HttpContext) {
    const { transportId, dtlsParameters } = await request.validateUsing(connectTransportValidator)

    await MediasoupService.connectTransport(transportId, dtlsParameters)

    return response.ok({ message: 'Transport connecté.' })
  }

  /**
   * POST /rooms/:code/rtc/produce
   * Le participant commence à publier un flux (vidéo ou audio)
   */
  async produce({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const room = await Room.findByOrFail('code', params.code)

    const { transportId, kind, rtpParameters } = await request.validateUsing(produceValidator)

    const participant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', user.id)
      .where('status', 'joined')
      .firstOrFail()

    // Vérifier les permissions
    if (kind === 'video' && !participant.canPublishVideo) {
      return response.forbidden({ message: 'Vous n\'êtes pas autorisé à publier de la vidéo.' })
    }
    if (kind === 'audio' && !participant.canPublishAudio) {
      return response.forbidden({ message: 'Vous n\'êtes pas autorisé à publier de l\'audio.' })
    }

    const { producerId } = await MediasoupService.createProducer(
      transportId,
      room.mediasoupRouterId!,
      params.code,
      participant.id,
      kind,
      rtpParameters
    )

    // Mettre à jour les producers du participant
    const producers = [...(participant.producers ?? []), { producerId, kind }]
    await participant.merge({
      producers,
      videoEnabled: kind === 'video' ? true : participant.videoEnabled,
      audioEnabled: kind === 'audio' ? true : participant.audioEnabled,
    }).save()

    return response.created({ data: { producerId } })
  }

  /**
   * POST /rooms/:code/rtc/consume
   * Le participant s'abonne au flux d'un autre participant
   */
  async consume({ params, request, response }: HttpContext) {
    const room = await Room.findByOrFail('code', params.code)
    const { transportId, producerId, rtpCapabilities } = await request.validateUsing(consumeValidator)

    const consumerData = await MediasoupService.createConsumer(
      transportId,
      room.mediasoupRouterId!,
      producerId,
      rtpCapabilities
    )

    return response.created({ data: consumerData })
  }

  /**
   * POST /rooms/:code/rtc/consume/resume
   * Reprend un consumer (signale que le client est prêt à recevoir)
   */
  async resumeConsumer({ request, response }: HttpContext) {
    const { consumerId } = await request.validateUsing(resumeConsumerValidator)

    await MediasoupService.resumeConsumer(consumerId)

    return response.ok({ message: 'Consumer repris.' })
  }

  /**
   * GET /rooms/:code/rtc/producers
   * Liste des producers actifs dans la room (pour s'y abonner)
   */
  async producers({ params, response }: HttpContext) {
    const room = await Room.findByOrFail('code', params.code)

    if (!room.mediasoupRouterId) {
      return response.ok({ data: [] })
    }

    const producerIds = MediasoupService.getRoomProducers(room.mediasoupRouterId)

    return response.ok({ data: producerIds })
  }
}