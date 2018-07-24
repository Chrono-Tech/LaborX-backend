const keystone = require('keystone')
const Types = keystone.Field.Types

const SecurityAgent = new keystone.List('SecurityAgent', {
  // nocreate: true,
  noedit: true,
  map: {
    name: 'contract'
  },
  label: 'Agents',
  track: {
    createdAt: true,
    updatedAt: true
  }
})

SecurityAgent.add({
  user: { type: Types.Relationship, ref: 'SecurityUser', initial: true, required: true },
  purpose: { type: String, required: true, initial: true },
  principal: { type: String, required: true, initial: true },
  contract: { type: String, required: true, initial: true },
  secret: { type: String, required: true, initial: true, hidden: true }
})

SecurityAgent.defaultColumns = 'contract, purpose, user, principal'

SecurityAgent.register()
