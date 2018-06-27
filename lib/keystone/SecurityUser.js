const keystone = require('keystone')
const { mapValues } = require('lodash')
const { imageType } = requireRoot('lib/helpers')
const { Constants: { projects, notifications } } = requireRoot('lib/models')
const Types = keystone.Field.Types

const isProduction = process.env.NODE_ENV === 'production'

const SecurityUser = new keystone.List('SecurityUser', {
  track: true,
  label: 'Profiles'
})

SecurityUser.add({
  name: { type: String, default: 'Anonymous', label: 'Name', required: true, initial: true },
  avatar: imageType({ folder: 'images', label: 'Avatar', noedit: isProduction }),
  ipfsHash: { type: String, label: 'IPFS Hash', noedit: isProduction, initial: true }
})

SecurityUser.add('Personal', {
  level1: {
    userName: { type: String, trim: true, label: 'User Name', noedit: isProduction, initial: true },
    birthDate: { type: Types.Date, label: 'Birth Date', utc: true, noedit: isProduction, initial: true },
    avatar: { type: Types.Relationship, ref: 'Image', label: 'Avatar', noedit: isProduction, initial: true, many: false },
    isValid: { type: Boolean, label: 'L1', hidden: true }
  }
})

SecurityUser.add('Contacts', {
  level2: {
    email: { type: Types.Email, trim: true, index: true, unique: false, noedit: isProduction, label: 'Email', initial: true },
    phone: { type: String, trim: true, index: true, unique: false, noedit: isProduction, label: 'Phone', initial: true },
    isValid: { type: Boolean, label: 'L2', hidden: true }
  }
})

SecurityUser.add('Passport', {
  level3: {
    passport: { type: String, trim: true, label: 'Passport ID', noedit: isProduction, initial: true },
    expirationDate: { type: Types.Date, trim: true, label: 'Passport Expiration Date', noedit: isProduction, initial: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: isProduction, initial: true, many: true },
    isValid: { type: Boolean, label: 'L3', hidden: true }
  }
})

SecurityUser.add('Residence', {
  level4: {
    country: { type: String, trim: true, label: 'Country', noedit: isProduction, initial: true },
    state: { type: String, trim: true, label: 'State', noedit: isProduction, initial: true },
    city: { type: String, trim: true, label: 'City', noedit: isProduction, initial: true },
    zip: { type: String, trim: true, label: 'Zip', noedit: isProduction, initial: true },
    addressLine1: { type: String, trim: true, label: 'Address Line 1', noedit: isProduction, initial: true },
    addressLine2: { type: String, trim: true, label: 'Address Line 2', noedit: isProduction, initial: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: isProduction, initial: true, many: true },
    isValid: { type: Boolean, label: 'L4', hidden: true }
  }
})

let nTypes = notifications.exchange
SecurityUser.add('Exchange Notifications', {
  notifications: {
    [projects.exchange]: notificationsFragment(channel => ({
      [nTypes.userLoggedIn]: `User logged in (${channel})`,
      [nTypes.profileUpdated]: `Profile updated (${channel})`,
      [nTypes.transferReceived]: `Transfer received (${channel})`,
      [nTypes.transferSent]: `Transfer sent (${channel})`,
      [nTypes.limitOrderPublished]: `Limit order published (${channel})`,
      [nTypes.limitOrderFilled]: `Limit order filled (${channel})`,
      [nTypes.limitOrderExpired]: `Limit order expired (${channel})`,
      [nTypes.marketOrderExecuted]: `Market order executed (${channel})`
    }))
  }
})

nTypes = notifications.laborx
SecurityUser.add('LaborX Notifications', {
  notifications: {
    [projects.laborx]: notificationsFragment(channel => ({
      [nTypes.userLoggedIn]: `User logged in (${channel})`,
      [nTypes.profileUpdated]: `Profile updated (${channel})`
    }))
  }
})

SecurityUser.relationship({ path: 'requests', ref: 'VerificationRequest', refPath: 'user' })

SecurityUser.schema.virtual('requests', {
  ref: 'VerificationRequest',
  localField: '_id',
  foreignField: 'user',
  justOne: false
})

SecurityUser.relationship({ path: 'signatures', ref: 'SecuritySignature', refPath: 'user' })

SecurityUser.schema.virtual('signatures', {
  ref: 'SecuritySignature',
  localField: '_id',
  foreignField: 'user',
  justOne: false
})

SecurityUser.relationship({ path: 'tokens', ref: 'SecurityToken', refPath: 'user' })

SecurityUser.schema.virtual('tokens', {
  ref: 'SecurityToken',
  localField: '_id',
  foreignField: 'user',
  justOne: false
})

SecurityUser.relationship({ path: 'checks', ref: 'SecurityCheck', refPath: 'user' })

SecurityUser.schema.virtual('checks', {
  ref: 'SecurityCheck',
  localField: '_id',
  foreignField: 'user',
  justOne: false
})

SecurityUser.relationship({ path: 'activityLog', ref: 'ActivityLog', refPath: 'user' })

SecurityUser.schema.pre('save', async function (next) {
  if (this.level1 && this.level1.avatar) {
    const Image = keystone.list('Image')
    const avatar = await Image.model.findOne({
      _id: this.level1.avatar
    })
    this.avatar = avatar.image
  }
  next()
})

SecurityUser.defaultColumns = 'name, avatar, level1.userName, level1.isValid|5%, level2.isValid|5%, level3.isValid|5%, level4.isValid|5%, createdAt'
SecurityUser.register()

function notificationsFragment (properties) {
  return mapValues(
    { sms: 'SMS', email: 'Email' },
    (channel, key) => mapValues(
      properties(channel),
      (label, key) => ({
        type: Boolean,
        default: false,
        noedit: isProduction,
        initial: true,
        label
      })
    )
  )
}
