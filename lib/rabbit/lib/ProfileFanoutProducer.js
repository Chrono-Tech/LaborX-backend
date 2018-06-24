const AbstractFanoutProducer = require('../AbstractFanoutProducer')

class ProfileFanoutProducer extends AbstractFanoutProducer {
  constructor () {
    super({
      name: 'profiles'
    })
  }

  async prepareMessage (message) {
    return JSON.stringify(message)
  }
}

module.exports = ProfileFanoutProducer
