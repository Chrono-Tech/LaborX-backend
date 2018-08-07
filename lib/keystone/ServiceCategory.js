const keystone = require('keystone')

const ServiceCategory = new keystone.List('ServiceCategory', {
  // nocreate: true,
  // noedit: true,
  label: 'Service Category'
})

ServiceCategory.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  code: { type: Number, label: 'Code', unique: true, required: true, initial: true }
})

ServiceCategory.defaultColumns = 'code, name'

ServiceCategory.register()
