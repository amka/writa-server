import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notes extends BaseSchema {
  protected tableName = 'notes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('content').notNullable()
      table.integer('author_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.integer('story_id')
        .unsigned()
        .references('stories.id')
        .onDelete('CASCADE')

      table.string('slug').nullable()
      table.boolean('deleted').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
