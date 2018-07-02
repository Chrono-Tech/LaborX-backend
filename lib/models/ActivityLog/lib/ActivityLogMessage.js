const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const Constants = requireRoot('lib/models/Constants')

const schemaFactory = () => Joi.object().keys({
  user: Joi.string().allow(null),
  userSignature: Joi.string().lowercase().allow(null),
  project: Joi.string().required().allow(Object.keys(Constants.projects)),
  type: Joi.string().required(),
  activityAt: Joi.number().required(),
  payload: Joi.any()
}).xor('user', 'userSignature')

module.exports.schema = schemaFactory()

module.exports.model = class ActivityLogMessage extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }

    return new ActivityLogMessage({
      ...data,
      payload: data.payload && JSON.stringify(data.payload)
    })
  }
}
