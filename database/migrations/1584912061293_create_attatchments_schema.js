'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateAttatchmentsSchema extends Schema {
  up () {
    this.create('attachments', (table) => {
      table.string('id',32).primary()
      table.integer('candidate_id').unsigned().references('id').inTable('candidates')
      table.string('filename', 80).notNullable()
      table.string('mime_type', 100).notNullable();
      table.integer('size').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('attachments')
  }
}

module.exports = CreateAttatchmentsSchema
