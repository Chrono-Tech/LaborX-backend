const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { ImageModel, AttachmentModel, CurrencyModel } = requireRoot('lib/models/Core')
const WorkerSocialModel = require('./WorkerSocialModel').model
const WorkerServiceModel = require('./WorkerServiceModel').model
const WorkerEmploymentModel = require('./WorkerEmploymentModel').model

const fragmentSchemaFactory = () => ({
  regular: Joi.object().allow(null).keys({
    currencies: Joi.array().items(Joi.object().type(CurrencyModel)).allow(null),
    hourlyCharge: Joi.string().allow([null, ''])
  }),
  verifiable: {
    intro: Joi.string().allow([null, '']),
    pageBackground: Joi.object().type(ImageModel).allow(null),
    attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
  },
  custom: Joi.any().allow(null),
  socials: Joi.array().items(Joi.object().type(WorkerSocialModel)).allow(null),
  services: Joi.array().items(Joi.object().type(WorkerServiceModel)).allow(null),
  employments: Joi.array().items(Joi.object().type(WorkerEmploymentModel)).allow(null)
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

module.exports.model = class ProfileWorkerModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo ({ worker, request }, context, options) {
    return new ProfileWorkerModel({
      id: !worker ? null : worker._id.toString(),
      submitted: !request ? null : {
        ...workerFragment(request),
        validationComment: request.validationComment
      },
      approved: !worker ? null : {
        ...workerFragment(worker)
      }
    })
  }
}

function workerFragment (data) {
  return {
    regular: {
      hourlyCharge: data.regular.hourlyCharge,
      currencies: !data.regular.currencies ? null : data.regular.currencies.map(CurrencyModel.fromMongo)
    },
    verifiable: {
      intro: data.verifiable.intro,
      pageBackground: ImageModel.fromMongo(data.verifiable.pageBackground),
      attachments: !data.verifiable.attachments ? null : data.verifiable.attachments.map(AttachmentModel.fromMongo)
    },
    custom: data.custom,
    socials: !data.socials ? null : data.socials.map(WorkerSocialModel.fromMongo),
    services: !data.services ? null : data.services.map(WorkerServiceModel.fromMongo),
    employments: !data.employments ? null : data.employments.map(WorkerEmploymentModel.fromMongo)
  }
}
