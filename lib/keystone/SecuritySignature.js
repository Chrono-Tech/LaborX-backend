const keystone = require('keystone')
const Types = keystone.Field.Types

const SecuritySignature = new keystone.List('SecuritySignature', {
  // nocreate: true,
  // noedit: true,
  label: 'Signatures',
  map: { name: 'value' },
  track: {
    createdAt: true
  }
})

SecuritySignature.add({
  type: {
    type: Types.Select,
    options: [
      { value: 'ethereum-address', label: 'Ethereum Address' }
    ],
    default: 'ethereum-address',
    noedit: true,
    initial: true,
    required: true
  },
  value: { type: String, noedit: true, initial: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, noedit: true, initial: true }
})

SecuritySignature.schema.pre('save', function (next) {
  this.display = `${this.type}:${this.value}`
  next()
})

SecuritySignature.defaultColumns = 'value, user, type'

SecuritySignature.register()
