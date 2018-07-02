const keystone = require('keystone')
const Types = keystone.Field.Types

const CollaboratorProfile = new keystone.List('CollaboratorProfile', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'client',
  map: { name: 'position' },
  label: 'Collaborators'
})

CollaboratorProfile.add({
  position: { type: String, required: true, initial: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', initial: true, required: true },
  client: { type: Types.Relationship, ref: 'ClientProfile', initial: true, required: true }
})

CollaboratorProfile.defaultColumns = 'position, client, user'

CollaboratorProfile.register()
