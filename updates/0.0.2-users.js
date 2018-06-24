const keystone = require('keystone')
const { uploadCloundinaryImage, uploadKeystoneFile } = requireRoot('lib/utils')
const SecurityUser = keystone.list('SecurityUser')
const SecuritySignature = keystone.list('SecuritySignature')
const SecurityToken = keystone.list('SecurityToken')
const VerificationRequest = keystone.list('VerificationRequest')
const File = keystone.list('File')
const Image = keystone.list('Image')

module.exports = function (done) {
  create().then(done)
}

async function create () {
  const user1 = await SecurityUser.model.create({ name: 'IP' })
  const user2 = await SecurityUser.model.create({ name: 'MK' })
  const user3 = await SecurityUser.model.create({ name: 'AK' })
  const user4 = await SecurityUser.model.create({ name: 'RL' })
  const user5 = await SecurityUser.model.create({ name: 'AV' })

  await SecurityToken.model.create({ user: user1._id })

  await SecuritySignature.model.create({
    user: user1._id,
    type: 'ethereum-address',
    value: '0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed'
  })

  await SecuritySignature.model.create({
    user: user2._id,
    type: 'ethereum-address',
    value: '0x623ec1e5096d5a682967e7994401173845763b44'
  })

  await SecuritySignature.model.create({
    user: user3._id,
    type: 'ethereum-address',
    value: '0x90892995479b0b96cea0bc332620d7464e0e6692'
  })

  await SecuritySignature.model.create({
    user: user4._id,
    type: 'ethereum-address',
    value: '0x0bab5d88475978a4eaa6001bd8e7c1350afb3485'
  })

  await SecuritySignature.model.create({
    user: user5._id,
    type: 'ethereum-address',
    value: '0xa8e70519d5bc5b548d6fc490bf39c4288d1286c7'
  })

  const user1Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user1.png')
    )
  })

  const user1Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.2-users/RussianPassport-0.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const user1Attachment2 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.2-users/RussianPassport-1.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  await VerificationRequest.model.create({
    user: user1._id,
    level: 'level-1',
    level1: {
      userName: 'Igor Pavlenko',
      birthDate: '1985-10-07',
      avatar: user1Avatar._id
    }
  })

  await VerificationRequest.model.create({
    user: user1._id,
    level: 'level-2',
    level2: {
      email: 'i.pavlenko@ntr1x.com',
      phone: '+7 (963) 089 3483'
    }
  })

  await VerificationRequest.model.create({
    user: user1._id,
    level: 'level-3',
    level3: {
      passport: '7505 612345',
      expirationDate: '2030-11-08',
      attachments: [ user1Attachment1._id, user1Attachment2._id ]
    }
  })

  await VerificationRequest.model.create({
    user: user1._id,
    level: 'level-4',
    level4: {
      country: 'Russia',
      state: 'Chelyabinsk Region',
      city: 'Chelyabinsk',
      zip: '454021',
      addressLine1: 'Komsomolskiy av. 57',
      addressLine2: 'Flat 55',
      attachments: [ user1Attachment1._id, user1Attachment2._id ]
    }
  })
}
