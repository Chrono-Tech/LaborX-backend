const mongoose = require('mongoose')
const keystone = require('keystone')
const Types = keystone.Field.Types
const { imageType } = requireRoot('lib/helpers')

const RecruiterProfile = new keystone.List('RecruiterProfile', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'user',
  label: 'Recruiters',
  track: true
})

RecruiterProfile.add({
  name: { type: String, label: 'Name', noedit: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true, noedit: true },
  pageBackground: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
  verifiable: {
    intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
    pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false, hidden: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
  }
})

RecruiterProfile.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

RecruiterProfile.relationship({ path: 'socials', ref: 'RecruiterSocial', refPath: 'recruiter' })

RecruiterProfile.schema.virtual('socials', {
  ref: 'RecruiterSocial',
  localField: '_id',
  foreignField: 'recruiter',
  justOne: false
})

RecruiterProfile.relationship({ path: 'services', ref: 'RecruiterService', refPath: 'recruiter' })

RecruiterProfile.schema.virtual('services', {
  ref: 'RecruiterService',
  localField: '_id',
  foreignField: 'recruiter',
  justOne: false
})

RecruiterProfile.schema.pre('save', async function (next) {
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

RecruiterProfile.schema.post('save', async function (saved, next) {
  const SecurityUser = keystone.list('SecurityUser')
  const user = await SecurityUser.model.findOne({
    _id: saved.user
  })
  user.recruiter = {
    recruiter: saved._id,
    isValid: true
  }
  await user.save()
  next()
})

RecruiterProfile.defaultColumns = 'name, pageBackground, user, createdAt'

RecruiterProfile.register()
