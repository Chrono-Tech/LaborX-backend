const keystone = require('keystone')
const { publicKeyToAddress } = requireRoot('lib/utils')
const Types = keystone.Field.Types

const SecuritySignature = new keystone.List('SecuritySignature', {
  nocreate: true,
  noedit: true,
  nodelete: true,
  label: 'Signatures',
  map: { name: 'address' },
  track: {
    createdAt: true
  }
})

SecuritySignature.add({
  type: {
    type: Types.Select,
    options: [
      { value: 'ethereum-public-key', label: 'Ethereum Public Key' }
    ],
    default: 'ethereum-public-key',
    initial: true,
    required: true
  },
  value: { type: String, initial: true },
  address: { type: String, initial: false, hidden: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true }
})

SecuritySignature.schema.pre('save', function (next) {
  switch (this.type) {
    case 'ethereum-public-key':
      this.address = publicKeyToAddress(this.value)
      break
    default:
      this.address = this.value
  }
  next()
})

SecuritySignature.defaultColumns = 'address, user, type'

SecuritySignature.register()
