const bunyan = require('bunyan')
const config = require('config')

const additionalOptions = config.log && config.log.options
const level = config.log && config.log.level
const streams = []

streams.push({
  stream: process.stdout,
  level
})

if (config.log && config.log.file) {
  streams.push({
    ...config.log.file,
    level
  })
}

function createLogger (options) {
  return bunyan.createLogger({
    ...options,
    ...additionalOptions,
    level,
    processName: process.env.name,
    streams
  })
}

module.exports = {
  createLogger
}
