const keystone = require('keystone')

const Types = keystone.Field.Types

const KeystoneUser = new keystone.List('KeystoneUser')

KeystoneUser.add({
  name: { type: String, unique: true, trim: true, initial: true, required: true },
  email: {
    type: Types.Email,
    initial: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
    set: (value) => value || null
  },
  password: { type: Types.Password, initial: true }
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true, initial: true }
})

KeystoneUser.schema.pre('save', function (next) {
  this.email = this.email && this.email.toLowerCase()
  next()
})

// Provide access to Keystone
KeystoneUser.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin
})

KeystoneUser.defaultColumns = 'name, email, isAdmin'
KeystoneUser.register()
