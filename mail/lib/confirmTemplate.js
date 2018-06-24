module.exports = ({ username, baseURL, check }) => ({
  subject: 'Email Confirmation',
  content: `
    <html>
      <body>
        <p><b>Hello ${username || 'Dear Client'}!</b></p>
        <p>
          Please use this code to verify your email address: <b>${check}</b>
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
