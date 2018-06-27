const keystone = require('keystone')
const AbstractFanoutConsumer = require('../AbstractFanoutConsumer')
const { ActivityLogModel, ActivityLogMessage } = requireRoot('lib/models')

const SecuritySignatureModel = keystone.list('SecuritySignature').model

class ActivityLogConsumer extends AbstractFanoutConsumer {
  constructor () {
    super({
      exchangeName: 'activity-log',
      prefetch: 1
    })
  }

  async handleMessage (data) {
    const { activityLogService } = requireRoot('lib/services')

    const activityLog = ActivityLogMessage.fromJson(data)

    let user = activityLog.user
    if (activityLog.userSignature) {
      const signature = await SecuritySignatureModel.findOne({
        address: activityLog.userSignature
      })

      if (!signature) {
        return
      }

      user = signature.user.toString()
    }

    await activityLogService.save(ActivityLogModel.fromJson({
      ...data,
      user
    }, {}, { stripUnknown: true }))
  }
}

module.exports = ActivityLogConsumer
