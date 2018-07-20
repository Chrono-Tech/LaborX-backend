const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { ImageModel, AttachmentModel } = requireRoot('lib/models/Core')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  ipfsHash: Joi.string().allow([null, '']),
  level1: Joi.object().keys({
    submitted: Joi.object().allow(null).keys({
      userName: Joi.string().allow([null, '']),
      birthDate: Joi.date().allow(null),
      avatar: Joi.object().type(ImageModel).allow(null),
      validationComment: Joi.string().allow([null, ''])
    }),
    approved: Joi.object().allow(null).keys({
      userName: Joi.string().allow([null, '']),
      birthDate: Joi.date().allow(null),
      avatar: Joi.object().type(ImageModel).allow(null)
    })
  }),
  level2: Joi.object().keys({
    submitted: Joi.object().allow(null).keys({
      email: Joi.string().lowercase().email().allow([null, '']),
      phone: Joi.string().allow([null, '']),
      isEmailConfirmed: Joi.boolean(),
      isPhoneConfirmed: Joi.boolean(),
      validationComment: Joi.string().allow([null, ''])
    }),
    approved: Joi.object().allow(null).keys({
      email: Joi.string().lowercase().email().allow([null, '']),
      phone: Joi.string().allow([null, ''])
    })
  }),
  level3: Joi.object().keys({
    submitted: Joi.object().allow(null).keys({
      passport: Joi.string().allow([null, '']),
      expirationDate: Joi.date().allow(null),
      attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null),
      validationComment: Joi.string().allow([null, ''])
    }),
    approved: Joi.object().allow(null).keys({
      passport: Joi.string().allow([null, '']),
      expirationDate: Joi.date().allow(null),
      attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
    })
  }),
  level4: Joi.object().keys({
    submitted: Joi.object().allow(null).keys({
      country: Joi.string().allow([null, '']),
      state: Joi.string().allow([null, '']),
      city: Joi.string().allow([null, '']),
      zip: Joi.string().allow([null, '']),
      addressLine1: Joi.string().allow([null, '']),
      addressLine2: Joi.string().allow([null, '']),
      attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null),
      validationComment: Joi.string().allow([null, ''])
    }),
    approved: Joi.object().allow(null).keys({
      country: Joi.string().allow([null, '']),
      state: Joi.string().allow([null, '']),
      city: Joi.string().allow([null, '']),
      zip: Joi.string().allow([null, '']),
      addressLine1: Joi.string().allow([null, '']),
      addressLine2: Joi.string().allow([null, '']),
      attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
    })
  }),
  notifications: Joi.object(),
  signatures: Joi.array().items(Joi.object().keys({
    type: Joi.string().allow([null, '']),
    value: Joi.string().lowercase().allow([null, ''])
  })),
  agents: Joi.array().items(Joi.object().keys({
    purpose: Joi.string().allow([null, '']),
    principal: Joi.string().lowercase().allow([null, '']),
    contract: Joi.string().lowercase().allow([null, ''])
  }))
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ProfileModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  get isApproved () {
    return this.verificationLevel === 4
  }

  get verificationLevel () {
    if (!(this.level1 && this.level1.approved)) return 0
    if (!(this.level2 && this.level2.approved)) return 1
    if (!(this.level3 && this.level3.approved)) return 2
    if (!(this.level4 && this.level4.approved)) return 3
    return 4
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new ProfileModel({
      ...data,
      level1: {
        submitted: !data.level1.submitted ? null : {
          ...data.level1.submitted,
          birthDate: !data.level1.submitted.birthDate ? null : new Date(data.level1.submitted.birthDate),
          avatar: ImageModel.fromJson(data.level1.submitted.avatar)
        },
        approved: !data.level1.approved ? null : {
          ...data.level1.approved,
          birthDate: !data.level1.approved.birthDate ? null : new Date(data.level1.approved.birthDate),
          avatar: ImageModel.fromJson(data.level1.approved.avatar)
        }
      },
      level2: {
        submitted: !data.level2.submitted ? null : data.level2.submitted,
        approved: !data.level2.approved ? null : data.level2.approved
      },
      level3: {
        submitted: !data.level3.submitted ? null : {
          ...data.level3.submitted,
          expirationDate: !data.level3.submitted.expirationDate ? null : new Date(data.level3.submitted.expirationDate),
          attachments: data.level3.submitted.attachments ? null : data.level3.submitted.attachments.map(AttachmentModel.fromJson)
        },
        approved: !data.level3.approved ? null : {
          ...data.level3.approved,
          expirationDate: !data.level3.approved.expirationDate ? null : new Date(data.level3.approved.expirationDate),
          attachments: data.level3.approved.attachments ? null : data.level3.approved.attachments.map(AttachmentModel.fromJson)
        }
      },
      level4: {
        submitted: !data.level4.submitted ? null : {
          ...data.level4.submitted,
          attachments: data.level4.submitted.attachments ? null : data.level4.submitted.attachments.map(AttachmentModel.fromJson)
        },
        approved: !data.level4.approved ? null : {
          ...data.level4.approved,
          attachments: data.level4.approved.attachments ? null : data.level4.approved.attachments.map(AttachmentModel.fromJson)
        }
      },
      signatures: data.signatures && data.signatures.map(e => ({
        type: e.type,
        value: e.value
      })),
      agents: data.agents && data.agents.map(agent => ({
        purpose: agent.purpose,
        contract: agent.contract,
        principal: agent.principal
      }))
    })
  }

  static fromMongo (data, context = {}, options) {
    if (data == null) {
      return null
    }

    const { level1, level2, level3, level4 } = data

    const request1 = data.requests.find(r => r.level === 'level-1' && r.status === 'created')
    const request2 = data.requests.find(r => r.level === 'level-2' && r.status === 'created')
    const request3 = data.requests.find(r => r.level === 'level-3' && r.status === 'created')
    const request4 = data.requests.find(r => r.level === 'level-4' && r.status === 'created')

    return new ProfileModel({
      id: data._id.toString(),
      ipfsHash: data.ipfsHash,
      level1: {
        submitted: !request1 ? null : {
          ...level1Fragment(request1.level1),
          validationComment: request1.level1.validationComment
        },
        approved: (!level1 || !level1.isValid) ? null : level1Fragment(level1)
      },
      level2: {
        submitted: !request2 ? null : {
          ...level2Fragment(request2.level2),
          validationComment: request2.level2.validationComment,
          isEmailConfirmed: request2.level2.isEmailConfirmed,
          isPhoneConfirmed: request2.level2.isPhoneConfirmed
        },
        approved: (!level2 || !level2.isValid) ? null : level2Fragment(level2)
      },
      level3: {
        submitted: !request3 ? null : {
          ...level3Fragment(request3.level3),
          validationComment: request3.level3.validationComment
        },
        approved: (!level3 || !level3.isValid) ? null : level3Fragment(level3)
      },
      level4: {
        submitted: !request4 ? null : {
          ...level4Fragment(request4.level4),
          validationComment: request4.level4.validationComment
        },
        approved: (!level4 || !level4.isValid) ? null : level4Fragment(level4)
      },
      notifications: data.notifications,
      signatures: data.signatures && data.signatures.map(e => ({
        type: e.type,
        value: e.value
      })),
      agents: data.agents && data.agents.map(agent => ({
        purpose: agent.purpose,
        contract: agent.contract,
        principal: agent.principal
      }))
    })
  }
}

function level1Fragment (level1) {
  return {
    userName: level1.userName,
    birthDate: level1.birthDate,
    avatar: ImageModel.fromMongo(level1.avatar)
  }
}

function level2Fragment (level2) {
  return {
    email: level2.email,
    phone: level2.phone
  }
}

function level3Fragment (level3) {
  return {
    passport: level3.passport,
    expirationDate: level3.expirationDate,
    attachments: !level3.attachments
      ? null
      : level3.attachments.map(a => AttachmentModel.fromMongo(a))
  }
}

function level4Fragment (level4) {
  return {
    country: level4.country,
    state: level4.state,
    city: level4.city,
    zip: level4.zip,
    addressLine1: level4.addressLine1,
    addressLine2: level4.addressLine2,
    attachments: !level4.attachments
      ? null
      : level4.attachments.map(a => AttachmentModel.fromMongo(a))
  }
}
