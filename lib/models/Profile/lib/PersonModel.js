const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const getValidationLevel = (user) => {
  if (user.level4.isValid) return 4
  if (user.level3.isValid) return 3
  if (user.level2.isValid) return 2
  if (user.level1.isValid) return 1
  return 0
}

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  ipfsHash: Joi.string().allow([null, '']),
  address: Joi.string(),
  avatar: Joi.string(),
  userName: Joi.string(),
  validationLevel: Joi.number()
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
      userName: data.level1.userName,
      validationLevel: getValidationLevel(data)
    })
  }
}
