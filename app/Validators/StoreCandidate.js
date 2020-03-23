'use strict'

class StoreCandidate {
  get rules () {
    return {
      country_id:  'required',
      name: 'required|max:80',
      last_name: 'required|max:80',
      age: 'required|range:1,130',
      current_job: 'max:100',
      email: 'required|email|max:80',
      phone: 'required|max:15',
      company: 'max:100',
      province: 'required|max:100',
      city: 'required|max:100'
    }
  }
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreCandidate
