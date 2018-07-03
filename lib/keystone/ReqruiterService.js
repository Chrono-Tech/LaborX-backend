const keystone = require('keystone')
const Types = keystone.Field.Types

const ReqruiterService = new keystone.List('ReqruiterService', {
  // nocreate: true,
  // noedit: true,
  hidden: true,
  drilldown: 'reqruiter'
})

ReqruiterService.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  description: { type: Types.Textarea, label: 'Description', required: true, initial: true },
  reqruiter: { type: Types.Relationship, ref: 'ReqruiterProfile', label: 'Reqruiter', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationReqruiterRequest', initial: true },
  fee: { type: String, label: 'Fee', initial: true },
  attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
})

ReqruiterService.defaultColumns = 'name|20%, reqruiter|20%, fee|10%, description'

ReqruiterService.register()
