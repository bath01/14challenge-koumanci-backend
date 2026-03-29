import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code', 20).notNullable().unique()
 
      table.string('name', 255).notNullable()
      table.text('description').nullable()
 
      table.integer('host_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
 
      table.enum('status', ['waiting', 'active', 'closed']).defaultTo('waiting')
 
      table.boolean('is_private').defaultTo(false)
      table.string('password', 255).nullable()
      table.integer('max_participants').defaultTo(50)
 
      table.string('mediasoup_router_id').nullable()
 
      table.timestamp('started_at').nullable()
      table.timestamp('closed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}