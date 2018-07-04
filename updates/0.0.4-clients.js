const keystone = require('keystone')
const { uploadCloundinaryImage, uploadKeystoneFile } = requireRoot('lib/utils')

const Currency = keystone.list('Currency')
const ServiceCategory = keystone.list('ServiceCategory')
const ClientProfile = keystone.list('ClientProfile')
const CollaboratorProfile = keystone.list('CollaboratorProfile')
const RecruiterProfile = keystone.list('RecruiterProfile')
const RecruiterService = keystone.list('RecruiterService')
const RecruiterSocial = keystone.list('RecruiterSocial')
const WorkerProfile = keystone.list('WorkerProfile')
const WorkerSocial = keystone.list('WorkerSocial')
const WorkerService = keystone.list('WorkerService')
const WorkerEmployment = keystone.list('WorkerEmployment')
const VerificationWorkerRequest = keystone.list('VerificationWorkerRequest')
const VerificationRecruiterRequest = keystone.list('VerificationRecruiterRequest')
const VerificationClientRequest = keystone.list('VerificationClientRequest')
const SecurityUser = keystone.list('SecurityUser')
const File = keystone.list('File')
const Image = keystone.list('Image')

module.exports = function (done) {
  create().then(done)
}

async function create () {
  const btc = await Currency.model.findOne({ symbol: 'BTC' })
  const eth = await Currency.model.findOne({ symbol: 'ETH' })

  const softwareDevelopment = await ServiceCategory.model.findOne({ code: 8 })

  const user1 = await SecurityUser.model.findOne({ name: 'IPT Holder' })
  const user2 = await SecurityUser.model.findOne({ name: 'MKT Holder' })
  const user3 = await SecurityUser.model.findOne({ name: 'AKT Holder' })
  const user4 = await SecurityUser.model.findOne({ name: 'RLT Holder' })
  const user5 = await SecurityUser.model.findOne({ name: 'AVT Holder' })
  const user6 = await SecurityUser.model.findOne({ name: 'IFT Holder' })
  const user7 = await SecurityUser.model.findOne({ name: 'BTT Holder' })
  const user8 = await SecurityUser.model.findOne({ name: 'SLT Holder' })

  const client1PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/orange.png')
    )
  })

  const client1Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.4-clients/letter.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const client1Specialization1 = await ServiceCategory.model.findOne({ code: 8 })
  const client1Specialization2 = await ServiceCategory.model.findOne({ code: 7 })

  const client1 = await ClientProfile.model.create({
    user: user1._id,
    verifiable: {
      name: 'NTR',
      intro: 'Software development',
      type: 'organization',
      website: 'http://ntr1x.com',
      email: 'team@ntr1x.com',
      pageBackground: client1PageBackground,
      attachments: [ client1Attachment1._id ]
    },
    regular: {
      specializations: [ client1Specialization1._id, client1Specialization2._id ]
    }
  })

  await CollaboratorProfile.model.create({
    position: 'CEO',
    user: user1._id,
    client: client1._id,
    hasApproveFromCollaborator: true,
    hasApproveFromClient: true
  })

  await CollaboratorProfile.model.create({
    position: 'Software Developer',
    user: user2._id,
    client: client1._id,
    hasApproveFromCollaborator: true,
    hasApproveFromClient: true
  })

  await CollaboratorProfile.model.create({
    position: 'Software Developer',
    user: user5._id,
    client: client1._id,
    hasApproveFromCollaborator: false,
    hasApproveFromClient: true
  })

  const worker3PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/pink.png')
    )
  })

  const worker3Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.4-clients/diploma.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const worker3 = await WorkerProfile.model.create({
    user: user3._id,
    regular: {
      hourlyCharge: '120',
      currencies: [btc._id]
    },
    verifiable: {
      intro: 'JavaScript Developer, Frontend Developer',
      pageBackground: worker3PageBackground,
      attachments: [ worker3Attachment1._id ]
    },
    custom: {
      schedule: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true
      }
    }
  })

  const worker4PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/green.png')
    )
  })

  const worker4 = await WorkerProfile.model.create({
    user: user4._id,
    regular: {
      hourlyCharge: '100',
      currencies: [btc._id, eth._id]
    },
    verifiable: {
      intro: 'JavaScript Developer (both Frontend & Backend)',
      pageBackground: worker4PageBackground
    },
    custom: {
      schedule: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true
      }
    }
  })

  await WorkerService.model.create({
    name: 'Software development',
    category: softwareDevelopment._id,
    worker: worker3._id,
    description: 'Web application development using Vue.js',
    minFee: '100'
  })

  await WorkerService.model.create({
    name: 'Software development',
    category: softwareDevelopment._id,
    worker: worker4._id,
    description: 'Web application development using Vue.js',
    minFee: '120'
  })

  await WorkerService.model.create({
    name: 'Software development',
    category: softwareDevelopment._id,
    worker: worker4._id,
    description: 'Backend development in JavaScript',
    minFee: '120'
  })

  await WorkerSocial.model.create({
    name: 'facebook',
    worker: worker3._id,
    url: 'https://www.facebook.com/annakendrick47/'
  })

  await WorkerSocial.model.create({
    name: 'facebook',
    worker: worker4._id,
    url: 'https://www.facebook.com/romanjosiofficial/'
  })

  const recruiter5PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/orange.png')
    )
  })

  const recruiter5Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.4-clients/diploma.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const recruiter5 = await RecruiterProfile.model.create({
    user: user5._id,
    verifiable: {
      intro: 'I will find you a great software developer',
      pageBackground: recruiter5PageBackground,
      attachments: [ recruiter5Attachment1._id ]
    },
    custom: {
      showPackagesOnFirstJobBoard: true
    }
  })

  await RecruiterService.model.create({
    name: 'Hiring',
    recruiter: recruiter5._id,
    description: 'Hiring staff for your business',
    fee: '120'
  })

  await RecruiterService.model.create({
    name: 'Training',
    recruiter: recruiter5._id,
    description: 'Training your employments',
    fee: '150'
  })

  await RecruiterSocial.model.create({
    name: 'facebook',
    recruiter: recruiter5._id,
    url: 'https://www.facebook.com/romanjosiofficial/'
  })

  const worker3Request = await VerificationWorkerRequest.model.create({
    user: user3._id,
    status: 'created',
    regular: {
      hourlyCharge: '200',
      currencies: [btc._id, eth._id]
    },
    verifiable: {
      intro: 'JavaScript Developer, Frontend Developer',
      pageBackground: worker3PageBackground,
      attachments: [ worker3Attachment1._id ]
    },
    custom: {
      schedule: {
        mon: true,
        tue: true,
        wed: true,
        thu: true
      }
    }
  })

  await WorkerSocial.model.create({
    name: 'facebook',
    request: worker3Request._id,
    url: 'https://www.facebook.com/annakendrick47/'
  })

  await WorkerEmployment.model.create({
    organization: 'NTR',
    since: new Date('2016-09-01'),
    until: new Date('2017-09-01'),
    request: worker3Request._id,
    responsibilities: 'Web application development'
  })

  await WorkerService.model.create({
    name: 'Software development',
    category: softwareDevelopment._id,
    request: worker3Request._id,
    description: 'Web application development using Vue.js',
    minFee: '150'
  })

  const recruiter5Request = await VerificationRecruiterRequest.model.create({
    user: user5._id,
    status: 'created',
    verifiable: {
      intro: 'I will find you a great software developer',
      pageBackground: recruiter5PageBackground,
      attachments: [ recruiter5Attachment1._id ]
    },
    custom: {
      showPackagesOnFirstJobBoard: false
    }
  })

  await RecruiterService.model.create({
    name: 'Hiring',
    request: recruiter5Request._id,
    description: 'Hiring staff for your business',
    fee: '220'
  })

  await RecruiterService.model.create({
    name: 'Training',
    request: recruiter5Request._id,
    description: 'Training your employments',
    fee: '200'
  })

  await RecruiterSocial.model.create({
    name: 'facebook',
    request: recruiter5Request._id,
    url: 'https://www.facebook.com/romanjosiofficial/'
  })

  const worker6PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/green.png')
    )
  })

  const worker6Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.4-clients/diploma.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const worker6Request = await VerificationWorkerRequest.model.create({
    user: user6._id,
    status: 'created',
    regular: {
      hourlyCharge: '200',
      currencies: [btc._id, eth._id]
    },
    verifiable: {
      intro: 'JavaScript Developer, Frontend Developer',
      pageBackground: worker6PageBackground,
      attachments: [ worker6Attachment1._id ]
    },
    custom: {
      schedule: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
      }
    }
  })

  await WorkerSocial.model.create({
    name: 'facebook',
    request: worker6Request._id,
    url: 'https://www.facebook.com/Igor-Akinfeev-123117007761654/'
  })

  await WorkerEmployment.model.create({
    organization: 'Rusoft',
    since: new Date('2016-01-15'),
    until: new Date('2017-06-15'),
    request: worker6Request._id,
    responsibilities: 'Web application development'
  })

  await WorkerService.model.create({
    name: 'Software development',
    category: softwareDevelopment._id,
    request: worker6Request._id,
    description: 'Web application development using Vue.js',
    minFee: '170'
  })

  const recruiter7PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/green.png')
    )
  })

  const recruiter7Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.4-clients/diploma.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const recruiter7Request = await VerificationRecruiterRequest.model.create({
    user: user7._id,
    status: 'created',
    verifiable: {
      intro: 'Working with your staff',
      pageBackground: recruiter7PageBackground,
      attachments: [ recruiter7Attachment1._id ]
    },
    custom: {
      showPackagesOnFirstJobBoard: true
    }
  })

  await RecruiterService.model.create({
    name: 'Hiring',
    request: recruiter7Request._id,
    description: 'Hiring staff for your business',
    fee: '200'
  })

  await RecruiterService.model.create({
    name: 'Training',
    request: recruiter7Request._id,
    description: 'Training your employments',
    fee: '180'
  })

  await RecruiterSocial.model.create({
    name: 'facebook',
    request: recruiter7Request._id,
    url: 'https://www.facebook.com/borisakunin'
  })

  const client8PageBackground = await Image.model.create({
    image: await uploadCloundinaryImage(
      require.resolve('./0.0.4-clients/orange.png')
    )
  })

  const client8Attachment1 = await File.model.create({
    file: await uploadKeystoneFile(File.fields.file, {
      path: require.resolve('./0.0.4-clients/letter.jpg'),
      mimetype: 'image/jpeg'
    })
  })

  const client8Specialization1 = await ServiceCategory.model.findOne({ code: 7 })

  const request8 = await VerificationClientRequest.model.create({
    user: user8._id,
    status: 'created',
    verifiable: {
      name: 'SLS Design',
      intro: 'Grafic Design',
      type: 'entrepreneur',
      pageBackground: client8PageBackground,
      attachments: [ client8Attachment1._id ]
    },
    regular: {
      specializations: [ client8Specialization1._id ]
    }
  })

  await CollaboratorProfile.model.create({
    position: 'CEO',
    user: user8._id,
    request: request8._id,
    hasApproveFromCollaborator: true,
    hasApproveFromClient: true
  })

  await CollaboratorProfile.model.create({
    position: 'CTO',
    user: user7._id,
    request: request8._id,
    hasApproveFromCollaborator: true,
    hasApproveFromClient: true
  })
}
