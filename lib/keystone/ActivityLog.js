const keystone = require('keystone')
const {
  Constants: { projects, notifications },
  ActivityLogModel
} = requireRoot('lib/models')
const Types = keystone.Field.Types

const isProduction = process.env.NODE_ENV === 'production'

const ActivityLog = new keystone.List('ActivityLog', {
  nocreate: isProduction,
  noedit: isProduction,
  nodelete: isProduction,
  drilldown: 'user',
  track: {
    createdAt: true
  }
})

const allNotificaionTypes = Object.entries(notifications).reduce((res, [project, nTypes]) => {
  const projectNotifications = Object.keys(nTypes).reduce((res, e) => {
    res[e] = e
    return res
  }, {})

  return {
    ...res,
    ...projectNotifications
  }
}, {})

ActivityLog.add({
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true },
  project: {
    type: Types.Select,
    options: [
      { value: projects.exchange, label: 'Exchange' },
      { value: projects.laborx, label: 'LaborX' }
    ],
    initial: true,
    required: true
  },
  type: {
    type: Types.Select,
    options: Object.keys(allNotificaionTypes).map(e => ({
      value: e,
      label: e
    })),
    initial: true,
    required: true
  },
  activityAt: { type: Types.Datetime, utc: true, required: true, default: Date.now, initial: true },
  payload: { type: String }
})

ActivityLog.schema.post('save', function (doc) {
  const { activityNotificationService } = requireRoot('lib/services')
  activityNotificationService.notify(ActivityLogModel.fromMongo(doc))
})

ActivityLog.defaultColumns = 'project, user, type, activityAt'

ActivityLog.register()
