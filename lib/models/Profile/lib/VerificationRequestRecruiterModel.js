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
  socials: Joi.array().items(Joi.object().type(VerificationRequestRecruiterSocialModel)).allow(null),
  services: Joi.array().items(Joi.object().type(VerificationRequestRecruiterServiceModel)).allow(null)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class VerificationRequestRecruiterModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestRecruiterModel({
      ...data,
      socials: !data.socials ? null : data.socials.map(VerificationRequestRecruiterSocialModel.fromJson),
      services: !data.services ? null : data.services.map(VerificationRequestRecruiterServiceModel.fromJson)
    })
  }
}

class VerificationRequestRecruiterSocialModel extends AbstractModel {
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
    return new VerificationRequestRecruiterSocialModel({
      ...data
    })
  }
}

class VerificationRequestRecruiterServiceModel extends AbstractModel {
  constructor (data) {
    super(data, {
      name: Joi.string().required(),
      description: Joi.string(),
      fee: Joi.string(),
      attachments: Joi.array().items(Joi.string()).allow(null)
    })
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new VerificationRequestRecruiterServiceModel({
      ...data
    })
  }
}
