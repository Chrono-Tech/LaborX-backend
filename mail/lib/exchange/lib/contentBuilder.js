module.exports = (username, frontUrl, content) =>
  `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" style="margin: 0; padding: 0; height: 100%;">

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>

    <body style="margin: 0; padding: 0; height: 100%;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" background="${frontUrl}/static/img/bg.jpg"
      bgcolor="#242045" style="background-repeat:no-repeat;background-position: center;background-size: 100% 100%;">
        <tr align="center" style="padding: 0; margin-left: 0;">
          <td align="center" style="padding: 0; margin-left: 0">
            <table border="0" cellpadding="0" cellspacing="0" width="1163" height="575" background="${frontUrl}/static/img/pointers-4.png" style="margin-top: -80px;">
              <tr align="center">
                <td align="center" height="100%">
                  <table border="0" cellpadding="0" cellspacing="0" width="440">
                    <tr>
                      <td height="50px">
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <img src="${frontUrl}/static/img/timex-logo.png" width="142px" height="50px"/>
                            </td>
                          </tr>  
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td height="40px">
                      </td>
                    </tr>
                    <tr>
                      <td height="auto" width="auto" bgcolor="#ffffff" style="padding-top: 30px; padding-bottom: 30px; padding-left: 30px; padding-right: 30px;">
                        ${content}
                      </td>
                    </tr>
                    <tr>
                      <td height="25px">
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="70%" align="left" style="color: #786ab7;font-size: 12px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                              ©2018 LaborX Pty Ltd. All Rights Reserved
                            </td>
                            <td width="70%" align="right">
                              <a href="${frontUrl}/private/user/profile" style="color: #786ab7;font-size: 12px;font-weight: 700;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-decoration-line: none;" onmouseover="this.style.color='#ffb54e';" onmouseout="this.style.color='#786ab7';">Notification Settings</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td height="100%">
          </td>
        </tr>
      </table>
    </body>

    </html>
  `
