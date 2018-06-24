const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  userName: Joi.string().required(),
  birthDate: Joi.date().required(),
  avatar: Joi.string().allow(null)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestLevel1Model extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestLevel1Model({
      ...data,
      birthDate: !data.birthDate ? null : new Date(data.birthDate)
    })
  }
}
