const mongoose = require('mongoose')
const keystone = require('keystone')
const { imageType } = requireRoot('lib/helpers')

const Types = keystone.Field.Types

const VerificationReqruiterRequest = new keystone.List('VerificationReqruiterRequest', {
  track: true,
  drilldown: 'user',
  label: 'Reqruiter Verification'
})

VerificationReqruiterRequest.add({
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

VerificationReqruiterRequest.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

VerificationReqruiterRequest.relationship({ path: 'socials', ref: 'ReqruiterSocial', refPath: 'request' })

VerificationReqruiterRequest.schema.virtual('socials', {
  ref: 'ReqruiterSocial',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationReqruiterRequest.relationship({ path: 'services', ref: 'ReqruiterService', refPath: 'request' })

VerificationReqruiterRequest.schema.virtual('services', {
  ref: 'ReqruiterService',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationReqruiterRequest.schema.pre('save', async function (next) {
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

VerificationReqruiterRequest.schema.post('save', async function (saved, next) {
  if (saved.isValid) {
    // const SecurityUser = keystone.list('SecurityUser')
    const ReqruiterProfile = keystone.list('ReqruiterProfile')
    const ReqruiterService = keystone.list('ReqruiterService')
    const ReqruiterSocial = keystone.list('ReqruiterSocial')

    const request = await VerificationReqruiterRequest.model
      .findOne({ _id: saved._id })
      .populate('services')
      .populate('socials')

    const reqruiter = await ReqruiterProfile.model
      .findOne({ user: saved.user })

    const [ services, socials ] = await Promise.all([
      ReqruiterService.model.find({ reqruiter: reqruiter._id }).exec(),
      ReqruiterSocial.model.find({ reqruiter: reqruiter._id }).exec()
    ])
    Object.assign(reqruiter, {
      verifiable: saved.verifiable,
      custom: saved.custom
    })
    await Promise.all([
      ...services.map(s => s.remove()),
      ...socials.map(s => s.remove())
    ])

    await Promise.all([
      ...(request.services || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) => {
          return ReqruiterService.model.create({ ...s, reqruiter: reqruiter._id })
        }
      ),
      ...(request.socials || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) =>
          ReqruiterSocial.model.create({ ...s, reqruiter: reqruiter._id })
      )
    ])
    await reqruiter.save()
  }
  next()
})

VerificationReqruiterRequest.defaultColumns = 'name, pageBackground, user, status, createdAt'
VerificationReqruiterRequest.register()
