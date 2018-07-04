const keystone = require('keystone')
const Types = keystone.Field.Types

const RecruiterSocial = new keystone.List('RecruiterSocial', {
  // nocreate: true,
  // noedit: true,
  hidden: true,
  drilldown: 'recruiter'
})

RecruiterSocial.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  recruiter: { type: Types.Relationship, ref: 'RecruiterProfile', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationRecruiterRequest', initial: true },
  url: { type: Types.Url, label: 'URL', required: true, initial: true }
})

RecruiterSocial.defaultColumns = 'name|20%, recruiter|20%, url'

RecruiterSocial.register()
