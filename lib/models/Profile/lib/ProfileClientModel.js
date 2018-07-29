const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { ImageModel, AttachmentModel, ServiceCategoryModel } = requireRoot('lib/models/Core')
const ClientCollaboratorModel = require('./ClientCollaboratorModel').model

const fragmentSchemaFactory = () => ({
  verifiable: {
    name: Joi.string(),
    type: Joi.string().required(),
    intro: Joi.string().allow([null, '']),
    pageBackground: Joi.object().type(ImageModel).allow(null),
    website: Joi.string(),
    email: Joi.string(),
    attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
  },
  regular: {},
  custom: Joi.any().allow(null),
  collaborators: Joi.array().items(Joi.object().type(ClientCollaboratorModel)).allow(null)
})

const schemaFactory = () => ({
  id: Joi.string().allow(null),
  submitted: Joi.object().allow(null).keys({
    ...fragmentSchemaFactory(),
    validationComment: Joi.string().allow([null, ''])
  }),
  approved: Joi.object().allow(null).keys({
    ...fragmentSchemaFactory()
  }),
  isRequested: Joi.boolean()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ProfileClientModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo ({ client, request, user }, context, options) {
    return new ProfileClientModel({
      id: !client ? null : client._id.toString(),
      submitted: !request ? null : {
        ...clientFragment(request),
        validationComment: request.validationComment
      },
      approved: !client ? null : {
        ...clientFragment(client)
      },
      isRequested: user.client.isRequested
    })
  }
}

function clientFragment (data) {
  return {
    verifiable: {
      name: data.verifiable.name,
      type: data.verifiable.type,
      intro: data.verifiable.intro,
      pageBackground: ImageModel.fromMongo(data.verifiable.pageBackground),
      website: data.verifiable.website,
      email: data.verifiable.email,
      attachments: !data.verifiable.attachments ? null : data.verifiable.attachments.map(AttachmentModel.fromMongo)
    },
    regular: {},
    custom: data.custom,
    collaborators: !data.collaborators ? null : data.collaborators.map(ClientCollaboratorModel.fromMongo)
  }
}
