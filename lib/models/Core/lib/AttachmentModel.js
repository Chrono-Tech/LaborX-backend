const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  url: Joi.string().allow([null, '']),
  name: Joi.string().allow([null, '']),
  mimetype: Joi.string().allow([null, '']),
  size: Joi.number()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class AttachmentModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new AttachmentModel(data)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    console.log(data)
    return new AttachmentModel({
      id: data._id.toString(),
      url: data.url,
      name: data.file.originalname,
      mimetype: data.file.mimetype,
      size: data.file.size
    })
  }
}
