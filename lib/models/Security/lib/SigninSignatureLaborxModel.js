const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => Joi.object().keys({
  purpose: 'laborx',
  roles: Joi.object().allow(null).keys({
    isWorker: Joi.boolean().required(),
    isClient: Joi.boolean().required(),
    isRecruiter: Joi.boolean().required()
  })
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class SigninSignatureLaborxModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data) {
    return new SigninSignatureLaborxModel(data)
  }
}
