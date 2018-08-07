const mongoose = require('mongoose')
const keystone = require('keystone')
const Types = keystone.Field.Types
const { imageType } = requireRoot('lib/helpers')

const WorkerProfile = new keystone.List('WorkerProfile', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'user',
  label: 'Workers',
  track: true
})

WorkerProfile.add({
  name: { type: String, label: 'Name', noedit: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true, noedit: true },
  pageBackground: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
  regular: {
    currencies: { type: Types.Relationship, ref: 'Currency', label: 'Currencies', noedit: true, initial: true, many: true },
    hourlyCharge: { type: String, required: true, initial: true, noedit: true }
  },
  verifiable: {
    intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
    pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false, hidden: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
  }
})

WorkerProfile.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

WorkerProfile.relationship({ path: 'socials', ref: 'WorkerSocial', refPath: 'worker' })

WorkerProfile.schema.virtual('socials', {
  ref: 'WorkerSocial',
  localField: '_id',
  foreignField: 'worker',
  justOne: false
})

WorkerProfile.relationship({ path: 'services', ref: 'WorkerService', refPath: 'worker' })

WorkerProfile.schema.virtual('services', {
  ref: 'WorkerService',
  localField: '_id',
  foreignField: 'worker',
  justOne: false
})

WorkerProfile.relationship({ path: 'employments', ref: 'WorkerEmployment', refPath: 'worker' })

WorkerProfile.schema.virtual('employments', {
  ref: 'WorkerEmployment',
  localField: '_id',
  foreignField: 'worker',
  justOne: false
})

WorkerProfile.schema.pre('save', async function (next) {
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
  next()
})

WorkerProfile.schema.post('save', async function (saved, next) {
  const SecurityUser = keystone.list('SecurityUser')
  const user = await SecurityUser.model.findOne({
    _id: saved.user
  })
  user.worker = {
    ...user.worker,
    worker: saved._id,
    isValid: true
  }
  await user.save()
  next()
})

WorkerProfile.defaultColumns = 'name, pageBackground, user, createdAt'

WorkerProfile.register()
