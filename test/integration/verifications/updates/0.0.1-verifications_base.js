const keystone = require('keystone')
const share = require('../../share')

const SecurityUserModel = keystone.list('SecurityUser').model
const SecurityToken = keystone.list('SecurityToken').model
const VerificationProfile = keystone.list('VerificationProfile').model
const File = keystone.list('File').model

module.exports = function (done) {
  create().then(done)
}

async function create () {
  const user = await SecurityUserModel.create({
    name: 'user',
    email: 'test@test.com',
    password: 'qwerty'
  })

  const token = await SecurityToken.create({
    user: user._id
  })

  const verificationProfile = await VerificationProfile.create({
    user: user._id
  })

  const file = await File.create({
    file: {
      filename: 'test.json',
      size: 111,
      mimetype: 'application/json',
      path: '/opt/data/files/'
    }
  })

  share.user = user
  share.token = token
  share.verificationProfile = verificationProfile
  share.file = file
}
