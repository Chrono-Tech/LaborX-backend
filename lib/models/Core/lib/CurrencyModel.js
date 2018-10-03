const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().required(),
  symbol: Joi.string().required(),
  title: Joi.string().required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class CurrencyModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new CurrencyModel(data)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    return new CurrencyModel({
      id: data._id.toString(),
      symbol: data.symbol,
      title: data.title
    })
  }
}
