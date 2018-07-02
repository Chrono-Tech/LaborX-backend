const keystone = require('keystone')
const Types = keystone.Field.Types

const ClientProfile = new keystone.List('ClientProfile', {
  track: true,
  label: 'Clients'
})

ClientProfile.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  type: {
    type: Types.Select,
    options: [
      { value: 'organization', label: 'Organization' },
      { value: 'entrepreneur', label: 'Entrepreneur' }
    ],
    default: 'organization',
    initial: true,
    required: true
  },
  website: { type: Types.Url, label: 'Website', required: true, initial: true },
  email: { type: Types.Email, trim: true, index: true, unique: false, noedit: true, label: 'Email', initial: true }
})

ClientProfile.relationship({ path: 'collaborators', ref: 'CollaboratorProfile', refPath: 'client' })

ClientProfile.schema.virtual('collaborators', {
  ref: 'CollaboratorProfile',
  localField: '_id',
  foreignField: 'client',
  justOne: false
})

ClientProfile.defaultColumns = 'name, type|20%, website, email'
ClientProfile.register()
