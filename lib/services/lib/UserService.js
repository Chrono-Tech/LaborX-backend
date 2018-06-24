// const debug = require('debug')('@laborx/profile.backend:UserService')

// const keystone = require('keystone')
// const config = require('config')
const mongoose = require('mongoose')
// const { Message } = requireRoot('lib/mail')
// const { verificationProfileProjection } = requireRoot('lib/projections')
// const { changeEmailNotificationTemplate } = requireRoot('mail')
// const { WebError } = requireRoot('lib/errors')
// const { VerificationInfo } = requireRoot('lib/models')

// const SecurityUser = keystone.list('SecurityUser').model
// const SecurityCheck = keystone.list('SecurityCheck').model
// const Profile = keystone.list('Profile').model
// const VerificationRequest = keystone.list('VerificationRequest').model

class UserService {
  // async startUpdateEmail (securityContext, { email }) {
  //   const user = await this._getUser(securityContext)
  //
  //   const verificationProfile = await Profile.findOne({ user })
  //
  //   const check = await SecurityCheck.create({
  //     user: user,
  //     type: 'confirm-email'
  //   })
  //
  //   verificationProfile.level2.unconfirmedEmail = email
  //   await verificationProfile.save()
  //
  //   const { subject, content } = changeEmailNotificationTemplate({
  //     baseURL: config.get('mail.baseURL'),
  //     username: user.name,
  //     check: check.check
  //   })
  //   const message = new Message({
  //     to: email,
  //     subject,
  //     html: content
  //   })
  //   debug(`sending user with id = ${user._id} [confirm-email] check = ${check.check}`)
  //   await message.send()
  // }
  //
  // async confirmUpdateEmail (user, { check }) {
  //   if (!user) {
  //     throw new WebError('Wrong user', 401)
  //   }
  //
  //   const securityCheck = await SecurityCheck.findOne({
  //     check,
  //     type: 'confirm-email'
  //   })
  //
  //   if (!securityCheck) {
  //     throw new WebError('wrong check', 400)
  //   }
  //   await securityCheck.remove()
  //
  //   const verificationProfile = await Profile.findOne({ user })
  //   verificationProfile.level2.email = verificationProfile.level2.unconfirmedEmail
  //   verificationProfile.level2.unconfirmedEmail = null
  //   await verificationProfile.save()
  //
  //   // update level if needed
  //   const updateRequest = await VerificationRequest
  //     .findOne({ verificationProfile })
  //   await updateRequest.save()
  // }
  //
  // async startUpdatePhone (securityContext, { phone }) {
  //   const user = await this._getUser(securityContext)
  //
  //   const verificationProfile = await Profile.findOne({ user })
  //
  //   const check = await SecurityCheck.create({
  //     user: user,
  //     type: 'confirm-phone'
  //   })
  //
  //   verificationProfile.level2.unconfirmedPhone = phone
  //   await verificationProfile.save()
  //
  //   debug(`sending user with id = ${user._id} [confirm-phone] check = ${check.check}`)
  //   // TODO @mdkardaev: send SMS
  // }
  //
  // async confirmUpdatePhone (user, { check }) {
  //   if (!user) {
  //     throw new WebError('Wrong user', 401)
  //   }
  //
  //   const securityCheck = await SecurityCheck.findOne({
  //     check,
  //     type: 'confirm-phone'
  //   })
  //   if (!securityCheck) {
  //     throw new WebError('wrong check', 400)
  //   }
  //   await securityCheck.remove()
  //
  //   const verificationProfile = await Profile.findOne({ user })
  //   verificationProfile.level2.phone = verificationProfile.level2.unconfirmedPhone
  //   verificationProfile.level2.unconfirmedPhone = null
  //   await verificationProfile.save()
  //
  //   // update level if needed
  //   const updateRequest = await VerificationRequest
  //     .findOne({ verificationProfile })
  //   await updateRequest.save()
  // }

  // async getVerificationLevel (user) {
  //   if (!user) {
  //     return null
  //   }
  //   const verificationProfile = await Profile.findOne({ user: user._id })
  //   return verificationProfile.level
  // }

  // async getVerificationInfo (user) {
  //   if (!user) {
  //     return null
  //   }
  //   const verificationProfile = await Profile.findOne({ user: user._id })
  //
  //   const updateRequest = await VerificationRequest
  //     .findOne({ verificationProfile })
  //     .populate(verificationProfileProjection)
  //
  //   return VerificationInfo.fromMongo(updateRequest)
  // }

  // async updateVerificationInfo (securityContext, { level, info }) {
  //   const user = await this._getUser(securityContext)
  //
  //   const verificationProfile = await Profile.findOne({ user })
  //   const updateRequest = await VerificationRequest.findOne({ verificationProfile })
  //
  //   const actualInfo = updateRequest[`level${level}`]
  //
  //   let isEqualsInfo = true
  //
  //   for (const [fieldName, newValue] of Object.entries(info)) {
  //     const actuaValue = actualInfo[fieldName]
  //     isEqualsInfo &= this._isEquals(actuaValue, newValue)
  //     actualInfo[fieldName] = newValue
  //   }
  //
  //   actualInfo.isValid &= isEqualsInfo
  //
  //   updateRequest.updateTime = Date.now()
  //   updateRequest.status = 'updated'
  //   await updateRequest.save()
  //
  //   return this.getVerificationInfo(user)
  // }

  // async _createUser ({ address }) {
  //   const user = await SecurityUser.create({
  //     addresses: [address]
  //   })
  //   const verificationProfile = await Profile.create({
  //     user
  //   })
  //
  //   await VerificationRequest.create({
  //     verificationProfile
  //   })
  //
  //   return user
  // }

  _isEquals (v1, v2) {
    if (v1 instanceof Date && v2 instanceof Date) {
      return v1.getTime() === v2.getTime()
    } else if (v1 instanceof Date) {
      return v1.getTime() === v2
    } else if (v1 instanceof mongoose.Types.ObjectId) {
      return v1.equals(v2)
    } else if (v2 instanceof mongoose.Types.ObjectId) {
      return v2.equals(v1)
    }
    return v1 === v2
  }

  _convertValue (value) {
    if (value instanceof mongoose.Types.ObjectId) {
      return value.toString()
    }
    return value
  }

  async _getUser (securityContext) {
    let { address, user } = securityContext

    if (!user) {
      user = await this._createUser({ address })
    }
    return user
  }
}

module.exports = UserService
