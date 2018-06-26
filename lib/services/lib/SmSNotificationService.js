const EventEmitter = require('events')

class SmSNotificationService extends EventEmitter {
  async notify (activityLog) {
    // TODO @mdkardaev: send sms
  }
}

module.exports = SmSNotificationService
