const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const Constants = requireRoot('lib/models/Constants')

const schemaFactory = () => ({
  user: Joi.string().required(),
  project: Joi.string().required().allow(Object.keys(Constants.projects)),
  type: Joi.string().required(),
  activityAt: Joi.number().required(),
  payload: Joi.string()
})

module.exports.schema = schemaFactory()

module.exports.model = class ActivityLogModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data) {
    return new ActivityLogModel({
      ...data.toObject(),
      user: data.user.toString(),
      activityAt: data.activityAt.getTime()
    }, { stripUnknown: true })
  }
}
