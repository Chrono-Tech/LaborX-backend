const keystone = require('keystone')
const EventEmitter = require('events')
const templates = requireRoot('sms')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'SmSNotificationService'
})

const SecurityUserModel = keystone.list('SecurityUser').model

class SmSNotificationService extends EventEmitter {
  async notify (activity) {
    const { smsService } = requireRoot('lib/services')

    const user = await SecurityUserModel.findOne({
      _id: activity.user
    })

    const userPhone = user.level2.phone

    if (!userPhone) {
      return
    }

    const { project, type } = activity
    const payload = this.preparePayload(activity.payload)

    const template = templates[project][type]

    if (!template) {
      log.warn(`template ${type} for project ${project} doesn't exist`)
      return
    }

    const msg = template({
      username: user.level1.userName,
      ...activity,
      ...payload
    })

    log.debug(`send sms notification to user: ${user._id}, project: ${project}, type: ${type}`)

    await smsService.send({
      to: userPhone,
      msg
    })
  }

  preparePayload (payload) {
    return payload && JSON.parse(payload)
  }
}

module.exports = SmSNotificationService
