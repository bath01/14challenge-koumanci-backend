import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import RoomService from '#services/room_service'

const roomService = new RoomService()

// ─── Validators ───────────────────────────────────────────────────────────────

const createRoomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    description: vine.string().trim().optional(),
    isPrivate: vine.boolean().optional(),
    password: vine.string().minLength(4).optional(),
    maxParticipants: vine.number().min(2).max(200).optional(),
  })
)

const joinRoomValidator = vine.compile(
  vine.object({
    password: vine.string().optional(),
  })
)

// ─── Controller ──────────────────────────────────────────────────────────────

export default class RoomsController {
  /**
   * GET /rooms
   * Lister les rooms de l'utilisateur (en tant que participant ou hôte)
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const { default: Participant } = await import('#models/participant')

    const participations = await Participant.query()
      .where('user_id', user.id)
      .whereIn('status', ['invited', 'joined'])
      .preload('room', (q) => {
        q.preload('host', (hq) => hq.select(['id', 'fullName', 'email']))
      })

    const rooms = participations.map((p) => ({
      ...p.room.serialize(),
      myRole: p.role,
      myStatus: p.status,
    }))

    return response.ok({ data: rooms })
  }

  /**
   * POST /rooms
   * Créer une nouvelle room
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createRoomValidator)

    const room = await roomService.createRoom(user, data)
    await room.load('host', (q) => q.select(['id', 'fullName', 'email']))

    return response.created({
      message: 'Room créée avec succès.',
      data: room.serialize(),
    })
  }

  /**
   * GET /rooms/:code
   * Détail d'une room par son code
   */
  async show({ params, response }: HttpContext) {
    const room = await roomService.getRoomByCode(params.code)

    return response.ok({ data: room.serialize() })
  }

  /**
   * POST /rooms/:code/join
   * Rejoindre une room
   */
  async join({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { password } = await request.validateUsing(joinRoomValidator)

    const participant = await roomService.joinRoom(user, params.code, password)

    return response.ok({
      message: 'Vous avez rejoint la room.',
      data: participant.serialize(),
    })
  }

  /**
   * POST /rooms/:code/leave
   * Quitter une room
   */
  async leave({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await roomService.leaveRoom(user, params.code)

    return response.ok({ message: 'Vous avez quitté la room.' })
  }

  /**
   * DELETE /rooms/:code
   * Fermer définitivement une room (hôte uniquement)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await roomService.closeRoom(user, params.code)

    return response.ok({ message: 'Room fermée avec succès.' })
  }
}