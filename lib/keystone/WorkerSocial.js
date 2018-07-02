const keystone = require('keystone')
const Types = keystone.Field.Types

const WorkerSocial = new keystone.List('WorkerSocial', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'worker'
})

WorkerSocial.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  worker: { type: Types.Relationship, ref: 'WorkerProfile', initial: true, required: true },
  url: { type: Types.Url, label: 'URL', required: true, initial: true }
})

WorkerSocial.defaultColumns = 'name, worker, url'

WorkerSocial.register()
