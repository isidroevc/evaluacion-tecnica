'use strict'
const indicative = require('indicative')
class StoreCandidate {
  get rules () {
    return {
      country_id:  'required',
      name: 'required|max:80',
      last_name: 'required|max:80',
      age: 'required|range:15,130',
      current_job: 'max:100',
      email: 'required|email|max:80',
      phone: 'required|max:10',
      company: 'max:100',
      province: 'required|max:100',
      city: 'required|max:100'
    }
  }
  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreCandidate
