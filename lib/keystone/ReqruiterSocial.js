const keystone = require('keystone')
const Types = keystone.Field.Types

const ReqruiterSocial = new keystone.List('ReqruiterSocial', {
  // nocreate: true,
  // noedit: true,
  drilldown: 'reqruiter'
})

ReqruiterSocial.add({
  name: { type: String, label: 'Name', required: true, initial: true },
  reqruiter: { type: Types.Relationship, ref: 'ReqruiterProfile', initial: true, required: true },
  url: { type: Types.Url, label: 'URL', required: true, initial: true }
})

ReqruiterSocial.defaultColumns = 'name, reqruiter, url'

ReqruiterSocial.register()
