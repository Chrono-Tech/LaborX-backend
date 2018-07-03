const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { ImageModel, AttachmentModel, CurrencyModel } = requireRoot('lib/models/Core')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  ipfsHash: Joi.string().allow([null, '']),
  submitted: Joi.object().allow(null).keys({
    intro: Joi.string().allow([null, '']),
    currencies: Joi.array().items(Joi.object().type(CurrencyModel)).allow(null),
    pageBackground: Joi.object().type(ImageModel).allow(null),
    hourlyCharge: Joi.string().allow([null, '']),
    attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null),
    validationComment: Joi.string().allow([null, ''])
  }),
  approved: Joi.object().allow(null).keys({
    registeredAt: Joi.date().allow(null),
    intro: Joi.string().allow([null, '']),
    currencies: Joi.array().items(Joi.object().type(CurrencyModel)).allow(null),
    pageBackground: Joi.object().type(ImageModel).allow(null),
    hourlyCharge: Joi.string().allow([null, '']),
    attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
  }),
  settings: Joi.object()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ProfileWorkerModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new ProfileWorkerModel({
      ...data,
      submitted: !data.submitted ? null : {
        ...data.submitted,
        pageBackground: ImageModel.fromJson(data.submitted.pageBackground),
        currencies: data.submitted.currencies ? null : data.submitted.currencies.map(CurrencyModel.fromJson),
        attachments: data.submitted.attachments ? null : data.submitted.attachments.map(AttachmentModel.fromJson)
      },
      approved: !data.level1.approved ? null : {
        ...data.approved,
        registeredAt: !data.approved.registeredAt ? null : new Date(data.approved.registeredAt),
        pageBackground: ImageModel.fromJson(data.approved.pageBackground),
        currencies: data.approved.currencies ? null : data.approved.currencies.map(CurrencyModel.fromJson),
        attachments: data.approved.attachments ? null : data.approved.attachments.map(AttachmentModel.fromJson)
      }
    })
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    const request = context.profile.requests.find(r => r.level === 'worker' && r.status === 'created')

    return new ProfileWorkerModel({
      id: data._id.toString(),
      ipfsHash: data.ipfsHash,
      submitted: !request ? null : {
        ...workerFragment(request.worker),
        validationComment: request.worker.validationComment
      },
      approved: !data ? null : {
        ...workerFragment(data),
        registeredAt: !data.createdAt ? null : new Date(data.createdAt)
      },
      settings: data.settings
    })
  }
}

function workerFragment (worker) {
  return {
    intro: worker.intro,
    hourlyCharge: worker.hourlyCharge,
    pageBackground: ImageModel.fromMongo(worker.pageBackground),
    currencies: !worker.currencies
      ? null
      : worker.currencies.map(c => CurrencyModel.fromMongo(c)),
    attachments: !worker.attachments
      ? null
      : worker.attachments.map(a => AttachmentModel.fromMongo(a))
  }
}
