const ProfileProducer = require('./ProfileProducer')

class InternalMiddlewareProducer extends ProfileProducer {

  async send (message, { persistent } = {}) {
    this._channel.publish(this.exchangeName, 'address.created', Buffer.from(await this.prepareMessage(message)),
      {
        persistent: persistent || this.persistent
      }
    )
  }
}

module.exports = InternalMiddlewareProducer
