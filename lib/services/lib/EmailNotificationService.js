const debug = require('debug')('@laborx/profile.backend:EmailNotificationService')
const keystone = require('keystone')
const EventEmitter = require('events')
const templates = requireRoot('mail')
const { Message } = requireRoot('lib/mail')

const SecurityUserModel = keystone.list('SecurityUser').model

class EmailNotificationService extends EventEmitter {
  async notify (activity) {
    const user = await SecurityUserModel.findOne({
      _id: activity.user
    })

    if (!user.level2.email) {
      return
    }

    const { project, type } = activity
    const payload = this.preparePayload(activity.payload)

    const template = templates[project][type]

    if (!template) {
      debug(`template ${type} for project ${project} doesn't exist`)
      return
    }

    const { subject, content } = template({
      username: user.level1.userName,
      ...activity,
      ...payload
    })

    const message = new Message({
      to: user.level2.email,
      subject,
      html: content
    })

    debug(`send email notification to user: ${user._id}, project: ${project}, type: ${type}`)

    await message.send()
  }

  preparePayload (payload) {
    return payload && JSON.parse(payload)
  }
}

module.exports = EmailNotificationService
