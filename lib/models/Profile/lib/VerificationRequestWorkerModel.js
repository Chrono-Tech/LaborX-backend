const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  regular: Joi.object().allow(null).keys({
    currencies: Joi.array().items(Joi.string()), // symbols, not ids
    hourlyCharge: Joi.string().allow([null, ''])
  }),
  verifiable: {
    intro: Joi.string().allow([null, '']),
    pageBackground: Joi.string().allow(null),
    attachments: Joi.array().items(Joi.string())
  },
  custom: Joi.any().allow(null),
  socials: Joi.array().items(Joi.object().type(VerificationRequestWorkerSocialModel)).allow(null),
  services: Joi.array().items(Joi.object().type(VerificationRequestWorkerServiceModel)).allow(null),
  employments: Joi.array().items(Joi.object().type(VerificationRequestWorkerEmploymentModel)).allow(null)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestWorkerModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestWorkerModel({
      ...data,
      socials: !data.socials ? null : data.socials.map(VerificationRequestWorkerSocialModel.fromJson),
      services: !data.services ? null : data.services.map(VerificationRequestWorkerServiceModel.fromJson),
      employments: !data.employments ? null : data.employments.map(VerificationRequestWorkerEmploymentModel.fromJson)
    })
  }
}

class VerificationRequestWorkerSocialModel extends AbstractModel {
  constructor (data) {
    super(data, {
      name: Joi.string().required(),
      url: Joi.string().required()
    })
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestWorkerSocialModel({
      ...data
    })
  }
}

class VerificationRequestWorkerServiceModel extends AbstractModel {
  constructor (data) {
    super(data, {
      name: Joi.string().required(),
      category: Joi.number().required(), // category code
      description: Joi.string(),
      fee: Joi.string(),
      minFee: Joi.string(),
      attachments: Joi.array().items(Joi.string()).allow(null)
    })
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestWorkerServiceModel({
      ...data
    })
  }
}

class VerificationRequestWorkerEmploymentModel extends AbstractModel {
  constructor (data) {
    super(data, {
      organization: Joi.string().required(),
      since: Joi.date(),
      until: Joi.date(),
      responsibilities: Joi.string()
    })
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestWorkerEmploymentModel({
      ...data,
      since: !data.since ? null : new Date(data.since),
      until: !data.until ? null : new Date(data.until)
    })
  }
}
