const mongoose = require('mongoose')
const keystone = require('keystone')
const Types = keystone.Field.Types
const { imageType } = requireRoot('lib/helpers')

const ReqruiterProfile = new keystone.List('ReqruiterProfile', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'user',
  label: 'Reqruiters',
  track: true
})

ReqruiterProfile.add({
  name: { type: String, label: 'Name', noedit: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true, noedit: true },
  pageBackground: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
  verifiable: {
    intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
    pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false, hidden: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
  }
})

ReqruiterProfile.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

ReqruiterProfile.relationship({ path: 'socials', ref: 'ReqruiterSocial', refPath: 'reqruiter' })

ReqruiterProfile.schema.virtual('socials', {
  ref: 'ReqruiterSocial',
  localField: '_id',
  foreignField: 'reqruiter',
  justOne: false
})

ReqruiterProfile.relationship({ path: 'services', ref: 'ReqruiterService', refPath: 'reqruiter' })

ReqruiterProfile.schema.virtual('services', {
  ref: 'ReqruiterService',
  localField: '_id',
  foreignField: 'reqruiter',
  justOne: false
})

ReqruiterProfile.schema.pre('save', async function (next) {
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

ReqruiterProfile.defaultColumns = 'name, pageBackground, user, createdAt'

ReqruiterProfile.register()
