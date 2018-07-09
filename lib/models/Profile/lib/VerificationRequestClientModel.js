const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  regular: Joi.object().allow(null).keys({
    specializations: Joi.array().items(Joi.number()) // codes
  }),
  verifiable: {
    name: Joi.string().required(),
    type: Joi.string().required(),
    intro: Joi.string().allow([null, '']),
    pageBackground: Joi.string().allow(null),
    website: Joi.string().allow([null, '']),
    email: Joi.string().allow([null, '']),
    attachments: Joi.array().items(Joi.string())
  },
  custom: Joi.any().allow(null),
  collaborators: Joi.array().items(Joi.object().type(VerificationRequestCollaboratorModel)).allow(null)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestClientModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestClientModel({
      ...data,
      collaborators: !data.collaborators ? null : data.collaborators.map(VerificationRequestCollaboratorModel.fromJson)
    })
  }
}

class VerificationRequestCollaboratorModel extends AbstractModel {
  constructor (data) {
    super(data, {
      position: Joi.string().required(),
      user: Joi.string().required()
    })
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestCollaboratorModel({
      ...data
    })
  }
}
