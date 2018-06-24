const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = (type) => ({
  type: Joi.string().valid(['update', 'delete']),
  channel: Joi.string().valid('tokens'),
  requestId: Joi.string().required(),
  payload: Joi.object().type(type).required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ProfileMessage extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromServer ({ type, payload, requestId }) {
    return new ProfileMessage({
      channel: 'tokens',
      type,
      requestId,
      payload
    },
    { stripUnknown: true })
  }
}
