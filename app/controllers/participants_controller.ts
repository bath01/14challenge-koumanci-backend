import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import RoomService from '#services/room_service'
import Room from '#models/room'
import Participant from '#models/participant'

const roomService = new RoomService()

const addParticipantValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    role: vine.enum(['moderator', 'participant']).optional(),
    canPublishVideo: vine.boolean().optional(),
    canPublishAudio: vine.boolean().optional(),
    canShareScreen: vine.boolean().optional(),
  })
)

export default class ParticipantsController {
  /**
   * GET /rooms/:code/participants
   * Lister les participants actifs d'une room
   */
  async index({ params, response }: HttpContext) {
    const room = await Room.findByOrFail('code', params.code)

    const participants = await Participant.query()
      .where('room_id', room.id)
      .whereIn('status', ['invited', 'joined'])
      .preload('user', (q) => q.select(['id', 'fullName', 'email']))
      .preload('inviter', (q) => q.select(['id', 'fullName']))
      .orderBy('created_at', 'asc')

    return response.ok({ data: participants.map((p) => p.serialize()) })
  }

  /**
   * POST /rooms/:code/participants
   * Ajouter un participant à la room (hôte/modérateur seulement)
   */
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(addParticipantValidator)

    const participant = await roomService.addParticipant(
      user,
      params.code,
      data.userId,
      {
        role: data.role,
        canPublishVideo: data.canPublishVideo,
        canPublishAudio: data.canPublishAudio,
        canShareScreen: data.canShareScreen,
      }
    )

    return response.created({
      message: 'Participant ajouté avec succès.',
      data: participant.serialize(),
    })
  }

  /**
   * DELETE /rooms/:code/participants/:userId
   * Retirer un participant de la room (hôte/modérateur seulement)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await roomService.removeParticipant(user, params.code, Number(params.userId))

    return response.ok({ message: 'Participant retiré de la room.' })
  }
}