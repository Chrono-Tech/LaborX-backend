const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().required(),
  name: Joi.string().required(),
  code: Joi.number().required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ServiceCategoryModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new ServiceCategoryModel(data)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    return new ServiceCategoryModel({
      id: data._id.toString(),
      name: data.name,
      code: data.code
    })
  }
}
