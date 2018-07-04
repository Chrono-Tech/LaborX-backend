const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { ImageModel, AttachmentModel } = requireRoot('lib/models/Core')
const RecruiterSocialModel = require('./RecruiterSocialModel').model
const RecruiterServiceModel = require('./RecruiterServiceModel').model

const fragmentSchemaFactory = () => ({
  verifiable: {
    intro: Joi.string().allow([null, '']),
    pageBackground: Joi.object().type(ImageModel).allow(null),
    attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
  },
  custom: Joi.any().allow(null),
  socials: Joi.array().items(Joi.object().type(RecruiterSocialModel)).allow(null),
  services: Joi.array().items(Joi.object().type(RecruiterServiceModel)).allow(null)
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

module.exports.model = class ProfileRecruiterModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo ({ recruiter, request }, context, options) {
    return new ProfileRecruiterModel({
      id: !recruiter ? null : recruiter._id.toString(),
      submitted: !request ? null : {
        ...recruiterFragment(request),
        validationComment: request.validationComment
      },
      approved: !recruiter ? null : {
        ...recruiterFragment(recruiter)
      }
    })
  }
}

function recruiterFragment (data) {
  return {
    verifiable: {
      intro: data.verifiable.intro,
      pageBackground: ImageModel.fromMongo(data.verifiable.pageBackground),
      attachments: !data.verifiable.attachments ? null : data.verifiable.attachments.map(AttachmentModel.fromMongo)
    },
    custom: data.custom,
    socials: !data.socials ? null : data.socials.map(RecruiterSocialModel.fromMongo),
    services: !data.services ? null : data.services.map(RecruiterServiceModel.fromMongo)
  }
}
