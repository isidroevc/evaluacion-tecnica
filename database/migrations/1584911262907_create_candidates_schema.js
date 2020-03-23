'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateCandidatesSchema extends Schema {
  up () {
    this.create('candidates', (table) => {
      table.increments()
      table.integer('country_id')
        .unsigned()
        .references('id')
        .inTable('countries')
      table.string('name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.integer('age').unsigned().notNullable()
      table.string('current_job', 100)
      table.string('email', 80).notNullable()
      table.string('phone', 15).notNullable()
      table.string('company', 100)
      table.string('province', 100).notNullable()
      table.string('city', 100).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('candidates')
  }
}

module.exports = CreateCandidatesSchema
