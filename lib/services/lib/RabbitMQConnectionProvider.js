const debug = require('debug')('@laborx/profile.backend:RabbitMQConnectionProvider')

const EventEmitter = require('events')
const config = require('config')
const amqp = require('amqplib')

class RabbitMQConnectionProvider extends EventEmitter {
  constructor () {
    super()
    this.rabbitConfig = config.rabbit
  }

  async start () {
    this.isShutdown = false

    try {
      this._connection = await amqp.connect(this.rabbitConfig.url)

      this._connection.on('close', () => {
        if (!this.isShutdown) {
          setImmediate(() => {
            this.recover('Connection suddenly closed')
          })
        }
      })

      setImmediate(() => {
        this.emit('connect', this._connection)
      })
    } catch (e) {
      this.recover(e.message)
      return
    }

    debug('successfully initialized')
  }

  recover (cause) {
    debug(`Cannot connect to RabbitMQ. Cause: ${cause}`)
    setTimeout(() => {
      debug('Trying reconnect...')
      this.start()
    }, this.rabbitConfig.reconnectTimeout || 2000)
  }

  async shutdown () {
    this.isShutdown = true

    this.emit('shutdown')

    await this._connection.close()

    debug('stopped')
  }
}

module.exports = RabbitMQConnectionProvider
