const keystone = require('keystone')
const Types = keystone.Field.Types

const WorkerService = new keystone.List('WorkerService', {
  // nocreate: true,
  // noedit: true,
  hidden: true,
  drilldown: 'worker'
})

WorkerService.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  category: { type: Types.Relationship, ref: 'ServiceCategory', label: 'category', initial: true, required: true },
  worker: { type: Types.Relationship, ref: 'WorkerProfile', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationWorkerRequest', initial: true },
  description: { type: Types.Textarea, label: 'Description', required: true, initial: true },
  fee: { type: String, label: 'Specific Fee', initial: true },
  minFee: { type: String, label: 'Minimal fee', initial: true },
  attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
})

WorkerService.defaultColumns = 'name, worker, fee, minFee'

WorkerService.register()
