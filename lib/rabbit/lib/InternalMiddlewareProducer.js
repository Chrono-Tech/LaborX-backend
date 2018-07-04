const AbstractFanoutProducer = require('../AbstractFanoutProducer')

class InternalMiddlewareProducer extends AbstractFanoutProducer {
  constructor () {
    super({
      exchangeName: 'internal',
      id: 'main'
    })
    this.type = 'topic'
  }

  async prepareMessage (message) {
    return JSON.stringify(message)
  }

  async send (message, { persistent } = {}) {
    this._channel.publish(this.exchangeName, 'user.created', Buffer.from(await this.prepareMessage(message)),
      {
        persistent: persistent || this.persistent
      }
    )
  }
}

module.exports = InternalMiddlewareProducer
