const EventEmitter = require('events')
const config = require('config')
const amqp = require('amqplib')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'FanoutConsumer'
})

class AbstractFanoutConsumer extends EventEmitter {
  constructor ({
    exchangeName,
    prefetch
  }) {
    if (new.target === AbstractFanoutConsumer) {
      throw new TypeError('Cannot construct AbstractFanoutConsumer instances directly')
    }
    super()
    this.rabbitConfig = config.rabbit

    this.exchangeName = exchangeName
    this.prefetch = prefetch

    this.type = 'fanout'
    this.durable = true
    this.noAck = false

    this.log = log.child({ exchange: this.exchangeName })
    this.isShutdown = true
  }

  async start () {
    this.isShutdown = false

    try {
      this._connection = await amqp.connect(this.rabbitConfig.url)
      this._channel = await this._connection.createChannel()

      await this._channel.assertExchange(this.exchangeName, this.type, { durable: this.durable })

      const { queue } = await this._channel.assertQueue(`${this.exchangeName}-consumer`, { durable: this.durable })

      await this._channel.bindQueue(queue, this.exchangeName, this.routeKey)

      if (this.prefetch) {
        this._channel.prefetch(this.prefetch)
      }

      this._channel.consume(queue, async (msg) => {
        try {
          const json = JSON.parse(msg.content.toString())
          await this.handleMessage(json)
        } catch (e) {
          this.log.debug(`Error while processing message. Cause: ${e}`)
        } finally {
          await this._channel.ack(msg)
        }
      }, { noAck: this.noAck })

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

    this.log.info('successfully initialized')

    setImmediate(() => {
      this.emit('started')
    })
  }

  recover (cause) {
    this.log.warn(`Cannot connect to RabbitMQ. Cause: ${cause}`)
    setTimeout(() => {
      this.log.warn('Trying reconnect...')
      this.start()
    }, this.rabbitConfig.reconnectTimeout || 2000)
  }

  async shutdown () {
    if (this.isShutdown) {
      return
    }
    this.isShutdown = true
    await this._connection.close()
    this.log.info('stopped')
    this.emit('shutdown')
  }

  async handleMessage (data) {
    throw new Error('Not implemented')
  }
}

module.exports = AbstractFanoutConsumer
