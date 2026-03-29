import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'participants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.enum('role', ['host', 'moderator', 'participant']).defaultTo('participant')

      table.enum('status', ['invited', 'joined', 'left', 'kicked']).defaultTo('invited')

      table.boolean('can_publish_video').defaultTo(true)
      table.boolean('can_publish_audio').defaultTo(true)
      table.boolean('can_share_screen').defaultTo(true)

      table.boolean('video_enabled').defaultTo(false)
      table.boolean('audio_enabled').defaultTo(false)
      table.boolean('screen_sharing').defaultTo(false)

      // Données WebRTC mediasoup
      table.string('transport_id').nullable()
      table.jsonb('producers').defaultTo('[]') // [{producerId, kind}]

      table.integer('invited_by').unsigned().references('id').inTable('users').nullable()

      table.timestamp('joined_at').nullable()
      table.timestamp('left_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Un utilisateur ne peut être qu'une fois dans une room
      table.unique(['room_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}