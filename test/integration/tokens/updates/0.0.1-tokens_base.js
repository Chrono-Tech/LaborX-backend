const keystone = require('keystone')
const TokenModel = keystone.list('Token').model
const ImageModel = keystone.list('Image').model
const SecurityUserModel = keystone.list('SecurityUser').model
const SecurityToken = keystone.list('SecurityToken').model

const share = require('../../share')

module.exports = function (done) {
  create().then(done)
}

async function create () {
  const img = await ImageModel.create({
    name: 'testImage',
    image: {
      public_id: 'images/1',
      url: 'http://res.cloudinary.com/dhwnaptgk/image/upload/v1521737326/images/1.png',
      secure_url: 'https://res.cloudinary.com/dhwnaptgk/image/upload/v1521737326/images/1.png'
    }
  })

  const btc = await TokenModel.create({
    symbol: 'BTC',
    name: 'Bitcoin',
    address: '0x00000000000000000000000000000000000000a1',
    icon: img.image.secure_url,
    projectUrl: 'http://project.io',
    decimals: 18,
    isVerified: true
  })

  const user = await SecurityUserModel.create({
    name: 'user',
    email: 'test@test.com',
    password: 'qwerty'
  })

  const token = await SecurityToken.create({
    user: user._id
  })

  share.tokens = {
    btc: await btc.populate('icon')
  }
  share.img = img
  share.token = token
}
