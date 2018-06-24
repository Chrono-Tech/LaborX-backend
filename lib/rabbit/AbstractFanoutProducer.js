const EventEmitter = require('events')
const config = require('config')
const debug = require('debug')('@laborx/profile.backend:AbstractFanoutProducer')
const amqp = require('amqplib')

class AbstractFanoutProducer extends EventEmitter {
  constructor ({ name }) {
    super()
    this.rabbitConfig = config.rabbit
    this.fanoutName = name
    this.isShutdown = true
  }

  async start () {
    this.isShutdown = false

    try {
      this._connection = await amqp.connect(this.rabbitConfig.url)
      this._channel = await this._connection.createChannel()

      await this._channel.assertExchange(this.fanoutName, 'fanout', { durable: false })

      this._connection.on('close', () => {
        if (!this.isShutdown) {
          setImmediate(() => {
            this.recover('Connection suddenly closed')
          })
        }
      })
    } catch (e) {
      this.recover(e.message)
      return
    }

    debug('successfully initialized')

    setImmediate(() => {
      this.emit('started')
    })
  }

  recover (cause) {
    debug(`Cannot connect to RabbitMQ. Cause: ${cause}`)
    setTimeout(() => {
      debug('Trying reconnect...')
      this.start()
    }, this.rabbitConfig.reconnectTimeout || 2000)
  }

  async shutdown () {
    if (this.isShutdown) {
      return
    }
    this.isShutdown = true

    this.emit('shutdown')

    await this._connection.close()

    debug('stopped')
  }

  async send (message) {
    this._channel.publish(
      this.fanoutName,
      '',
      Buffer.from(this.prepareMessage(message))
    )
  }

  async prepareMessage (message) {
    throw new Error('Not implemented')
  }
}

module.exports = AbstractFanoutProducer
