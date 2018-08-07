// const { mapValues } = require('lodash')
const mongoose = require('mongoose')
const keystone = require('keystone')
const { imageType } = requireRoot('lib/helpers')
// const { storeIntoIPFS } = requireRoot('lib/utils')

const Types = keystone.Field.Types

const VerificationClientRequest = new keystone.List('VerificationClientRequest', {
  track: true,
  drilldown: 'user',
  label: 'Client Verification',
  map: { name: 'verifiable.name' }
})

VerificationClientRequest.add({
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
  },
  validationComment: { type: String, label: 'Validation comment' },
  isValid: { type: Boolean, label: 'Approved' }
})

VerificationClientRequest.schema.add({
  custom: mongoose.Schema.Types.Mixed
})

VerificationClientRequest.relationship({ path: 'collaborators', ref: 'CollaboratorProfile', refPath: 'client' })

VerificationClientRequest.schema.virtual('collaborators', {
  ref: 'CollaboratorProfile',
  localField: '_id',
  foreignField: 'request',
  justOne: false
})

VerificationClientRequest.schema.pre('save', async function (next) {
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

VerificationClientRequest.schema.post('save', async function (saved, next) {
  if (saved.isValid) {
    // const SecurityUser = keystone.list('SecurityUser')
    const ClientProfile = keystone.list('ClientProfile')
    const CollaboratorProfile = keystone.list('CollaboratorProfile')

    const request = await VerificationClientRequest.model
      .findOne({ _id: saved._id })
      .populate('collaborators')

    let client = await ClientProfile.model
      .findOne({ user: saved.user })

    if (client) {
      Object.assign(client, {
        regular: saved.regular,
        verifiable: saved.verifiable,
        custom: saved.custom
      })
    } else {
      client = await ClientProfile.model.create({
        user: saved.user,
        regular: saved.regular,
        verifiable: saved.verifiable,
        custom: saved.custom
      })
    }

    const [ collaborators ] = await Promise.all([
      CollaboratorProfile.model.find({ client: client._id }).exec()
    ])

    await Promise.all([
      ...collaborators.map(e => e.remove())
    ])

    await Promise.all([
      ...(request.collaborators || []).map(s => s.toJSON()).map(
        ({ _id, request, ...s }) =>
          CollaboratorProfile.model.create({ ...s, client: client._id })
      )
    ])
    await client.save()
  }
  next()
})

VerificationClientRequest.defaultColumns = 'verifiable.name|20%, verifiable.type|10%, pageBackground|5%, user|20%, verifiable.website, createdAt'
VerificationClientRequest.register()
