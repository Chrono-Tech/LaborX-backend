function extractActivityLogInfo (expressRequest) {
  const ip = expressRequest.headers['x-forwarded-for'] || expressRequest.connection.remoteAddress
  const { browser, version, os } = expressRequest.useragent
  const device = `${browser} (${version}, ${os})`

  return {
    ip,
    device
  }
}

module.exports = {
  extractActivityLogInfo
}
