const keystone = require('keystone')
const { ActivityLogResponse, ActivityLogModel } = requireRoot('lib/models')

const ActivityLogKeystone = keystone.list('ActivityLog').model
const SecurityUserModel = keystone.list('SecurityUser').model

const defaultLimit = 10

class ActivityLogService {
  async save (activityLog) {
    const user = await SecurityUserModel.findOne({
      _id: activityLog.user
    })
    if (!user) {
      return
    }
    return ActivityLogKeystone.create(activityLog)
  }

  async get (user, { till, project }) {
    const models = await ActivityLogKeystone.find({
      user,
      activityAt: { $lt: till },
      project
    }).sort({
      activityAt: 'desc'
    }).limit(defaultLimit)

    const activities = models.map(e => {
      return ActivityLogModel.fromMongo(e)
    })

    return new ActivityLogResponse({
      records: activities
    })
  }
}

module.exports = ActivityLogService
