const { mapValues } = require('lodash')
const keystone = require('keystone')
const { storeIntoIPFS } = requireRoot('lib/utils')
const { Constants, ActivityLogMessage } = requireRoot('lib/models')

const Types = keystone.Field.Types

const VerificationRequest = new keystone.List('VerificationRequest', {
  track: true,
  drilldown: 'user',
  map: { name: 'level' },
  label: 'Profile Verification'
})

VerificationRequest.add({
  slug: { type: String, noedit: true, hidden: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', initial: true, required: true, noedit: true },
  level: {
    type: Types.Select,
    options: [
      { value: 'level-1', label: 'Level 1' },
      { value: 'level-2', label: 'Level 2' },
      { value: 'level-3', label: 'Level 3' },
      { value: 'level-4', label: 'Level 4' }
    ],
    default: 'level-1',
    initial: true,
    required: true,
    noedit: true
  },
  status: {
    type: Types.Select,
    options: [
      { value: 'created', label: 'Created' },
      { value: 'processed', label: 'Processed' }
    ],
    default: 'created',
    initial: false,
    required: true,
    noedit: true
  }
})

VerificationRequest.add(
  {
    heading: 'Personal',
    dependsOn: { level: 'level-1' }
  }, {
    level1: dependsOnLevel('level-1', {
      userName: { type: String, trim: true, label: 'Full Name', noedit: true, initial: true },
      birthDate: { type: Types.Date, label: 'Birth Date', utc: true, noedit: true, initial: true },
      avatar: { type: Types.Relationship, ref: 'Image', label: 'Avatar', noedit: true, initial: true },

      validationComment: { type: String, label: 'Validation comment' },
      isValid: { type: Boolean, label: 'Approved' }
    })
  }
)

VerificationRequest.add(
  {
    heading: 'Contacts',
    dependsOn: { level: 'level-2' }
  }, {
    level2: dependsOnLevel('level-2', {
      email: { type: Types.Email, trim: true, label: 'Email', noedit: true, initial: true },
      phone: { type: String, label: 'Phone', noedit: true, initial: true },
      company: { type: String, trim: true, noedit: true, label: 'Company', initial: true },
      website: { type: String, trim: true, noedit: true, label: 'Website', initial: true },
      isEmailConfirmed: { type: Boolean, label: 'Is Email confirmed', noedit: true, initial: true },
      isPhoneConfirmed: { type: Boolean, label: 'Is Phone confirmed', noedit: true, initial: true },
      validationComment: { type: String, label: 'Validation comment' },
      isValid: { type: Boolean, label: 'Approved' }
    })
  }
)

VerificationRequest.add(
  {
    heading: 'Passport',
    dependsOn: { level: 'level-3' }
  }, {
    level3: dependsOnLevel('level-3', {
      passport: { type: String, trim: true, label: 'Passport ID', noedit: true, initial: true },
      expirationDate: { type: Types.Date, trim: true, label: 'Passport Expiration Date', noedit: true, initial: true },
      attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true },

      validationComment: { type: String, label: 'Validation comment' },
      isValid: { type: Boolean, label: 'Approved' }
    })
  }
)

VerificationRequest.add(
  {
    heading: 'Residence',
    dependsOn: { level: 'level-4' }
  }, {
    level4: dependsOnLevel('level-4', {
      country: { type: String, trim: true, label: 'Country', noedit: true, initial: true },
      state: { type: String, trim: true, label: 'State/Province', noedit: true, initial: true },
      city: { type: String, trim: true, label: 'City', noedit: true, initial: true },
      zip: { type: String, trim: true, label: 'ZIP', noedit: true, initial: true },
      addressLine1: { type: String, trim: true, label: 'Address Line 1', noedit: true, initial: true },
      addressLine2: { type: String, trim: true, label: 'Address Line 2', noedit: true, initial: true },
      attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true },

      validationComment: { type: String, label: 'Validation comment' },
      isValid: { type: Boolean, label: 'Approved' }
    })
  }
)

VerificationRequest.schema.pre('save', async function (next) {
  handlePreLevel1(this)
  handlePreLevel2(this)
  handlePreLevel3(this)
  handlePreLevel4(this)
  next()
})

function handlePreLevel1 (doc) {
  const payload = doc.level1
  if (payload && payload.isValid) {
    payload.validationComment = null
    doc.status = 'processed'
  }
}

function handlePreLevel2 (doc) {
  const payload = doc.level2
  if (payload) {
    if (payload.isEmailConfirmed && payload.isPhoneConfirmed) {
      payload.isValid = true
    }
    if (payload.isValid) {
      payload.validationComment = null
      doc.status = 'processed'
    }
  }
}

function handlePreLevel3 (doc) {
  const payload = doc.level3
  if (payload && payload.isValid) {
    payload.validationComment = null
    doc.status = 'processed'
  }
}

function handlePreLevel4 (doc) {
  const payload = doc.level4
  if (payload && payload.isValid) {
    payload.validationComment = null
    doc.status = 'processed'
  }
}

VerificationRequest.schema.post('save', async function (saved, next) {
  await Promise.all([
    handlePostLevel1(saved),
    handlePostLevel2(saved),
    handlePostLevel3(saved),
    handlePostLevel4(saved)
  ])

  if (keystone.get('app-started')) {
    const { profileProducer, activityLogProducer } = requireRoot('lib/rabbit')
    Object.keys(Constants.projects).forEach(project => {
      activityLogProducer.send(new ActivityLogMessage({
        project,
        type: Constants.notifications[project]['profileUpdated'],
        activityAt: Date.now(),
        user: saved.user.toString()
      }))
    })

    profileProducer.send({
      id: saved.user
    })
  }

  next()
})

async function handlePostLevel1 (doc) {
  const SecurityUser = keystone.list('SecurityUser').model
  const Image = keystone.list('Image').model
  const payload = doc.level1
  if (payload && payload.isValid) {
    const user = await SecurityUser
      .findOne({
        _id: doc.user
      })
    const avatar = payload.avatar
      ? await Image.findOne({ _id: payload.avatar })
      : null
    const {
      userName,
      birthDate
    } = payload
    user.level1 = {
      userName,
      birthDate,
      avatar,
      isValid: true
    }
    user.ipfsHash = await storeIntoIPFS({
      userName,
      avatar: avatar.image.secure_url
    })
    await user.save()
  }
}

async function handlePostLevel2 (doc) {
  const SecurityUser = keystone.list('SecurityUser').model
  const payload = doc.level2
  if (payload && payload.isValid) {
    const user = await SecurityUser
      .findOne({
        _id: doc.user
      })
    const { email, phone } = payload
    user.level2 = {
      email,
      phone,
      isValid: true
    }
    await user.save()
  }
}

async function handlePostLevel3 (doc) {
  const SecurityUser = keystone.list('SecurityUser').model
  const payload = doc.level3
  if (payload && payload.isValid) {
    const user = await SecurityUser
      .findOne({
        _id: doc.user
      })
    const {
      passport,
      expirationDate,
      attachments
    } = payload
    user.level3 = {
      passport,
      expirationDate,
      attachments,
      isValid: true
    }
    await user.save()
  }
}

async function handlePostLevel4 (doc) {
  const SecurityUser = keystone.list('SecurityUser').model
  const payload = doc.level4
  if (payload && payload.isValid) {
    const user = await SecurityUser
      .findOne({
        _id: doc.user
      })
    const {
      country,
      state,
      city,
      zip,
      addressLine1,
      addressLine2,
      attachments
    } = payload
    user.level4 = {
      country,
      state,
      city,
      zip,
      addressLine1,
      addressLine2,
      attachments,
      isValid: true
    }
    await user.save()
  }
}

VerificationRequest.defaultColumns = 'level, user, status, createdAt'
VerificationRequest.register()

function dependsOnLevel (level, object) {
  return mapValues(object, value => ({
    ...value,
    dependsOn: { level }
  }))
}
