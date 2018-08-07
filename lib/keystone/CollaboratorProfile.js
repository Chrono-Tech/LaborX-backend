const keystone = require('keystone')
const Types = keystone.Field.Types

const CollaboratorProfile = new keystone.List('CollaboratorProfile', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'client',
  map: { name: 'position' },
  label: 'Collaborators',
  hidden: true
})

CollaboratorProfile.add({
  position: { type: String, required: true, initial: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', initial: true, required: true },
  client: { type: Types.Relationship, ref: 'ClientProfile', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationClientRequest', initial: true },
  hasApproveFromCollaborator: { type: Boolean, label: 'Person Approve', initial: true, noedit: true },
  hasApproveFromClient: { type: Boolean, label: 'Client Approve', initial: true, noedit: true }
})

CollaboratorProfile.defaultColumns = 'position|20%, client|20%, user|20%, hasApproveFromClient|10%, hasApproveFromCollaborator|10%'

CollaboratorProfile.register()
