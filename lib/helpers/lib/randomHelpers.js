const crypto = require('crypto')
const { promisify } = require('util')

async function hexMd5OfRandomBytes (bytesCount) {
  const randomBytes = await promisify(crypto.randomBytes)(bytesCount)
  return crypto.createHash('md5').update(randomBytes).digest('hex')
}

module.exports = {
  hexMd5OfRandomBytes
}
