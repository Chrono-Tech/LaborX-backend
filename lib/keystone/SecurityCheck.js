const keystone = require('keystone')
const Types = keystone.Field.Types

const SecurityCheck = new keystone.List('SecurityCheck', {
  nocreate: true,
  noedit: true,
  label: 'Checks',
  map: {
    name: 'type'
  },
  track: {
    createdAt: true
  }
})

SecurityCheck.add({
  check: { type: String },
  type: {
    type: Types.Select,
    options: [
      { value: 'confirm-email', label: 'Email Confirmation' },
      { value: 'confirm-phone', label: 'Phone Confirmation' }
    ],
    initial: true,
    required: true
  },
  payload: { type: String },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true }
})

SecurityCheck.schema.pre('save', async function (next) {
  this.check = Math.floor(10000 + Math.random() * 90000)
  next()
})

SecurityCheck.defaultColumns = 'type, payload, user, check, createdAt'

SecurityCheck.register()
