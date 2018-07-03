const keystone = require('keystone')
const Types = keystone.Field.Types

const WorkerEmployment = new keystone.List('WorkerEmployment', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'worker',
  hidden: true,
  map: { name: 'organization' }
})

WorkerEmployment.add({
  organization: { type: String, label: 'Organization', required: true, initial: true },
  since: { type: Date, utc: true, label: 'Since', required: true, initial: true },
  until: { type: Date, utc: true, label: 'Until', required: false, initial: true },
  worker: { type: Types.Relationship, ref: 'WorkerProfile', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationWorkerRequest', initial: true },
  responsibilities: { type: Types.Textarea, label: 'Responsibilities', required: false, initial: true }
})

WorkerEmployment.defaultColumns = 'organization, worker, since, until'

WorkerEmployment.register()
