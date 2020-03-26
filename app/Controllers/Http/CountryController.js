'use strict'
const Country = use('App/Models/Country')
class CountryController {
  async get({response}) {
    return await Country.all();
  }
}

module.exports = CountryController
