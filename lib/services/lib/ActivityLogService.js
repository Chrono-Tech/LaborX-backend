const keystone = require('keystone')
const { ActivityLogResponse, ActivityLogModel } = requireRoot('lib/models')

const ActivityLogKeystone = keystone.list('ActivityLog').model

const defaultLimit = 10

class ActivityLogService {
  async save (activityLog) {
    return ActivityLogKeystone.create(activityLog)
  }

  async get (user, { till }) {
    const models = await ActivityLogKeystone.find({
      user,
      activityAt: { $lt: till }
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
