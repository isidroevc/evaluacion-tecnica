'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Candidate extends Model {
  attachments() {
    return this.hasMany('App/Models/Attachment')
  }
  country() {
    return this.belongsTo('App/Models/Country')
  }
}

module.exports = Candidate
