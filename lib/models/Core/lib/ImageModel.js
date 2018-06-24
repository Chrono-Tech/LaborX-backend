const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().required(),
  url: Joi.string().required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ImageModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new ImageModel(data)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    return new ImageModel({
      id: data._id.toString(),
      url: data.image.secure_url
    })
  }
}
