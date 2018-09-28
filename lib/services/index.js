const SecurityService = require('./lib/SecurityService')
const UserService = require('./lib/UserService')
const FileService = require('./lib/FileService')
const ImageService = require('./lib/ImageService')
const ActivityLogService = require('./lib/ActivityLogService')
const ActivityNotificationService = require('./lib/ActivityNotificationService')
const SmSNotificationService = require('./lib/SmSNotificationService')
const EmailNotificationService = require('./lib/EmailNotificationService')

const securityService = new SecurityService()
const userService = new UserService()
const fileService = new FileService()
const imageService = new ImageService()
const activityLogService = new ActivityLogService()
const activityNotificationService = new ActivityNotificationService()
const emailNotificationService = new EmailNotificationService()
const smsNotificationService = new SmSNotificationService()

module.exports = {
  securityService,
  userService,
  fileService,
  imageService,
  activityLogService,
  activityNotificationService,

  async startServices (keystone) {
    activityNotificationService
      .on('sms', activityLog => smsNotificationService.notify(activityLog))
      .on('email', activityLog => emailNotificationService.notify(activityLog))
  },
  async shutdownServices () {
  }
}
