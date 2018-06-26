const AbstractFanoutConsumer = require('../AbstractFanoutConsumer')
const { ActivityLogModel } = requireRoot('lib/models')

class ActivityLogConsumer extends AbstractFanoutConsumer {
  constructor () {
    super({
      exchangeName: 'activity-log',
      prefetch: 1
    })
  }

  async handleMessage (data) {
    const { activityLogService } = requireRoot('lib/services')

    const activityLog = ActivityLogModel.fromJson(data)
    await activityLogService.save(activityLog)
  }
}

module.exports = ActivityLogConsumer
