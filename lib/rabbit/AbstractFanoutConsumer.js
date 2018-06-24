const debug = require('debug')('@laborx/profile.backend:FanoutConsumerFactory')

const EventEmitter = require('events')
const config = require('config')
const amqp = require('amqplib')

class FanoutConsumerFactory extends EventEmitter {
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
      const { queue } = await this._channel.assertQueue('', { exclusive: true })

      this._channel.consume(queue, async (msg) => {
        try {
          try {
            const json = JSON.parse(msg.content.toString())
            await this.handleMessage(json)
          } finally {
            await this._channel.ack(msg)
          }
        } catch (e) {
          debug(e)
        }
      }, { noAck: false })

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
    await this._connection.close()
    this.emit('shutdown')
    debug('stopped')
  }

  async handleMessage (data) {
    throw new Error('Not implemented')
  }
}

module.exports = FanoutConsumerFactory
