const EventEmitter = require('events')
const config = require('config')
const debug = require('debug')
const amqp = require('amqplib')
const uniqid = require('uniqid')

class AbstractFanoutProducer extends EventEmitter {
  constructor ({
    exchangeName,

    id = uniqid(),
    persistent = true
  }) {
    if (new.target === AbstractFanoutProducer) {
      throw new TypeError('Cannot construct AbstractFanoutProducer instances directly')
    }
    super()
    this.id = id
    this.rabbitConfig = config.rabbit

    this.exchangeName = exchangeName
    this.persistent = persistent
    this.type = 'fanout'
    this.durable = true

    this._debug = debug(`@laborx/profile.backend:${this.exchangeName}:producer:${id}`)

    this.isShutdown = true
  }

  async start () {
    this.isShutdown = false

    try {
      this._connection = await amqp.connect(this.rabbitConfig.url)
      this._channel = await this._connection.createChannel()

      await this._channel.assertExchange(this.exchangeName, this.type, { durable: this.durable })

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

    this._debug('successfully initialized')

    setImmediate(() => {
      this.emit('started')
    })
  }

  recover (cause) {
    this._debug(`Cannot connect to RabbitMQ. Cause: ${cause}`)
    setTimeout(() => {
      this._debug('Trying reconnect...')
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

    this._debug('stopped')
  }

  async send (message, { persistent, routingKey } = {}) {
    this._channel.publish(this.exchangeName, routingKey || '', Buffer.from(await this.prepareMessage(message)),
      {
        persistent: persistent || this.persistent
      }
    )
  }

  async prepareMessage (message) {
    throw new Error('Not implemented')
  }
}

module.exports = AbstractFanoutProducer
