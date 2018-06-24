const EventEmitter = require('events')
const config = require('config')

class AbstractNotificationService extends EventEmitter {
  constructor (debug, channelOptions, queueOptions) {
    super()
    this.debug = debug
    this.isDebugMsg = true
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
    this.debug('successfully initialized')
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

        if (this.isDebugMsg) {
          this.debug('Received message:')
          this.debug('--------------------')
          this.debug(content)
          this.debug('--------------------')
        }

        this.handleMessage(content)
      }, { noAck: true })
    } catch (e) {
      this.recover(e.message)
    }
  }

  recover (cause) {
    this.debug(`Error about channel. Cause: ${cause}`)
    setTimeout(() => {
      this.debug('Trying recreate channel...')
      this.init()
    }, this.rabbitConfig + 5000 || 5000)
  }

  async shutdown () {
    this.isShutdown = true
    this.debug('stopped')
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
