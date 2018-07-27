const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  email: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  company: Joi.string().allow(''),
  website: Joi.string().allow('')
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestLevel2Model extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestLevel2Model({
      ...data
    })
  }
}
