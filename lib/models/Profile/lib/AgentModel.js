const Joi = require('joi')
const AbstractModel = require('../../AbstractModel')

const schemaFactory = () => ({
  key: Joi.string().required(),
  isLocked: Joi.boolead(),
  purpose: Joi.string().required(), // Network, application or any other determinator
  principal: Joi.string().required(), // Principal address
  contract: Joi.string().required(), // Contract name
  address: Joi.string().required() // Agent contract address
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class AgentModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    return new AgentModel({
      key: data._id.toString(),
      isLocked: data.isLocked,
      purpose: data.purpose,
      principal: data.principal,
      contract: data.contract,
      address: data.address
    })
  }
}
