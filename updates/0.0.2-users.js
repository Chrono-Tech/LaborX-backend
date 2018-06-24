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
  const user1 = await SecurityUser.model.create({ name: 'IPT Holder' })
  const user2 = await SecurityUser.model.create({ name: 'MKT Holder' })
  const user3 = await SecurityUser.model.create({ name: 'AKT Holder' })
  const user4 = await SecurityUser.model.create({ name: 'RLT Holder' })
  const user5 = await SecurityUser.model.create({ name: 'AVT Holder' })

  await SecurityToken.model.create({ user: user1._id })

  // 0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed
  await SecuritySignature.model.create({
    user: user1._id,
    type: 'ethereum-public-key',
    value: '0xb73f2c93d07b2712bafcf0b69fa08ae2b18b27953f6bb87ff29c7398e5308d5e0d02a0236c4c489b24e71e504c96b90805f37b399323d68e906316fbc09f5267'
  })

  // 0x623ec1e5096d5a682967e7994401173845763b44
  await SecuritySignature.model.create({
    user: user2._id,
    type: 'ethereum-public-key',
    value: '0xdbf035e3be8bdf94ad8b3b44de3ff5dd3f0587845c15bd37ca94c3844bb82f25fb035cfbadb9941ac3e9883163d4517e5201a29a4d4f50a1e6a7eadde0afa98f'
  })

  // 0x90892995479b0b96cea0bc332620d7464e0e6692
  await SecuritySignature.model.create({
    user: user3._id,
    type: 'ethereum-public-key',
    value: '0xdc802a564112ba85fd631553682063eb9788f80f4cdd65c6f47681bf218dc3d88f5c3dd1ff3a3c2c73b23077fb356d5d993a4b64d6537d59b7da957c91c300ac'
  })

  // 0x0bab5d88475978a4eaa6001bd8e7c1350afb3485
  await SecuritySignature.model.create({
    user: user4._id,
    type: 'ethereum-public-key',
    value: '0x15ab6e20d63c79e34fae84f4cbfef0f4016d696a394b0f1c510f2405d97ff8f4979c26051d14f78c8389d39534866f211e8c6c46b7493e53e2904b8a271f1b62'
  })

  // 0xa8e70519d5bc5b548d6fc490bf39c4288d1286c7
  await SecuritySignature.model.create({
    user: user5._id,
    type: 'ethereum-public-key',
    value: '0x8027885d6e21c40724819ffbf68eb0fb8a5d87ea186a31b34c8d036dcc1355a0a388473fd4c87a3521aeaf777ad760795a050bdc0359eb77d4df393c2b376bf6'
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
      state: 'Moscow Region',
      city: 'Moscow',
      zip: '101200',
      addressLine1: 'Komsomolskiy av. 117',
      addressLine2: 'Flat 123',
      attachments: [ user1Attachment1._id, user1Attachment2._id ]
    }
  })
}
