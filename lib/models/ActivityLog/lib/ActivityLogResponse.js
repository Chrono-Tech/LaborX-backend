const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const ActivityLogModelSchema = require('./ActivityLogModel').schema

const schemaFactory = () => ({
  records: Joi.array().items(ActivityLogModelSchema)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ActivityLogResponse extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }
}
