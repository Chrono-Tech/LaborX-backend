const keystone = require('keystone')
const crypto = require('crypto')
const bs58 = require('bs58')
const { promisify } = require('util')
const Types = keystone.Field.Types

const SecurityToken = new keystone.List('SecurityToken', {
  // nocreate: true,
  noedit: true,
  map: {
    name: 'purpose'
  },
  label: 'Tokens',
  track: {
    createdAt: true,
    updatedAt: true
  }
})

SecurityToken.add({
  token: { type: String },
  purpose: { type: String },
  user: { type: Types.Relationship, ref: 'SecurityUser', initial: true, required: true }
})

SecurityToken.schema.pre('save', function (next) {
  promisify(crypto.randomBytes)(128).then(
    random => {
      this.token = bs58.encode(crypto.createHash('sha256').update(random).digest())
      next()
    }
  )
})

SecurityToken.defaultColumns = 'purpose, token, user, createdAt, updatedAt'

SecurityToken.register()
