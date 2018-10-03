const mongoose = require('mongoose')
const keystone = require('keystone')
const { imageType } = requireRoot('lib/helpers')

const Types = keystone.Field.Types

const VerificationRecruiterRequest = new keystone.List('VerificationRecruiterRequest', {
  track: true,
  drilldown: 'user',
  label: 'Recruiter Verification'
})

VerificationRecruiterRequest.add({
  name: { type: String, label: 'Name', noedit: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true, noedit: true },
  pageBackground: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
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
  },
  verifiable: {
    intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
    pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false, hidden: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
  },
  validationComment: { type: String, label: 'Validation comment' },
  isValid: { type: Boolean, label: 'Approved' }
})

VerificationRecruiterRequest.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

VerificationRecruiterRequest.relationship({ path: 'socials', ref: 'RecruiterSocial', refPath: 'request' })

VerificationRecruiterRequest.schema.virtual('socials', {
  ref: 'RecruiterSocial',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationRecruiterRequest.relationship({ path: 'services', ref: 'RecruiterService', refPath: 'request' })

VerificationRecruiterRequest.schema.virtual('services', {
  ref: 'RecruiterService',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationRecruiterRequest.schema.pre('save', async function (next) {
  const SecurityUser = keystone.list('SecurityUser')
  const user = await SecurityUser.model.findOne({
    _id: this.user
  })
  this.name = user.level1.userName || user.name
  if (this.verifiable.pageBackground) {
    const Image = keystone.list('Image')
    const pageBackground = await Image.model.findOne({
      _id: this.verifiable.pageBackground
    })
    this.pageBackground = pageBackground.image
  }
  if (this.isValid) {
    this.validationComment = null
    this.status = 'processed'
  }
  next()
})

VerificationRecruiterRequest.schema.post('save', async function (saved, next) {
  if (saved.isValid) {
    // const SecurityUser = keystone.list('SecurityUser')
    const RecruiterProfile = keystone.list('RecruiterProfile')
    const RecruiterService = keystone.list('RecruiterService')
    const RecruiterSocial = keystone.list('RecruiterSocial')

    const request = await VerificationRecruiterRequest.model
      .findOne({ _id: saved._id })
      .populate('services')
      .populate('socials')

    let recruiter = await RecruiterProfile.model
      .findOne({ user: saved.user })

    if (recruiter) {
      Object.assign(recruiter, {
        verifiable: saved.verifiable,
        custom: saved.custom
      })
    } else {
      recruiter = await RecruiterProfile.model.create({
        user: saved.user,
        verifiable: saved.verifiable,
        custom: saved.custom
      })
    }

    const [ services, socials ] = await Promise.all([
      RecruiterService.model.find({ recruiter: recruiter._id }).exec(),
      RecruiterSocial.model.find({ recruiter: recruiter._id }).exec()
    ])

    await Promise.all([
      ...services.map(s => s.remove()),
      ...socials.map(s => s.remove())
    ])

    await Promise.all([
      ...(request.services || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) => {
          return RecruiterService.model.create({ ...s, recruiter: recruiter._id })
        }
      ),
      ...(request.socials || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) =>
          RecruiterSocial.model.create({ ...s, recruiter: recruiter._id })
      )
    ])
    await recruiter.save()
  }
  next()
})

VerificationRecruiterRequest.defaultColumns = 'name, pageBackground, user, status, createdAt'
VerificationRecruiterRequest.register()
