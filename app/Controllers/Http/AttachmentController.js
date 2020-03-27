'use strict'
const Attachment = use('App/Models/Attachment')
const Drive = use('Drive')
class AttachmentController {
  async download({params, response}) {
    let id = params.id
    const attachment = await Attachment.findBy('id', id)
    if (!attachment) {
      response.status(200).send({
        message: 'File not found'
      })
    }
    const file = Drive.getStream(id)
    response.implicitEnd = false
    response.response.setHeader('Content-type', attachment.mime_type)
    response.response.setHeader('Content-disposition', 'attachment; filename=' + attachment.filename)
    file.pipe(response.response)
  }
}

module.exports = AttachmentController
