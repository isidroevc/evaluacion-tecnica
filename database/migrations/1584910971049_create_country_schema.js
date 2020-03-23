'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateCountrySchema extends Schema {
  up () {
    this.create('countries', (table) => {
      table.integer('id').unsigned().primary()
      table.string('name', 80).notNullable()
      table.string('dial_code',4).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('countries')
  }
}

module.exports = CreateCountrySchema
