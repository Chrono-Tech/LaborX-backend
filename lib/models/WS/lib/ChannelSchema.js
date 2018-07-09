const Joi = require('joi')

const schemaFactory = ({ type, channel, payload }) => Joi.object().keys({
  channel: Joi.string().valid(channel),
  type: Joi.string().valid(type),
  requestId: Joi.string().required(),
  payload: payload
})

module.exports = schemaFactory
