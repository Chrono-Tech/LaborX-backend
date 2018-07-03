const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  name: Joi.string(),
  url: Joi.string()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ReqruiterSocialModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    return new ReqruiterSocialModel({
      id: data._id.toString(),
      name: data.name,
      url: data.url
    })
  }
}
