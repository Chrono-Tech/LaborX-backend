const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const PersonModel = require('./PersonModel').model

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  position: Joi.string().required(),
  person: Joi.object().type(PersonModel).required(),
  hasApproveFromCollaborator: Joi.boolean(),
  hasApproveFromClient: Joi.boolean()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ClientCollaboratorModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    return new ClientCollaboratorModel({
      id: data._id.toString(),
      position: data.position,
      person: PersonModel.fromMongo(data.user, context, options),
      hasApproveFromClient: data.hasApproveFromClient || false,
      hasApproveFromCollaborator: data.hasApproveFromCollaborator || false
    })
  }
}
