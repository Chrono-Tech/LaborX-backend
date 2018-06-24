const path = require('path')
const { createApp } = requireRoot('lib/app')
const { RandomGenerator } = requireRoot('lib/utils')
const share = require('../share')

const sinon = require('sinon')

const {
  UserSecurityModel,
  ChangePhoneModel,
  ChangeEmailModel,
  SecurityCheckConfirmModel
} = require('@laborx/exchange.core').models

const axios = require('axios')
const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api/v1/user`,
  validateStatus: status => true
})

const secuirtyApi = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api/v1/security`,
  validateStatus: status => true
})

describe('User Tests', function () {
  let app
  let sandbox
  const CHECK_TOKEN = 'check-Token'

  before(async function () {
    await share.dropDB()
    sandbox = sinon.sandbox.create()

    // Mock functions that generate check tokens that is sended by email
    sandbox.stub(RandomGenerator, 'hexMd5OfRandomBytes')
      .returns(Promise.resolve(CHECK_TOKEN))

    app = createApp({
      headless: true,
      logger: null,
      'auto update': true,
      updates: path.join(__dirname, './updates')
    })

    share.mockMail(app)

    await app.startAsync()
  })

  after(async function () {
    await app.stopAsync()
    share.restoreMailMock(app)
    sandbox.restore()
  })

  it('Get user security info', async function () {
    await checkUserSecurityInfo({ email: 'example@example.com', phone: '+71234567890' })
  })

  it('Start Changing Email', async function () {
    const changeEmailModel = new ChangeEmailModel({
      email: 'new@example.com',
      password: 'password'
    })

    const { status } = await api.put('/security/email', changeEmailModel, {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)
  })

  it('Successfully change email confirmation', async function () {
    const confirmModel = new SecurityCheckConfirmModel({
      check: CHECK_TOKEN
    })

    const { status } = await secuirtyApi.post('/confirm/email', confirmModel)

    expect(status, 'status should be 200').to.equal(200)

    // Check email is changed
    await checkUserSecurityInfo({ email: 'new@example.com', phone: '+71234567890' })
  })

  it('Start Changing phone', async function () {
    const changePhoneModel = new ChangePhoneModel({
      phone: '+71234567899',
      password: 'password'
    })

    const { status } = await api.put('/security/phone', changePhoneModel, {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)
  })

  it('Successfully change phone confirmation', async function () {
    const confirmModel = new SecurityCheckConfirmModel({
      check: CHECK_TOKEN
    })

    const { status } = await secuirtyApi.post('/confirm/phone', confirmModel)

    expect(status, 'status should be 200').to.equal(200)

    // Check phone is changed
    await checkUserSecurityInfo({ email: 'new@example.com', phone: '+71234567899' })
  })

  async function checkUserSecurityInfo ({ email, phone }) {
    const { status, data } = await api.get('/security', {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)

    const result = new UserSecurityModel(data)

    expect(result.email).to.equal(`${email}`, `expected email is [${email}]`)
    expect(result.phone).to.equal(`${phone}`, `expected phone is [${phone}]`)
  }
})
