const AbstractFanoutProducer = require('../AbstractFanoutProducer')

class ActivityLogProducer extends AbstractFanoutProducer {
  constructor () {
    super({
      exchangeName: 'activity-log',
      id: 'main'
    })
  }

  async prepareMessage (message) {
    return JSON.stringify(message)
  }
}

module.exports = ActivityLogProducer
