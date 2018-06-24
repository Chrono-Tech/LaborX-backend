const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  domain: Joi.string().required(),
  type: Joi.string().required(),
  name: Joi.string().required(),
  value: Joi.boolean()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class NotificationToggleModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new NotificationToggleModel({
      ...data
    })
  }
}
