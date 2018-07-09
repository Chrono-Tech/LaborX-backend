const keystone = require('keystone')

const Currency = new keystone.List('Currency', {
  // nocreate: true,
  // noedit: true,
  map: { name: 'symbol' }
})

Currency.add({
  symbol: { type: String, label: 'Symbol', required: true, initial: true },
  title: { type: String, label: 'Title', required: true, initial: true }
})

Currency.defaultColumns = 'symbol, title'

Currency.register()
