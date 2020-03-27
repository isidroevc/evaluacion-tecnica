'use strict'
class UpdateCandidate {
  get rules () {
    return {
      name: 'max:80',
      last_name: 'max:80',
      age: 'range:1,130',
      current_job: 'max:100',
      email: 'email|max:80',
      phone: 'required|max:10',
      company: 'max:100',
      province: 'max:100',
      city: 'max:100'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = UpdateCandidate
