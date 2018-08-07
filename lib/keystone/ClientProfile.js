const mongoose = require('mongoose')
const keystone = require('keystone')
const Types = keystone.Field.Types
const { imageType } = requireRoot('lib/helpers')

const ClientProfile = new keystone.List('ClientProfile', {
  track: true,
  label: 'Clients',
  map: { name: 'verifiable.name' }
})

ClientProfile.add({
  user: { type: Types.Relationship, ref: 'SecurityUser', label: 'User', initial: true, required: true, noedit: true },
  pageBackground: imageType({ folder: 'images', label: 'Page Background', noedit: true }),
  verifiable: {
    name: { type: String, label: 'Name', noedit: true },
    type: {
      type: Types.Select,
      options: [
        { value: 'organization', label: 'Organization' },
        { value: 'entrepreneur', label: 'Entrepreneur' }
      ],
      default: 'organization',
      initial: true,
      required: true,
      noedit: true
    },
    intro: { type: Types.Textarea, trim: true, label: 'Intro', noedit: true, initial: true },
    pageBackground: { type: Types.Relationship, ref: 'Image', label: 'Page Background', noedit: true, initial: true, many: false, hidden: true },
    website: { type: Types.Url, trim: true, label: 'Website', noedit: true, initial: true },
    email: { type: Types.Email, trim: true, label: 'Email', noedit: true, initial: true },
    attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
  },
  regular: {
    specializations: { type: Types.Relationship, ref: 'ServiceCategory', label: 'Specializations', noedit: true, initial: true, many: true }
  }
})

ClientProfile.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

ClientProfile.relationship({ path: 'collaborators', ref: 'CollaboratorProfile', refPath: 'client' })

ClientProfile.schema.virtual('collaborators', {
  ref: 'CollaboratorProfile',
  localField: '_id',
  foreignField: 'client',
  justOne: false
})

ClientProfile.schema.pre('save', async function (next) {
  if (this.verifiable.pageBackground) {
    const Image = keystone.list('Image')
    const pageBackground = await Image.model.findOne({
      _id: this.verifiable.pageBackground
    })
    this.pageBackground = pageBackground.image
  }
  next()
})

ClientProfile.schema.post('save', async function (saved, next) {
  const SecurityUser = keystone.list('SecurityUser')
  const user = await SecurityUser.model.findOne({
    _id: saved.user
  })
  user.client = {
    ...user.client,
    client: saved._id,
    isValid: true
  }
  await user.save()
  next()
})

ClientProfile.defaultColumns = 'verifiable.name|20%, verifiable.type|20%, pageBackground|20%, user|20%, createdAt'
ClientProfile.register()
