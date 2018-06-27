const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const Constants = requireRoot('lib/models/Constants')

const schemaFactory = () => ({
  till: Joi.number().required(),
  project: Joi.string().required().allow(Object.keys(Constants.projects))
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ActivityLogRequest extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }
}
