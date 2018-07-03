const keystone = require('keystone')
const Types = keystone.Field.Types

const ReqruiterSocial = new keystone.List('ReqruiterSocial', {
  // nocreate: true,
  // noedit: true,
  hidden: true,
  drilldown: 'reqruiter'
})

ReqruiterSocial.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  reqruiter: { type: Types.Relationship, ref: 'ReqruiterProfile', initial: true },
  request: { type: Types.Relationship, ref: 'VerificationReqruiterRequest', initial: true },
  url: { type: Types.Url, label: 'URL', required: true, initial: true }
})

ReqruiterSocial.defaultColumns = 'name|20%, reqruiter|20%, url'

ReqruiterSocial.register()
