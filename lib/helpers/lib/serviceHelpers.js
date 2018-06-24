function waitServiceStarted (service) {
  return new Promise(function (resolve, reject) {
    service.on('started', resolve)
  })
}

module.exports = {
  waitServiceStarted
}
