import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import transmit from '@adonisjs/transmit/services/main'
import Room from '#models/room'
import Participant from '#models/participant'
import User from '#models/user'
import MediasoupService from '#services/mediasoup_service'

/**
 * Génère un code de room unique type "XK3-9AB-72Z"
 */
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${segment(3)}-${segment(3)}-${segment(3)}`
}

export default class RoomService {
  /**
   * Crée une nouvelle room et désigne l'utilisateur comme hôte
   */
  async createRoom(
    host: User,
    data: {
      name: string
      description?: string
      isPrivate?: boolean
      password?: string
      maxParticipants?: number
    }
  ): Promise<Room> {
    // Générer un code unique
    let code: string
    do {
      code = generateRoomCode()
    } while (await Room.findBy('code', code))

    // Hasher le mot de passe si la room est privée
    let hashedPassword: string | null = null
    if (data.isPrivate && data.password) {
      hashedPassword = await hash.make(data.password)
    }

    // Créer la room et le router mediasoup
    const routerId = await MediasoupService.createRouter()

    const room = await Room.create({
      code,
      name: data.name,
      description: data.description ?? null,
      hostId: host.id,
      status: 'waiting',
      isPrivate: data.isPrivate ?? false,
      password: hashedPassword,
      maxParticipants: data.maxParticipants ?? 50,
      mediasoupRouterId: routerId,
    })

    // Ajouter l'hôte comme participant avec rôle "host"
    await Participant.create({
      roomId: room.id,
      userId: host.id,
      role: 'host',
      status: 'invited',
      canPublishVideo: true,
      canPublishAudio: true,
      canShareScreen: true,
    })

    return room
  }

  /**
   * Récupère une room par son code avec les participants actifs
   */
  async getRoomByCode(code: string): Promise<Room> {
    const room = await Room.query()
      .where('code', code)
      .preload('host', (q) => q.select(['id', 'fullName', 'email']))
      .preload('participants', (q) => {
        q.whereIn('status', ['invited', 'joined'])
          .preload('user', (uq) => uq.select(['id', 'fullName', 'email']))
      })
      .firstOrFail()

    return room
  }

  /**
   * Un utilisateur rejoint la room
   */
  async joinRoom(user: User, code: string, password?: string): Promise<Participant> {
    const room = await Room.findByOrFail('code', code)

    if (room.isClosed) {
      throw new Error('Cette room est fermée.')
    }

    // Vérifier le mot de passe si room privée
    if (room.isPrivate && room.password) {
      if (!password || !(await hash.verify(room.password, password))) {
        throw new Error('Mot de passe incorrect.')
      }
    }

    // Vérifier la capacité max
    const activeCount = await Participant.query()
      .where('room_id', room.id)
      .where('status', 'joined')
      .count('* as total')
    const count = Number((activeCount[0] as any).$extras.total)
    if (room.maxParticipants && count >= room.maxParticipants) {
      throw new Error('La room a atteint sa capacité maximale.')
    }

    // Trouver ou créer l'entrée participant
    let participant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', user.id)
      .first()

    if (!participant) {
      participant = await Participant.create({
        roomId: room.id,
        userId: user.id,
        role: 'participant',
        status: 'joined',
        canPublishVideo: true,
        canPublishAudio: true,
        canShareScreen: false,
        joinedAt: DateTime.now(),
      })
    } else {
      if (participant.status === 'kicked') {
        throw new Error("Vous avez été expulsé de cette room.")
      }
      await participant.merge({ status: 'joined', joinedAt: DateTime.now(), leftAt: null }).save()
    }

    // Passer la room en "active" si elle était en attente
    if (room.isWaiting) {
      await room.merge({ status: 'active', startedAt: DateTime.now() }).save()
    }

    // Notifier les autres participants via WebSocket
    await transmit.broadcast(`rooms/${code}/events`, {
      event: 'participant:joined',
      payload: {
        userId: user.id,
        name: user.fullName,
        role: participant.role,
        joinedAt: `${participant.joinedAt}`
      },
    })

    return participant
  }

  /**
   * Un participant quitte la room
   */
  async leaveRoom(user: User, code: string): Promise<void> {
    const room = await Room.findByOrFail('code', code)

    const participant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', user.id)
      .where('status', 'joined')
      .firstOrFail()

    await participant.merge({ status: 'left', leftAt: DateTime.now() }).save()

    // Nettoyer les transports mediasoup
    if (participant.transportId) {
      await MediasoupService.closeTransport(participant.transportId)
    }

    // Notifier
    await transmit.broadcast(`rooms/${code}/events`, {
      event: 'participant:left',
      payload: {
        userId: user.id,
        name: user.fullName,
        leftAt: `${participant.leftAt}`,
      },
    })

    // Si c'était l'hôte et qu'il quitte → fermer la room
    if (participant.isHost) {
      await this.closeRoom(user, code)
    }
  }

  /**
   * Ferme définitivement une room (hôte uniquement)
   */
  async closeRoom(host: User, code: string): Promise<void> {
    const room = await Room.findByOrFail('code', code)

    if (room.hostId !== host.id) {
      throw new Error("Seul l'hôte peut fermer la room.")
    }

    if (room.isClosed) return

    // Fermer le router mediasoup
    if (room.mediasoupRouterId) {
      await MediasoupService.closeRouter(room.mediasoupRouterId)
    }

    await room.merge({ status: 'closed', closedAt: DateTime.now() }).save()

    // Marquer tous les participants connectés comme partis
    await Participant.query()
      .where('room_id', room.id)
      .where('status', 'joined')
      .update({ status: 'left', left_at: DateTime.now().toSQL() })

    // Notifier tous les participants
    await transmit.broadcast(`rooms/${code}/events`, {
      event: 'room:closed',
      payload: {
        roomId: room.id,
        code: room.code,
        closedAt: `${room.closedAt}`,
        closedBy: { id: host.id, name: host.fullName },
      },
    })
  }

  /**
   * Ajoute un participant à la room (par l'hôte ou un modérateur)
   */
  async addParticipant(
    inviter: User,
    code: string,
    targetUserId: number,
    options?: {
      role?: 'moderator' | 'participant'
      canPublishVideo?: boolean
      canPublishAudio?: boolean
      canShareScreen?: boolean
    }
  ): Promise<Participant> {
    const room = await Room.findByOrFail('code', code)

    if (room.isClosed) {
      throw new Error('Cette room est fermée.')
    }

    // Vérifier que l'invitant est hôte ou modérateur
    const inviterParticipant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', inviter.id)
      .whereIn('role', ['host', 'moderator'])
      .firstOrFail()

    if (!inviterParticipant) {
      throw new Error("Vous n'avez pas la permission d'ajouter des participants.")
    }

    const targetUser = await User.findOrFail(targetUserId)

    // Vérifier si déjà participant
    const existing = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', targetUserId)
      .first()

    if (existing && existing.status !== 'left') {
      throw new Error('Cet utilisateur est déjà dans la room.')
    }

    let participant: Participant
    if (existing) {
      await existing.merge({
        status: 'invited',
        role: options?.role ?? 'participant',
        invitedBy: inviter.id,
        leftAt: null,
      }).save()
      participant = existing
    } else {
      participant = await Participant.create({
        roomId: room.id,
        userId: targetUserId,
        role: options?.role ?? 'participant',
        status: 'invited',
        canPublishVideo: options?.canPublishVideo ?? true,
        canPublishAudio: options?.canPublishAudio ?? true,
        canShareScreen: options?.canShareScreen ?? false,
        invitedBy: inviter.id,
      })
    }

    // Notifier la room
    await transmit.broadcast(`rooms/${code}/events`, {
      event: 'participant:added',
      payload: {
        userId: targetUser.id,
        name: targetUser.fullName,
        role: participant.role,
        addedBy: { id: inviter.id, name: inviter.fullName },
      },
    })

    return participant
  }

  /**
   * Retire (kick) un participant de la room
   */
  async removeParticipant(
    remover: User,
    code: string,
    targetUserId: number
  ): Promise<void> {
    const room = await Room.findByOrFail('code', code)
  
    const targetParticipant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', targetUserId)
      .firstOrFail()

    // On ne peut pas kicker l'hôte
    if (targetParticipant.isHost) {
      throw new Error("Impossible de retirer l'hôte de la room.")
    }

    if (targetParticipant.transportId) {
      await MediasoupService.closeTransport(targetParticipant.transportId)
    }

    const targetUser = await User.findOrFail(targetUserId)

    await targetParticipant.merge({ status: 'kicked', leftAt: DateTime.now() }).save()

    await transmit.broadcast(`rooms/${code}/events`, {
      event: 'participant:removed',
      payload: {
        userId: targetUserId,
        name: targetUser.fullName,
        removedBy: { id: remover.id, name: remover.fullName },
      },
    })
  }
}