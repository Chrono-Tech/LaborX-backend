const keystone = require('keystone')
const Types = keystone.Field.Types

const ReqruiterService = new keystone.List('ReqruiterService', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'user'
})

ReqruiterService.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  description: { type: Types.Textarea, label: 'Description', required: true, initial: true },
  reqruiter: { type: Types.Relationship, ref: 'ReqruiterProfile', label: 'Reqruiter', initial: true, required: true },
  fee: { type: String, label: 'Fee', initial: true },
  attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
})

ReqruiterService.defaultColumns = 'name, reqruiter, fee'

ReqruiterService.register()
