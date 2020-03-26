'use strict'
const { validate } = use('Validator')
const Candidate = use('App/Models/Candidate')
const Attachment = use('App/Models/Attachment')
const Database = use('Database')
const Drive = use('Drive')
const uniqid = require('uniqid')
const fs = require('fs')
class CandidateController {

  async _validateFiles(files) {
    const validExtensions = ['jpg', 'png', 'pdf']
    const validSize = 5 * 1000 * 1000
    let messages = []
    files.forEach(file => {
      if (!validExtensions.includes(file.extname) || file.size > validSize) {
        messages.push(`file ${file.clientName} is not valid for this request`)
      }
    })
    return messages
  }

  async _createAttachment(candidate_id, transaction, file) {
    let attachment = {}
    attachment.id = uniqid()
    attachment.candidate_id = candidate_id
    attachment.mime_type = file.headers['content-type']
    attachment.size = file.size
    attachment.filename = file.clientName
    await Attachment.create(attachment, transaction)
    const buffer = fs.readFileSync(file.tmpPath)
    console.log(buffer.length)
    console.log(file.tmpPath)
    await Drive.put(attachment.id, buffer)
  }

  async store({request, response}) {
    const files = request.file('files')._files
    const data = request.only([
      'country_id',
      'name',
      'last_name',
      'age',
      'current_job',
      'email',
      'phone',
      'company',
      'province',
      'city'
    ])
    const filesValidationMessages = await this._validateFiles(files)
    if (filesValidationMessages.length > 0) {
      return response.status(400)
        .send(filesValidationMessages)
    }
    const transaction = await Database.beginTransaction()
    try {
      const candidate = await Candidate.create(data, transaction)
      for(let i = 0; i < files.length; i++)
        await this._createAttachment(candidate.id, transaction, files[i])
      await transaction.commit()
      await candidate.load('attachments')
      return candidate
    } catch(error) {
      await transaction.rollback()
      return response.status(error.status).send(error)
    }
  }

  async findById({params, response}) {
    const candidate = await Candidate.findBy('id', params.id)
    if (!candidate) {
      return response.status(404).send({
        message: 'Model instance not found'
      })
    }
    await candidate.load('attachments')
    return candidate
  }

  async search({request}) {
    const { country_id, param, page } = request.all()
    let candidateQuery = Candidate.query()
    if (country_id) {
      candidateQuery = candidateQuery.where('country_id', country_id)
    }
    if (param) {
      let likeParam = `%${param}%`
      candidateQuery = candidateQuery.where(builder => {
        builder.orWhere('name', 'ilike', likeParam)
        .orWhere('last_name','ilike', likeParam)
        .orWhere('current_job','ilike', likeParam)
        .orWhere('phone', 'ilike', likeParam)
        .orWhere('company', 'ilike', likeParam)
        .orWhere('city', 'ilike', likeParam)
        .orWhere('province', 'ilike', likeParam)
      })
    }
    return await candidateQuery.with('country').paginate(page, 10)
  }

  async update({request, response, params}) {
    let files = request.file('files');
    if (files)
      files = files._files;
      const data = request.only([
        'country_id',
        'name',
        'last_name',
        'age',
        'current_job',
        'email',
        'phone',
        'company',
        'province',
        'city'
      ])
    const id = params.id
    const candidate = await Candidate.findBy('id', id)
    if (!candidate) {
      return response.status(404)
        .send({
          message: 'Model instance not found'
        })
    }
    if (files) {
      const filesValidationMessages = await this._validateFiles(files)
      if (filesValidationMessages.length > 0) {
        return response.status(400)
          .send(filesValidationMessages)
      }
    }
    const transaction = await Database.beginTransaction()
    try {
      await Candidate.query().where('id', id).update(data, transaction)
      if(files)
        for(let i = 0; i < files.length; i++)
          await this._createAttachment(id, transaction, files[i])
      await transaction.commit()
      await candidate.load('attachments')
      return candidate
    } catch(error) {
      console.log(error)
      await transaction.rollback()
      return response.status(500).send(error)
    }
  }


  async delete({response, params}) {
    const candidate = await Candidate.findBy('id', params.id)
    if (!candidate) {
      return response.status(404)
        .send({
          message: 'Model instance not found'
        })
    }
    await Attachment.query()
      .where('candidate_id', candidate.id)
      .delete()
    if (!await candidate.delete()) {
      return response
        .status(500)
        .send({
          message: 'Could not delete data'
        })
    }
    return response.status(204).send()
  }

  async deleteAttachment({response, params}) {
    const attachment = await Attachment.findBy('id', params.attachment_id)
    const transaction = await Database.beginTransaction()
    try {
      await attachment.delete()
      await Drive.delete(attachment.id)
      await transaction.commit()
    } catch(error) {
      await transaction.rollback()
      return response.status(error.status).send(error)
    }
  }

  
}

module.exports = CandidateController
