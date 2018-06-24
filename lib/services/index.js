const SecurityService = require('./lib/SecurityService')
const UserService = require('./lib/UserService')
const FileService = require('./lib/FileService')
const ImageService = require('./lib/ImageService')

const securityService = new SecurityService()
const userService = new UserService()
const fileService = new FileService()
const imageService = new ImageService()

module.exports = {
  securityService,
  userService,
  fileService,
  imageService,

  async startServices (keystone) {
    // const {
    //   tokensChannelHandler,
    //   depositChannelHandler
    // } = requireRoot('lib/socket')
    //
    // await rabbitMQConnectionProvider.start()
    //
    // rabbitMQConnectionProvider
    //   .on('connect', connection => {
    //     // TODO @ipavlenko: Start service communication here
    //   })
    //   .on('shutdown', () => {
    //     // TODO @ipavlenko: Stop service communication here
    //   })
    //
    // return Promise.all([
    //   waitServiceStarted(tokenNotificationService)
    // ])
  },
  async shutdownServices () {
    // TODO @ipavlenko: Shutdown services here
  }
}

// function waitServiceStarted (service) {
//   return new Promise(function (resolve, reject) {
//     service.on('started', resolve)
//   })
// }
