const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const Constants = requireRoot('lib/models/Constants')

const schemaFactory = () => Joi.object().keys({
  purpose: Joi.string().required().allow(Object.keys(Constants.projects))
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class SigninSignatureModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data) {
    return new SigninSignatureModel(data)
  }
}
