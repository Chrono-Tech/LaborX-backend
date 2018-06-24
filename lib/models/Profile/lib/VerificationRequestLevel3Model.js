const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  passport: Joi.string().required(),
  expirationDate: Joi.date().required(),
  attachments: Joi.array().items(Joi.string())
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestLevel3Model extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestLevel3Model({
      ...data,
      expirationDate: !data.expirationDate ? null : new Date(data.expirationDate)
    })
  }
}
