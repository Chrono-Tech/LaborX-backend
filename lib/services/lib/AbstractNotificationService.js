const EventEmitter = require('events')
const config = require('config')

class AbstractNotificationService extends EventEmitter {
  constructor (log, channelOptions, queueOptions) {
    super()
    this.log = log
    this.channelOptions = channelOptions
    this.queueOptions = queueOptions
    this.isShutdown = true
  }

  async start (connection) {
    this._connection = connection
    this.rabbitConfig = config.rabbit
    this.isShutdown = false

    await this.init()
    this.initialized = true
    this.log.info('successfully initialized')
    setImmediate(() => {
      this.emit('started')
    })
  }

  async init () {
    try {
      this._channel = await this._connection.createChannel()

      await this._channel.assertExchange(this.channelOptions.exchangeName,
        this.channelOptions.exchangeType,
        this.channelOptions.exchangeOptions)

      const q = await this._channel.assertQueue('', this.queueOptions)
      await this._channel.bindQueue(q.queue, this.channelOptions.exchangeName, '')

      await this._channel.consume(q.queue, (msg) => {
        const content = JSON.parse(msg.content)

        this.handleMessage(content)
      }, { noAck: true })
    } catch (e) {
      this.recover(e.message)
    }
  }

  recover (cause) {
    this.log.warn(`Error about channel. Cause: ${cause}`)
    setTimeout(() => {
      this.log.warn('Trying recreate channel...')
      this.init()
    }, this.rabbitConfig + 5000 || 5000)
  }

  async shutdown () {
    this.isShutdown = true
    this.log.info('stopped')
  }

  send (message = {}) {
    if (this.isShutdown || !this.initialized) {
      return
    }

    this._channel.publish(this.channelOptions.exchangeName, '', Buffer.from(JSON.stringify(message)))
  }

  async handleMessage (msg) {
    // nothing in abstract
  }
}

module.exports = AbstractNotificationService
