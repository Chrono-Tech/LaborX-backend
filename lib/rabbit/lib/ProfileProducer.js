const AbstractFanoutProducer = require('../AbstractFanoutProducer')

class ProfileProducer extends AbstractFanoutProducer {
  constructor () {
    super({
      exchangeName: 'profiles',
      id: 'main'
    })
  }

  async prepareMessage (message) {
    return JSON.stringify(message)
  }
}

module.exports = ProfileProducer
