const config = require('config')

module.exports = ({ username, baseURL = config.get('mail.baseURL') }) => ({
  subject: 'Signin notification',
  content: `
    <html>
      <body>
        <p><b>Hello ${username || 'Dear Client'}!</b></p>
        <p>
          Notification about signin
        </p>
        <p>
          Thank you for using TimeX Exchange.
        </p>
        <p>
          <a href='${baseURL}'>TimeX Exchange</a>
        </p>
      </body>
    </html>
  `
})
