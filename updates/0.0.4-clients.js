const keystone = require('keystone')
// const { uploadCloundinaryImage, uploadKeystoneFile } = requireRoot('lib/utils')

const Currency = keystone.list('Currency')
const ServiceCategory = keystone.list('ServiceCategory')
const ClientProfile = keystone.list('ClientProfile')
const CollaboratorProfile = keystone.list('CollaboratorProfile')
const ReqruiterProfile = keystone.list('ReqruiterProfile')
const ReqruiterService = keystone.list('ReqruiterService')
const ReqruiterSocial = keystone.list('ReqruiterSocial')
const WorkerProfile = keystone.list('WorkerProfile')
const WorkerService = keystone.list('WorkerService')
const WorkerSocial = keystone.list('WorkerSocial')
const SecurityUser = keystone.list('SecurityUser')
// const File = keystone.list('File')
// const Image = keystone.list('Image')

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

  const client1 = await ClientProfile.model.create({
    name: 'NTR',
    type: 'organization',
    website: 'http://ntr1x.com',
    email: 'team@ntr1x.com'
  })

  await CollaboratorProfile.model.create({
    position: 'CEO',
    user: user1._id,
    client: client1._id
  })

  await CollaboratorProfile.model.create({
    position: 'Software Developer',
    user: user2._id,
    client: client1._id
  })

  await CollaboratorProfile.model.create({
    position: 'Software Developer',
    user: user5._id,
    client: client1._id
  })

  const worker3 = await WorkerProfile.model.create({
    user: user3._id,
    intro: 'JavaScript Developer, Frontend Developer',
    hourlyCharge: '18',
    currencies: [btc._id],
    schedule: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true
    }
  })

  const worker4 = await WorkerProfile.model.create({
    user: user4._id,
    intro: 'JavaScript Developer (both Frontend & Backend)',
    hourlyCharge: '20',
    currencies: [btc._id, eth._id],
    schedule: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true
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

  const reqruiter5 = await ReqruiterProfile.model.create({
    user: user5._id,
    intro: 'I will find you a great software developer',
    hourlyCharge: '20',
    currencies: [btc._id, eth._id],
    schedule: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true
    }
  })

  await ReqruiterService.model.create({
    name: 'Hiring',
    reqruiter: reqruiter5._id,
    description: 'Hiring staff for your business',
    fee: '120'
  })

  await ReqruiterService.model.create({
    name: 'Training',
    reqruiter: reqruiter5._id,
    description: 'Training your employments',
    fee: '120'
  })

  await ReqruiterSocial.model.create({
    name: 'facebook',
    reqruiter: reqruiter5._id,
    url: 'https://www.facebook.com/romanjosiofficial/'
  })
}
