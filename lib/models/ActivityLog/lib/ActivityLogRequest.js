const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  till: Joi.number().required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ActivityLogRequest extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }
}
