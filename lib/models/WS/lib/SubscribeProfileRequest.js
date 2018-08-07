const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const channelSchema = require('./ChannelSchema')

const schemaFactory = channelSchema({
  channel: 'profile',
  type: 'subscribe',
  payload: Joi.object().keys({
    token: Joi.string().required()
  })
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class SubscribeProfileRequest extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }
}
