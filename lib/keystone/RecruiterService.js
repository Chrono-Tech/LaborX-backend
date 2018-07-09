const keystone = require('keystone')
const Types = keystone.Field.Types

const RecruiterService = new keystone.List('RecruiterService', {
  // nocreate: true,
  // noedit: true,
  hidden: true,
  drilldown: 'recruiter'
})

RecruiterService.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  description: { type: Types.Textarea, label: 'Description', required: true, initial: true },
  recruiter: { type: Types.Relationship, ref: 'RecruiterProfile', label: 'Recruiter', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationRecruiterRequest', initial: true },
  fee: { type: String, label: 'Fee', initial: true },
  attachments: { type: Types.Relationship, ref: 'File', label: 'Attachments', noedit: true, initial: true, many: true }
})

RecruiterService.defaultColumns = 'name|20%, recruiter|20%, fee|10%, description'

RecruiterService.register()
