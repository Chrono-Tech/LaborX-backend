const config = require('config')
const Twilio = require('twilio')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'SMSService'
})

class SMSService {
  constructor () {
    const { accountSid, authToken, from } = config.sms

    this.twilioClient = new Twilio(accountSid, authToken)
    this.from = from
  }

  async send ({ to, msg }) {
    try {
      log.debug(`Send from ${this.from} to ${to} message: '${msg}'`)
      await this.twilioClient.messages.create({
        from: this.from,
        body: msg,
        to
      })
    } catch (e) {
      log.error('Error:', e)
    }
  }
}

module.exports = SMSService
