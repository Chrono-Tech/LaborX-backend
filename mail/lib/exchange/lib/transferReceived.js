const config = require('config')

module.exports = ({
  username,
  baseURL = config.get('mail.baseURL'),
  tokenAddress,
  amount
}) => ({
  subject: 'Transfer received notification',
  content: `
    <html>
      <body>
        <p><b>Hello ${username || 'Dear Client'}!</b></p>
        <p>
          Notification about transfer received:<br/>
          tokenAddress: ${tokenAddress}<br/>
          amount: ${amount}<br/>
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
