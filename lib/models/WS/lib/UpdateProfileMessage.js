const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const channelSchema = require('./ChannelSchema')

const schemaFactory = channelSchema({
  channel: 'profile',
  type: 'update',
  payload: {
    id: Joi.string().required()
  }
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class UpdateProfileMessage extends AbstractModel {
  constructor (data, options) {
    super({
      channel: 'profile',
      type: 'update',
      ...data
    },
    schemaFactory,
    options)
    Object.freeze(this)
  }
}
