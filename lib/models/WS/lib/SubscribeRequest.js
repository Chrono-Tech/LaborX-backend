const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  type: Joi.string().valid('subscribe'),
  channel: Joi.string(),
  requestId: Joi.string().required(),
  payload: Joi.any()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class SubscribeRequest extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }
}
