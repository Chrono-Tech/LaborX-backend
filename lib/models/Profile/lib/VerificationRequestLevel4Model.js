const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  country: Joi.string().required(),
  state: Joi.string(),
  city: Joi.string().required(),
  zip: Joi.string().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string(),
  attachments: Joi.array().items(Joi.string())
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestLevel4Model extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestLevel4Model({
      ...data
    })
  }
}
