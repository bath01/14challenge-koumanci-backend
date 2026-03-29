import { RoomSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Participant from './participant.ts'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.ts'

export default class Room extends RoomSchema {
    get isActive() {
        return this.status === 'active'
    }

    get isClosed() {
        return this.status === 'closed'
    }

    get isWaiting() {
        return this.status === 'waiting'
    }

    @hasMany(() => Participant)
    declare participants: HasMany<typeof Participant>

    @belongsTo(() => User, { foreignKey: 'hostId' })
    declare host: BelongsTo<typeof User>
}