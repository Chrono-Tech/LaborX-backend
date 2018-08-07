const EventEmitter = require('events')
const WebSocketServer = require('websocket').server
const uniqid = require('uniqid')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'SocketServer'
})

class SocketServer extends EventEmitter {
  constructor (app) {
    super()
  }

  start (app) {
    this.wsServer = new WebSocketServer({
      httpServer: app.httpServer,
      fragmentOutgoingMessages: false
    })

    this._connections = {}

    this.wsServer.on('request', (request) => {
      const connection = request.accept(null, request.origin)
      connection.id = uniqid()

      this.handleOpen(connection)

      connection.on('close', () => {
        this.handleClose(connection)
      })

      connection.on('error', (e) => {
        this.handleError(connection, e)
      })

      // Handle incoming messages
      connection.on('message', (message) => {
        this.handleMessage(connection, message)
      })
    })
    log.info('successfully initialized')
  }

  send (connectionId, data) {
    setImmediate(() => {
      this._connections[connectionId].sendUTF(JSON.stringify(data))
    })
  }

  handleMessage (connection, message) {
    if (message.type === 'utf8') {
      try {
        const data = JSON.parse(message.utf8Data)
        if (!data.channel || !data.type) {
          throw new Error("Doesn't specified channel or type ")
        }

        this.emit(`message ${data.channel} ${data.type}`, connection, data)
      } catch (e) {
        log.debug(`bad message [${message.utf8Data}]. Cause: ${e.message}`)
      }
    }
  }

  handleOpen (connection) {
    this._connections[connection.id] = connection
  }

  handleError (connection, error) {
    this.handleClose(connection)
  }

  handleClose (connection) {
    // eslint-disable-next-line
    this.emit('close', connection.id)

    delete this._connections[connection.id]
  }

  shutdown () {
    this.wsServer.shutDown()
  }
}

module.exports = SocketServer
