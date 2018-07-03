const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { ImageModel, AttachmentModel } = requireRoot('lib/models/Core')
const ReqruiterSocialModel = require('./ReqruiterSocialModel').model
const ReqruiterServiceModel = require('./ReqruiterServiceModel').model

const fragmentSchemaFactory = () => ({
  verifiable: {
    intro: Joi.string().allow([null, '']),
    pageBackground: Joi.object().type(ImageModel).allow(null),
    attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
  },
  custom: Joi.any().allow(null),
  socials: Joi.array().items(Joi.object().type(ReqruiterSocialModel)).allow(null),
  services: Joi.array().items(Joi.object().type(ReqruiterServiceModel)).allow(null)
})

const schemaFactory = () => ({
  id: Joi.string().allow(null),
  submitted: Joi.object().allow(null).keys({
    ...fragmentSchemaFactory(),
    validationComment: Joi.string().allow([null, ''])
  }),
  approved: Joi.object().allow(null).keys({
    ...fragmentSchemaFactory()
  })
})

module.exports.schemaFactory = schemaFactory
module.exports.model = class ProfileReqruiterModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo ({ reqruiter, request }, context, options) {
    return new ProfileReqruiterModel({
      id: !reqruiter ? null : reqruiter._id.toString(),
      submitted: !request ? null : {
        ...reqruiterFragment(request),
        validationComment: request.validationComment
      },
      approved: !reqruiter ? null : {
        ...reqruiterFragment(reqruiter)
      }
    })
  }
}

function reqruiterFragment (data) {
  return {
    verifiable: {
      intro: data.verifiable.intro,
      pageBackground: ImageModel.fromMongo(data.verifiable.pageBackground),
      attachments: !data.verifiable.attachments ? null : data.verifiable.attachments.map(AttachmentModel.fromMongo)
    },
    custom: data.custom,
    socials: !data.socials ? null : data.socials.map(ReqruiterSocialModel.fromMongo),
    services: !data.services ? null : data.services.map(ReqruiterServiceModel.fromMongo)
  }
}
