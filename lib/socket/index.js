const SocketServer = require('./lib/SocketServer')
const ProfileChannelHandler = require('./lib/ProfileChannelHandler')

const socketServer = new SocketServer()
const profileChannelHandler = new ProfileChannelHandler()

module.exports = {
  socketServer,
  profileChannelHandler,

  async startSocketServer (keystone) {
    await socketServer.start(keystone)

    socketServer
      .on('message profile subscribe', profileChannelHandler.subscribe.bind(profileChannelHandler))
      .on('message profile unsubscribe', profileChannelHandler.unsubscribe.bind(profileChannelHandler))

    profileChannelHandler
      .on('send message', socketServer.send.bind(socketServer))

    socketServer.on('close', (connection) => {
      profileChannelHandler.closeConnection.bind(profileChannelHandler)(connection)
    })
  },

  async shutdownSocketServer () {
    await socketServer.shutdown()
  }
}
