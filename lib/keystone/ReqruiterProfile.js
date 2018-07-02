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
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true },
  intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
  pageBackgroundImage: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
  pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false },
  attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
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
  if (this.pageBackground) {
    const Image = keystone.list('Image')
    const pageBackground = await Image.model.findOne({
      _id: this.pageBackground._id
    })
    this.pageBackgroundImage = pageBackground.image
  }
  next()
})

ReqruiterProfile.defaultColumns = 'user, createdAt'

ReqruiterProfile.register()
