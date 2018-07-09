const { waitServiceStarted } = requireRoot('lib/helpers')

const ProfileProducer = require('./lib/ProfileProducer')
const ProfileConsumer = require('./lib/ProfileConsumer')
const ActivityLogConsumer = require('./lib/ActivityLogConsumer')
const ActivityLogProducer = require('./lib/ActivityLogProducer')
const InternalMiddlewareProducer = require('./lib/InternalMiddlewareProducer')

const profileProducer = new ProfileProducer()
const profileConsumer = new ProfileConsumer()
const activityLogConsumer = new ActivityLogConsumer()
const activityLogProducer = new ActivityLogProducer()
const internalMiddlewareProducer = new InternalMiddlewareProducer();

const availableInstances = []

module.exports = {
  async startListeners () {
    const availableInstances = [
      profileProducer,
      profileConsumer,
      activityLogConsumer,
      activityLogProducer,
      internalMiddlewareProducer
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
  activityLogProducer,

  profileProducer,
  profileConsumer,
  internalMiddlewareProducer
}
