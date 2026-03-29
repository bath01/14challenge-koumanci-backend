/*
|--------------------------------------------------------------------------
| Canaux WebSocket (SSE via @adonisjs/transmit)
|--------------------------------------------------------------------------
|
| Chaque canal peut définir une politique d'autorisation.
| Le client s'y abonne via l'URL :
|   GET /api/__transmit/events?channels[]=rooms/XK3-9AB-72Z/events
|
| Côté client JS :
|   import { Transmit } from '@adonisjs/transmit-client'
|   const transmit = new Transmit({ baseUrl: 'http://localhost:3333' })
|   const sub = transmit.subscription('rooms/XK3-9AB-72Z/events')
|   await sub.create()
|   sub.onMessage((data) => console.log(data))
|
*/

import transmit from '@adonisjs/transmit/services/main'
import Room from '#models/room'
import Participant from '#models/participant'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Canal des événements de conférence d'une room
 * rooms/:code/events
 *
 * Événements émis :
 *  - participant:joined  { userId, name, role, joinedAt }
 *  - participant:left    { userId, name, leftAt }
 *  - participant:added   { userId, name, role, addedBy }
 *  - participant:removed { userId, removedBy }
 *  - room:closed         { roomId, code, closedAt, closedBy }
 *  - rtc:new-producer    { producerId, kind, participantId }
 *  - rtc:producer-closed { producerId }
 */
transmit.authorize<{ code: string }>(
  'rooms/:code/events',
  async (ctx: HttpContext, { code }) => {
    // L'utilisateur doit être authentifié
    try {
      await ctx.auth.authenticate()
    } catch {
      return false
    }

    const user = ctx.auth.getUserOrFail()

    // L'utilisateur doit être participant (ou hôte) de la room
    const room = await Room.findBy('code', code)
    if (!room) return false

    // Vérifie qu'il est bien dans la room (invité ou déjà joiné)
    const participant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', user.id)
      .whereIn('status', ['invited', 'joined'])
      .first()

    return !!participant
  }
)

/**
 * Canal de signalisation WebRTC d'une room
 * rooms/:code/signals
 *
 * Utilisé pour les échanges ICE/SDP entre participants.
 * Les signaux sont relayés via le serveur (pas de P2P direct).
 */
transmit.authorize<{ code: string }>(
  'rooms/:code/signals',
  async (ctx: HttpContext, { code }) => {
    try {
      await ctx.auth.authenticate()
    } catch {
      return false
    }

    const user = ctx.auth.getUserOrFail()

    const room = await Room.findBy('code', code)
    if (!room) return false

    const participant = await Participant.query()
      .where('room_id', room.id)
      .where('user_id', user.id)
      .where('status', 'joined')
      .first()

    return !!participant
  }
)