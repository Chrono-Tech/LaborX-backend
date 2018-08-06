const config = require('config')
const { promisify } = require('util')
const mailConfig = config.get('mail')
const keystone = require('keystone')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'mail:message'
})

class Message {
  constructor ({ to, subject, html, from = mailConfig.from }) {
    this.from = from
    this.to = to
    this.subject = subject
    this.html = html
  }

  async send () {
    try {
      log.debug(`Send from ${this.from} to ${this.to} message with subject: '${this.subject}'`)
      const transport = keystone.get('mail transport')
      return await promisify(transport.sendMail.bind(transport))({
        from: this.from,
        to: this.to,
        subject: this.subject,
        html: this.html
      })
    } catch (e) {
      log.error('Error:', e)
    }
  }
}

module.exports = Message
