const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => Joi.object().keys({
  contract: Joi.string().required(),
  code: Joi.string().required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class Verify2FACodeModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data) {
    return new Verify2FACodeModel({
      ...data
    })
  }
}
