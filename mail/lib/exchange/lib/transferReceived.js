const config = require('config')
const contentBuilder = require('./contentBuilder')

module.exports = ({
  username,
  baseURL = config.get('mail.baseURL'),
  frontUrl = config.get('frontend.url'),
  tokenAddress,
  amount
}) => ({
  subject: 'Transfer received notification',
  content: contentBuilder(username, frontUrl, `
    <html>
      <body>
        <p style="color: #333333;font-size: 20px;font-weight: 700;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;"><b>Hello ${username || 'Dear Client'}!</b></p>
        <p style="color: #333333;font-size: 14px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;">
          Notification about transfer received:<br/>
          tokenAddress: ${tokenAddress}<br/>
          amount: ${amount}<br/>
        </p>
        <p style="color: #333333;font-size: 14px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;">
          Thank you for using TimeX Exchange.
        </p>
        <p>
          <a href='${baseURL}' style="color: #786ab7;font-size: 14px;font-weight: 700;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-decoration-line: none;">TimeX Exchange</a>
        </p>
      </body>
    </html>
  `)
})
