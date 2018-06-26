const { waitServiceStarted } = requireRoot('lib/helpers')

// const ProfileFanoutProducer = require('./lib/ProfileFanoutProducer')
// const ProfileFanoutConsumer = require('./lib/ProfileFanoutConsumer')
const ActivityLogConsumer = require('./lib/ActivityLogConsumer')
const ActivityLogProducer = require('./lib/ActivityLogProducer')

// const profileFanoutProducer = new ProfileFanoutProducer()
// const profileFanoutConsumer = new ProfileFanoutConsumer()
const activityLogConsumer = new ActivityLogConsumer()
const activityLogProducer = new ActivityLogProducer()

const availableInstances = []

module.exports = {
  async startListeners () {
    const availableInstances = [
      // profileFanoutProducer,
      // profileFanoutConsumer
      activityLogConsumer,
      activityLogProducer
    ]

    availableInstances.forEach(instance => instance.start())

    return Promise.all(
      availableInstances.map(instance => waitServiceStarted(instance))
    )
  },

  async shutdownListeners () {
    return Promise.all(
      availableInstances.map(async instance => instance.shutdown())
    )
  },

  activityLogConsumer,
  activityLogProducer
  // profileFanoutProducer,
  // profileFanoutConsumer
}
