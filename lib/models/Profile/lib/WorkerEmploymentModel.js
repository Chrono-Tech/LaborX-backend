const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  organization: Joi.string(),
  since: Joi.date(),
  until: Joi.date(),
  responsibilities: Joi.string()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class WorkerServiceModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    return new WorkerServiceModel({
      id: data._id.toString(),
      organization: data.organization,
      since: !data.since ? null : new Date(data.since),
      until: !data.until ? null : new Date(data.until),
      responsibilities: data.responsibilities
    })
  }
}
