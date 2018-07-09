const keystone = require('keystone')
const EventEmitter = require('events')

const SecurityUserModel = keystone.list('SecurityUser').model

class ActivityNotificationService extends EventEmitter {
  async notify (activity) {
    const { project, type: activityType } = activity
    const user = (await SecurityUserModel.findOne({
      _id: activity.user
    })).toObject()

    if (this.isNotificationEnabled({ user, project, notificationType: 'sms', activityType })) {
      setImmediate(() => {
        this.emit('sms', activity)
      })
    }

    if (this.isNotificationEnabled({ user, project, notificationType: 'email', activityType })) {
      setImmediate(() => {
        this.emit('email', activity)
      })
    }
  }

  isNotificationEnabled ({ user, project, notificationType, activityType }) {
    const notifications = Object.entries(user
      .notifications[project][notificationType])
      .filter(([type, enabled]) => {
        return enabled
      })
      .map(([type, _]) => {
        return type
      })

    return notifications.includes(activityType)
  }
}

module.exports = ActivityNotificationService
