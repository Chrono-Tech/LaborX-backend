const debug = require('debug')('@laborx/profile.backend:SecurityService')

const assert = require('assert')
const keystone = require('keystone')
const config = require('config')
const { set } = require('lodash')
const { Message } = requireRoot('lib/mail')
const { WebError } = requireRoot('lib/errors')
const { extractActivityLogInfo } = requireRoot('lib/utils')
const {
  ActivityLogMessage,
  ProfileModel,
  ProfileWorkerModel,
  ProfileRecruiterModel,
  ProfileClientModel,
  PersonModel,
  VerificationRequestLevel1Model,
  VerificationRequestLevel2Model,
  VerificationRequestLevel3Model,
  VerificationRequestLevel4Model,
  VerificationRequestWorkerModel,
  VerificationRequestRecruiterModel,
  VerificationRequestClientModel,
  ConfirmationRequestLevel2Model,
  NotificationToggleModel,
  Constants
} = requireRoot('lib/models')

const { confirmTemplate } = requireRoot('mail')

const SecurityUser = keystone.list('SecurityUser')
const SecurityToken = keystone.list('SecurityToken')
const SecurityCheck = keystone.list('SecurityCheck')
const SecuritySignature = keystone.list('SecuritySignature')
const WorkerProfile = keystone.list('WorkerProfile')
const WorkerSocial = keystone.list('WorkerSocial')
const WorkerService = keystone.list('WorkerService')
const WorkerEmployment = keystone.list('WorkerEmployment')
const RecruiterProfile = keystone.list('RecruiterProfile')
const RecruiterSocial = keystone.list('RecruiterSocial')
const RecruiterService = keystone.list('RecruiterService')
const ClientProfile = keystone.list('ClientProfile')
const CollaboratorProfile = keystone.list('CollaboratorProfile')
const VerificationRequest = keystone.list('VerificationRequest')
const VerificationWorkerRequest = keystone.list('VerificationWorkerRequest')
const VerificationRecruiterRequest = keystone.list('VerificationRecruiterRequest')
const VerificationClientRequest = keystone.list('VerificationClientRequest')
const ServiceCategory = keystone.list('ServiceCategory')
const Currency = keystone.list('Currency')

class SecurityService {
  async selectPerson (address) {
    const signature = await SecuritySignature.model
      .findOne({
        value: address.toLowerCase(),
        type: 'ethereum-public-key'
      })
      .populate('user')
      .exec()
    return signature ? PersonModel.fromMongo(signature.user, { address: signature.address }) : null
  }

  async selectPersons (addresses) {
    const signatures = await SecuritySignature.model
      .find({
        address: { $in: addresses.map(a => a.toLowerCase()) },
        type: 'ethereum-public-key'
      })
      .populate('user')

    return signatures.map(signature => PersonModel.fromMongo(signature.user, { address: signature.address }))
  }

  async selectProfile (user) {
    const profile = await SecurityUser.model
      .findOne({ _id: user._id })
      .populate('level1.avatar')
      .populate('level3.attachments')
      .populate('level4.attachments')
      .populate({
        path: 'requests',
        populate: [
          { path: 'level1.avatar' },
          { path: 'level3.attachments' },
          { path: 'level4.attachments' }
        ]
      })
      .populate('signatures')

    return ProfileModel.fromMongo(profile)
  }

  async selectWorkerProfile (user) {
    const worker = await WorkerProfile.model
      .findOne({ user: user._id })
      .populate('socials')
      .populate('employments')
      .populate({
        path: 'services',
        populate: {
          path: 'category'
        }
      })
      .populate('regular.currencies')
      .populate('verifiable.attachments')
      .populate('verifiable.pageBackground')

    const request = await VerificationWorkerRequest.model
      .findOne({ user: user._id, status: 'created' })
      .populate('socials')
      .populate('employments')
      .populate({
        path: 'services',
        populate: {
          path: 'category'
        }
      })
      .populate('regular.currencies')
      .populate('verifiable.attachments')
      .populate('verifiable.pageBackground')

    return ProfileWorkerModel.fromMongo({ worker, request, user })
  }

  async selectRecruiterProfile (user) {
    const recruiter = await RecruiterProfile.model
      .findOne({ user: user._id })
      .populate('socials')
      .populate('services')
      .populate('verifiable.attachments')
      .populate('verifiable.pageBackground')

    const request = await VerificationRecruiterRequest.model
      .findOne({ user: user._id, status: 'created' })
      .populate('socials')
      .populate('services')
      .populate('verifiable.attachments')
      .populate('verifiable.pageBackground')

    return ProfileRecruiterModel.fromMongo({ recruiter, request, user })
  }

  async selectClientProfile (user) {
    const client = await ClientProfile.model
      .findOne({ user: user._id })
      .populate('regular.specializations')
      .populate('verifiable.attachments')
      .populate('verifiable.pageBackground')
      .populate({
        path: 'collaborators',
        populate: {
          path: 'user'
        }
      })

    const request = await VerificationClientRequest.model
      .findOne({ user: user._id, status: 'created' })
      .populate('regular.specializations')
      .populate('verifiable.attachments')
      .populate('verifiable.pageBackground')
      .populate({
        path: 'collaborators',
        populate: {
          path: 'user'
        }
      })

    return ProfileClientModel.fromMongo({ client, request, user })
  }

  async requireSignature ({ type, value }) {
    const signature = await SecuritySignature.model
      .findOne({ value, type })
      .populate('user')

    if (signature) {
      return signature
    }

    const u = await SecurityUser.model
      .create({ name: `${type}:${value}` })
    const s = await SecuritySignature.model
      .create({ user: u._id, type, value })
    return SecuritySignature.model
      .findOne({ _id: s._id })
      .populate('user')
  }

  async findToken ({ token }) {
    return SecurityToken.model
      .findOne({ token })
      .populate('user')
  }

  async selectAddresses (user) {
    const addresses = await SecuritySignature.model.find({user: user._id})
    return addresses.reduce((res, addr) => { res[addr.type] = addr.value; return res }, {})
  }

  async upsertAddresses ({user, signatures}) {
    await Promise.all(
      signatures.map(s => this.upsertAddress({ user, type: s.type, value: s.value }))
    )
  }

  async upsertAddress ({ user, type, value }) {
    const signature = await SecuritySignature.model
      .findOne({ user: user._id, type })

    if (!signature) {
      await SecuritySignature.model
        .create({user: user._id, type, value})
    } else {
      signature.value = value
      await signature.save()
    }
  }

  async upsertToken ({ user, purpose, expressRequest }) {
    const { activityLogProducer } = requireRoot('lib/rabbit')
    activityLogProducer.send(new ActivityLogMessage({
      project: purpose,
      type: Constants.notifications[purpose]['userLoggedIn'],
      activityAt: Date.now(),
      user: user._id.toString(),
      payload: extractActivityLogInfo(expressRequest)
    }))

    let token = await SecurityToken.model
      .findOne({
        user: user._id,
        purpose: purpose
      })

    if (token) {
      await token.save()
    } else {
      token = await SecurityToken.model
        .create({
          user: user._id,
          purpose: purpose
        })
    }
    return SecurityToken.model
      .findOne({ _id: token._id })
      .populate('user')
  }

  async removeToken ({ token }) {
    const result = await SecurityToken.model
      .findOne({ token })
      .populate('user')
      .exec()
    await result.remove()
    return result
  }

  async upsertLevel1Request (user, requestModel) {
    assert(requestModel instanceof VerificationRequestLevel1Model)
    const request = await VerificationRequest.model.findOne({
      user: user._id,
      level: 'level-1',
      status: 'created'
    })
    if (request) {
      request.level1 = {
        userName: requestModel.userName,
        birthDate: requestModel.birthDate,
        avatar: requestModel.avatar,
        validationComment: null,
        isValid: false
      }
      await request.save()
    } else {
      await VerificationRequest.model
        .create({
          user: user._id,
          level: 'level-1',
          level1: {
            userName: requestModel.userName,
            birthDate: requestModel.birthDate,
            avatar: requestModel.avatar
          }
        })
    }
  }

  async upsertLevel2Request (user, requestModel) {
    assert(requestModel instanceof VerificationRequestLevel2Model)
    let request = await VerificationRequest.model.findOne({
      user: user._id,
      level: 'level-2',
      status: 'created'
    })
    if (request) {
      request.level2 = {
        email: requestModel.email,
        phone: requestModel.phone,
        isEmailConfirmed: requestModel.email === request.level2.email
          ? request.level2.isEmailConfirmed
          : false,
        isPhoneConfirmed: requestModel.phone === request.level2.phone
          ? request.level2.isPhoneConfirmed
          : false,
        validationComment: null,
        isValid: false
      }
      await request.save()
    } else {
      request = await VerificationRequest.model
        .create({
          user: user._id,
          level: 'level-2',
          level2: {
            email: requestModel.email,
            phone: requestModel.phone,
            isEmailConfirmed: requestModel.email === user.level2.email,
            isPhoneConfirmed: requestModel.phone === user.level2.phone
          }
        })
    }
    if (!request.level2.isPhoneConfirmed) {
      await this.validatePhone(user)
    }
    if (!request.level2.isEmailConfirmed) {
      await this.validateEmail(user)
    }
  }

  async upsertLevel3Request (user, requestModel) {
    assert(requestModel instanceof VerificationRequestLevel3Model)
    const request = await VerificationRequest.model.findOne({
      user: user._id,
      level: 'level-3',
      status: 'created'
    })
    if (request) {
      request.level3 = {
        passport: requestModel.passport,
        expirationDate: requestModel.expirationDate,
        attachments: requestModel.attachments
      }
      await request.save()
    } else {
      await VerificationRequest.model
        .create({
          user: user._id,
          level: 'level-3',
          level3: {
            passport: requestModel.passport,
            expirationDate: requestModel.expirationDate,
            attachments: requestModel.attachments
          }
        })
    }
  }

  async upsertLevel4Request (user, requestModel) {
    assert(requestModel instanceof VerificationRequestLevel4Model)
    const request = await VerificationRequest.model.findOne({
      user: user._id,
      level: 'level-4',
      status: 'created'
    })
    if (request) {
      request.level4 = {
        country: requestModel.country,
        state: requestModel.state,
        city: requestModel.city,
        zip: requestModel.zip,
        addressLine1: requestModel.addressLine1,
        addressLine2: requestModel.addressLine2,
        attachments: requestModel.attachments
      }
      await request.save()
    } else {
      await VerificationRequest.model
        .create({
          user: user._id,
          level: 'level-4',
          level4: {
            country: requestModel.country,
            state: requestModel.state,
            city: requestModel.city,
            zip: requestModel.zip,
            addressLine1: requestModel.addressLine1,
            addressLine2: requestModel.addressLine2,
            attachments: requestModel.attachments
          }
        })
    }
  }

  async upsertWorkerRequest (user, requestModel) {
    assert(requestModel instanceof VerificationRequestWorkerModel)
    let request = await VerificationWorkerRequest.model
      .findOne({
        user: user._id,
        status: 'created'
      })
      .populate('services')
      .populate('socials')
      .populate('employments')
    const { regular, verifiable, custom } = requestModel
    const currencies = !regular.currencies ? null : await Promise.all(
      regular.currencies.map(async c => (await Currency.model.findOne({ symbol: c }))._id.toString())
    )
    if (request) {
      Object.assign(request, {
        regular: {
          ...regular,
          currencies
        },
        verifiable,
        custom
      })
      await request.save()

      await Promise.all([
        ...request.services.map(s => s.remove()),
        ...request.socials.map(s => s.remove()),
        ...request.employments.map(e => e.remove())
      ])
    } else {
      request = await VerificationWorkerRequest.model
        .create({
          user: user._id,
          regular: {
            ...regular,
            currencies
          },
          verifiable,
          custom
        })
    }
    const { socials, services, employments } = requestModel
    await Promise.all([
      ...(socials || []).map(s => WorkerSocial.model.create({
        ...s,
        request: request._id
      })),
      ...(services || []).map(async s => WorkerService.model.create({
        ...s,
        category: (await ServiceCategory.model.findOne({ code: s.category }))._id.toString(),
        request: request._id
      })),
      ...(employments || []).map(s => WorkerEmployment.model.create({
        ...s,
        request: request._id
      }))
    ])
  }

  async upsertRecruiterRequest (user, requestModel) {
    assert(requestModel instanceof VerificationRequestRecruiterModel)
    let request = await VerificationRecruiterRequest.model
      .findOne({
        user: user._id,
        status: 'created'
      })
      .populate('services')
      .populate('socials')
    const { verifiable, custom } = requestModel
    if (request) {
      Object.assign(request, {
        verifiable,
        custom
      })
      await request.save()

      await Promise.all([
        ...request.services.map(s => s.remove()),
        ...request.socials.map(s => s.remove())
      ])
    } else {
      request = await VerificationRecruiterRequest.model
        .create({
          user: user._id,
          verifiable,
          custom
        })
    }
    const { socials, services } = requestModel
    await Promise.all([
      ...(socials || []).map(s => RecruiterSocial.model.create({
        ...s,
        request: request._id
      })),
      ...(services || []).map(async s => RecruiterService.model.create({
        ...s,
        request: request._id
      }))
    ])
  }

  async upsertClientRequest (user, requestModel) {
    assert(requestModel instanceof VerificationRequestClientModel)
    let request = await VerificationClientRequest.model
      .findOne({
        user: user._id,
        status: 'created'
      })
      .populate('collaborators')
    const { regular, verifiable, custom } = requestModel
    const specializations = !regular.specializations ? null : await Promise.all(
      regular.specializations.map(async c => (await ServiceCategory.model.findOne({ code: c }))._id.toString())
    )
    if (request) {
      Object.assign(request, {
        regular: {
          ...regular,
          specializations
        },
        verifiable,
        custom
      })
      await request.save()

      // TODO @ipavlenko: Save collaborator approvements
      await Promise.all([
        ...request.collaborators.map(e => e.remove())
      ])
    } else {
      request = await VerificationClientRequest.model
        .create({
          user: user._id,
          regular: {
            ...regular,
            specializations
          },
          verifiable,
          custom
        })
    }
    const { collaborators } = requestModel
    await Promise.all([
      ...(collaborators || []).map(s => CollaboratorProfile.model.create({
        ...s,
        request: request._id
      }))
    ])
  }

  async validatePhone (user) {
    const request = await VerificationRequest.model.findOne({
      user: user._id,
      level: 'level-2',
      status: 'created'
    })

    if (!request || !request.level2 || request.level2.isPhoneConfirmed) {
      throw new WebError('Illegal state', 401)
    }

    await SecurityCheck.model.remove({
      user: user._id,
      type: 'confirm-phone'
    })

    const checkPhone = await SecurityCheck.model.create({
      user: user._id,
      type: 'confirm-phone',
      payload: request.level2.phone
    })

    debug(`[confirm-phone] user: ${user._id}, check: ${checkPhone.check}`)
  }

  async validateEmail (user) {
    const request = await VerificationRequest.model.findOne({
      user: user._id,
      level: 'level-2',
      status: 'created'
    })

    if (!request || !request.level2 || request.level2.isEmailConfirmed) {
      throw new WebError('Illegal state', 401)
    }

    await SecurityCheck.model.remove({
      user: user._id,
      type: 'confirm-email'
    })

    const checkEmail = await SecurityCheck.model.create({
      user: user._id,
      type: 'confirm-email',
      payload: request.level2.email
    })

    debug(`[confirm-email] user: ${user._id}, check: ${checkEmail.check}`)

    const { subject, content } = confirmTemplate({
      baseURL: config.get('mail.baseURL'),
      username: user.name,
      check: checkEmail.check
    })
    const message = new Message({
      to: request.level2.email,
      subject,
      html: content
    })

    await message.send()
  }

  async confirmLevel2Request (user, requestModel) {
    assert(requestModel instanceof ConfirmationRequestLevel2Model)
    const request = await VerificationRequest.model
      .findOne({
        user: user._id,
        level: 'level-2',
        status: 'created'
      })
    assert(request != null)

    let isEmailVerified = false
    let isEmailTried = false
    debug('requestModel.emailCode', requestModel.emailCode)
    if (requestModel.emailCode) {
      isEmailTried = true
      const checkEmail = await SecurityCheck.model
        .findOne({
          user: user._id,
          type: 'confirm-email',
          payload: request.level2.email,
          check: requestModel.emailCode
        })
      debug('checkEmail', checkEmail)
      if (checkEmail) {
        await checkEmail.remove()
        request.level2.isEmailConfirmed = true
        isEmailVerified = true
      }
    }

    let isPhoneVerified = false
    let isPhoneTried = false
    if (requestModel.phoneCode) {
      isPhoneTried = true
      const checkPhone = await SecurityCheck.model
        .findOne({
          user: user._id,
          type: 'confirm-phone',
          payload: request.level2.phone,
          check: requestModel.phoneCode
        })
      if (checkPhone) {
        await checkPhone.remove()
        request.level2.isPhoneConfirmed = true
        isPhoneVerified = true
      }
    }

    if (isPhoneVerified || isEmailVerified) {
      await request.save()
    }

    return {
      isEmailTried,
      isEmailVerified,
      isPhoneTried,
      isPhoneVerified
    }
  }

  async updateNotification (user, requestModel) {
    assert(requestModel instanceof NotificationToggleModel)
    set(user, `notifications.${requestModel.domain}.${requestModel.type}.${requestModel.name}`, requestModel.value)
    await user.save()
  }
}

module.exports = SecurityService
