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
  const user6 = await SecurityUser.model.create({ name: 'IFT Holder' })
  const user7 = await SecurityUser.model.create({ name: 'BTT Holder' })
  const user8 = await SecurityUser.model.create({ name: 'SLT Holder' })

  await SecurityToken.model.create({ user: user1._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user2._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user3._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user4._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user5._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user6._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user7._id, purpose: 'exchange' })
  await SecurityToken.model.create({ user: user8._id, purpose: 'exchange' })

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

  // 0x2943ad6701ee8c0d1fa307ac17f8c475da2d39f3
  await SecuritySignature.model.create({
    user: user6._id,
    type: 'ethereum-public-key',
    value: '0xa04bd48b8ae6c1b525a11070f3e8a083d12684ebcefc93f550cfe1c953228ed0e8681ccef919aac61f02e770e0c8d5686016337f017f762c617a583f82b39c9a'
  })

  // 0x34082bb749d5a09a9d81d0974d57c9052245cb70
  await SecuritySignature.model.create({
    user: user7._id,
    type: 'ethereum-public-key',
    value: '0x35b5ac726df32bcdae4a09bfa297f81ffa516b8b238167d7458b7fe7a9e5c875b9da8e3e01faa5eaab4ead321c5e0b266180e3690d9165e925ec8bc7f63e0cfc'
  })

  // 0x0139b2e340e14c85ab1bd008a0e877592f997f0a
  await SecuritySignature.model.create({
    user: user8._id,
    type: 'ethereum-public-key',
    value: '0x6888b4d3afaff50ccc916d77001136c01f947d41357cd88f4fe502807eea40d36abdcac2a4ae91a1f5a318b5c2d84c327b22283336a4aaec8e023e3917204d27'
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

  const user2Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user2.png')
    )
  })

  await VerificationRequest.model.create({
    user: user2._id,
    level: 'level-1',
    level1: {
      userName: 'Mikhail Kardaev',
      birthDate: '1986-11-15',
      avatar: user2Avatar._id
    }
  })

  const user3Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user3.png')
    )
  })

  await VerificationRequest.model.create({
    user: user3._id,
    level: 'level-1',
    level1: {
      userName: 'Anna Karpova',
      birthDate: '1993-06-15',
      avatar: user3Avatar._id
    }
  })

  const user4Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user4.png')
    )
  })

  await VerificationRequest.model.create({
    user: user4._id,
    level: 'level-1',
    level1: {
      userName: 'Roman Loktev',
      birthDate: '1993-06-15',
      avatar: user4Avatar._id
    }
  })

  const user5Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user5.png')
    )
  })

  await VerificationRequest.model.create({
    user: user5._id,
    level: 'level-1',
    level1: {
      userName: 'Artem Valyakin',
      birthDate: '1991-03-30',
      avatar: user5Avatar._id
    }
  })

  const user6Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user6.png')
    )
  })

  await VerificationRequest.model.create({
    user: user6._id,
    level: 'level-1',
    level1: {
      userName: 'Igor Fomin',
      birthDate: '1991-05-23',
      avatar: user6Avatar._id
    }
  })

  const user7Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user7.png')
    )
  })

  await VerificationRequest.model.create({
    user: user7._id,
    level: 'level-1',
    level1: {
      userName: 'Boris Tarelkin',
      birthDate: '1991-08-12',
      avatar: user7Avatar._id
    }
  })

  const user8Avatar = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.2-users/user8.png')
    )
  })

  await VerificationRequest.model.create({
    user: user8._id,
    level: 'level-1',
    level1: {
      userName: 'Steve Leskiv',
      birthDate: '1991-03-20',
      avatar: user8Avatar._id
    }
  })
}
