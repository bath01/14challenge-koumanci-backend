import { ParticipantSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Room from './room.ts'

export default class Participant extends ParticipantSchema {
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => User, { foreignKey: 'invitedBy' })
    declare inviter: BelongsTo<typeof User>

    @belongsTo(() => Room)
    declare room: BelongsTo<typeof Room>

    get isJoined() {
        return this.status === 'joined'
    }

    get isHost() {
        return this.role === 'host'
    }
}