const AbstractFanoutConsumer = require('../AbstractFanoutConsumer')

class ProfileFanoutConsumer extends AbstractFanoutConsumer {
  constructor () {
    super({
      name: 'profiles'
    })
  }

  async handleMessage (data) {
    console.log('Message handled', data)
  }
}

module.exports = ProfileFanoutConsumer
