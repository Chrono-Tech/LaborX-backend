const keystone = require('keystone')
const SecurityUserModel = keystone.list('SecurityUser').model
const SecurityTokenModel = keystone.list('SecurityToken').model

const share = require('../../share')

module.exports = function (done) {
  create().then(done)
}

async function create () {
  const user = await SecurityUserModel.create({
    phone: '+71234567890',
    email: 'example@example.com',
    password: 'password'
  })

  const token = await SecurityTokenModel.create({
    user: user._id
  })

  share.user = user
  share.token = token
}
