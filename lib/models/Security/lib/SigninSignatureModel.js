const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const Constants = requireRoot('lib/models/Constants')

const schemaFactory = () => Joi.object().keys({
  purpose: Joi.string().required().allow(Object.keys(Constants.projects)),
  roles: Joi.object().allow(null).keys({ // laborx roles
    isWorker: Joi.boolean().required(),
    isClient: Joi.boolean().required(),
    isRecruiter: Joi.boolean().required()
  })
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
