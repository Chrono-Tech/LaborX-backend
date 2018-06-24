const { waitServiceStarted } = requireRoot('lib/helpers')

const ProfileFanoutProducer = require('./lib/ProfileFanoutProducer')
const ProfileFanoutConsumer = require('./lib/ProfileFanoutConsumer')

const profileFanoutProducer = new ProfileFanoutProducer()
const profileFanoutConsumer = new ProfileFanoutConsumer()

const availableInstances = []

module.exports = {

  async startListeners () {
    const availableInstances = [
      profileFanoutProducer,
      profileFanoutConsumer
    ]
    profileFanoutProducer.start()
    profileFanoutConsumer.start()

    return Promise.all(
      availableInstances.map(instance => waitServiceStarted(instance))
    )
  },

  async shutdownListeners () {
    return Promise.all(
      availableInstances.map(async instance => instance.shutdown())
    )
  },

  profileFanoutProducer,
  profileFanoutConsumer
}
