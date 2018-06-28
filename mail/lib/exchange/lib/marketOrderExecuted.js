const config = require('config')

module.exports = ({
  username,
  baseURL = config.get('mail.baseURL'),
  takerTokenAddress,
  takerTokenAmount,
  makerTokenAddress,
  makerTokenAmount
}) => ({
  subject: 'Market order executed notification',
  content: `
    <html>
      <body>
        <p><b>Hello ${username || 'Dear Client'}!</b></p>
        <p>
          Notification about market order executed:<br/>
          ${takerTokenAddress}: ${takerTokenAmount}<br/>
          ${makerTokenAddress}: ${makerTokenAmount}<br/>
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
