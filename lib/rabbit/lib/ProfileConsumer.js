const AbstractFanoutConsumer = require('../AbstractFanoutConsumer')

class ProfileConsumer extends AbstractFanoutConsumer {
  constructor () {
    super({
      exchangeName: 'profiles',
      prefetch: 1
    })
  }

  async handleMessage ({ id }) {
    const { profileChannelHandler } = requireRoot('lib/socket')

    profileChannelHandler.profileUpdated({ id })
  }
}

module.exports = ProfileConsumer
