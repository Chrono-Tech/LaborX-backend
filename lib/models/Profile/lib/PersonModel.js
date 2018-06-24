const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  ipfsHash: Joi.string().allow([null, '']),
  address: Joi.string(),
  avatar: Joi.string(),
  userName: Joi.string()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class PersonModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    return new PersonModel({
      id: data._id.toString(),
      ipfsHash: data.ipfsHash,
      address: context.address,
      avatar: data.avatar.secure_url,
      userName: data.level1.userName
    })
  }
}
