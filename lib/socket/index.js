const SocketServer = require('./lib/SocketServer')
const ProfilesChannelHandler = require('./lib/ProfilesChannelHandler')

const socketServer = new SocketServer()
const profilesChannelHandler = new ProfilesChannelHandler()

module.exports = {
  socketServer,
  profilesChannelHandler,

  async startSocketServer (keystone) {
    await socketServer.start(keystone)

    socketServer
      .on('message profiles subscribe', profilesChannelHandler.subscribe.bind(profilesChannelHandler))
      .on('message profiles unsubscribe', profilesChannelHandler.subscribe.bind(profilesChannelHandler))

    profilesChannelHandler
      .on('send message', socketServer.send.bind(socketServer))

    socketServer.on('close', (connection) => {
      profilesChannelHandler.closeConnection.bind(profilesChannelHandler)(connection)
    })
  },

  async shutdownSocketServer () {
    if (!process.env.REST) {
      return
    }
    await socketServer.shutdown()
  }
}
