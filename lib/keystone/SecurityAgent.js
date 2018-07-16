const keystone = require('keystone')
const Types = keystone.Field.Types

const SecurityAgent = new keystone.List('SecurityAgent', {
  // nocreate: true,
  noedit: true,
  map: {
    name: 'purpose'
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
  contract: {
    type: Types.Select,
    options: [
      { value: 'UserInterface', label: 'UserInterface' }
    ],
    default: 'UserInterface',
    initial: true,
    required: true
  },
  address: { type: String, required: true, initial: true },
  secret: { type: String, required: true, initial: true, hidden: true },
  isLocked: { type: Boolean, initial: true }
})

SecurityAgent.defaultColumns = 'purpose, user, principal, contract, isLocked, address'

SecurityAgent.register()
