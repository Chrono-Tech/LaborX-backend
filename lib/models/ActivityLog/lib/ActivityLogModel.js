const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const Constants = requireRoot('lib/models/Constants')

const schemaFactory = () => ({
  user: Joi.string().required(),
  project: Joi.string().required().allow(Object.keys(Constants.projects)),
  type: Joi.string().required(),
  activityAt: Joi.number().required(),
  payload: Joi.any()
})

module.exports.schema = schemaFactory()

module.exports.model = class ActivityLogModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }

    return new ActivityLogModel({
      ...data,
      payload: data.payload && JSON.stringify(data.payload)
    })
  }

  static fromMongo (data) {
    return new ActivityLogModel({
      ...data.toObject(),
      user: data.user.toString(),
      activityAt: data.activityAt.getTime()
    }, { stripUnknown: true })
  }
}
