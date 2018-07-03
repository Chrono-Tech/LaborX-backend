// const { mapValues } = require('lodash')
const mongoose = require('mongoose')
const keystone = require('keystone')
const { imageType } = requireRoot('lib/helpers')
// const { storeIntoIPFS } = requireRoot('lib/utils')

const Types = keystone.Field.Types

const VerificationWorkerRequest = new keystone.List('VerificationWorkerRequest', {
  track: true,
  drilldown: 'user',
  label: 'Verification Requests'
})

VerificationWorkerRequest.add({
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
  regular: {
    currencies: { type: Types.Relationship, ref: 'Currency', label: 'Currencies', noedit: true, initial: true, many: true },
    hourlyCharge: { type: String, required: true, initial: true, noedit: true }
  },
  verifiable: {
    intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
    pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false, hidden: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
  },
  validationComment: { type: String, label: 'Validation comment' },
  isValid: { type: Boolean, label: 'Approved' }
})

VerificationWorkerRequest.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

VerificationWorkerRequest.relationship({ path: 'socials', ref: 'WorkerSocial', refPath: 'request' })

VerificationWorkerRequest.schema.virtual('socials', {
  ref: 'WorkerSocial',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationWorkerRequest.relationship({ path: 'services', ref: 'WorkerService', refPath: 'request' })

VerificationWorkerRequest.schema.virtual('services', {
  ref: 'WorkerService',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationWorkerRequest.relationship({ path: 'employments', ref: 'WorkerEmployment', refPath: 'request' })

VerificationWorkerRequest.schema.virtual('employments', {
  ref: 'WorkerEmployment',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationWorkerRequest.schema.pre('save', async function (next) {
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

VerificationWorkerRequest.schema.post('save', async function (saved, next) {
  if (saved.isValid) {
    // const SecurityUser = keystone.list('SecurityUser')
    const WorkerProfile = keystone.list('WorkerProfile')
    const WorkerService = keystone.list('WorkerService')
    const WorkerSocial = keystone.list('WorkerSocial')
    const WorkerEmployment = keystone.list('WorkerEmployment')

    const request = await VerificationWorkerRequest.model
      .findOne({ _id: saved._id })
      .populate('services')
      .populate('socials')
      .populate('employments')

    const worker = await WorkerProfile.model
      .findOne({ user: saved.user })

    const [ services, socials, employments ] = await Promise.all([
      WorkerService.model.find({ worker: worker._id }).exec(),
      WorkerSocial.model.find({ worker: worker._id }).exec(),
      WorkerEmployment.model.find({ worker: worker._id }).exec()
    ])
    Object.assign(worker, {
      regular: saved.regular,
      verifiable: saved.verifiable,
      custom: saved.custom
    })
    await Promise.all([
      ...services.map(s => s.remove()),
      ...socials.map(s => s.remove()),
      ...employments.map(e => e.remove())
    ])

    console.log('request', request.services, request.socials, request.employments)

    await Promise.all([
      ...(request.services || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) => {
          console.log('service')
          return WorkerService.model.create({ ...s, worker: worker._id })
        }
      ),
      ...(request.socials || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) =>
          WorkerSocial.model.create({ ...s, worker: worker._id })
      ),
      ...(request.employments || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) =>
          WorkerEmployment.model.create({ ...s, worker: worker._id })
      )
    ])
    await worker.save()
  }
  next()
})

VerificationWorkerRequest.defaultColumns = 'name, pageBackground, user, status, createdAt'
VerificationWorkerRequest.register()
