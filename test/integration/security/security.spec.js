const path = require('path')
const { createApp } = requireRoot('lib/app')
const { RandomGenerator } = requireRoot('lib/utils')
const share = require('../share')

const sinon = require('sinon')

const {
  SignUpModel,
  SignUpResponseModel,
  SecurityCheckConfirmModel,
  SignInModel,
  UserCredentials,
  ChangePasswordModel,
  ForgotPasswordModel,
  RecoverResponseModel
} = require('@laborx/exchange.core').models

const axios = require('axios')
const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api/v1/security`,
  validateStatus: status => true
})

describe('Security Tests', function () {
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

  it('Successfully SignUp (email)', async function () {
    const signUpModel = new SignUpModel({
      email: 'confirm@example.com',
      password: 'password'
    })

    const { status, data } = await api.post('/signup', signUpModel)

    expect(status, 'status should be 200').to.equal(200)

    const result = new SignUpResponseModel(data)

    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true

    share.user = result.user
  })

  it('Successfully Email Confirmation', async function () {
    const confirmModel = new SecurityCheckConfirmModel({
      check: CHECK_TOKEN
    })

    const { status, data } = await api.post('/confirm/email', confirmModel)

    expect(status, 'status should be 200').to.equal(200)

    const result = new UserCredentials(data)

    expect(result.token != null, 'token should be specified').to.be.true
    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true
    expect(result.user.email).to.equal('confirm@example.com', 'expected email is [confirm@example.com]')
  })

  it('Successfully SignIn (email)', async function () {
    const signInModel = new SignInModel({
      email: 'confirm@example.com',
      password: 'password'
    })

    const { status, data } = await api.post('/signin', signInModel)

    expect(status, 'status should be 200').to.equal(200)

    const result = new UserCredentials(data)

    expect(result.token != null, 'token should be specified').to.be.true
    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true
    expect(result.user.email).to.equal('confirm@example.com', 'expected email is [confirm@example.com]')
    share.token = result.token
  })

  it('Successfully change password by old correct password', async function () {
    const changePasswordModel = new ChangePasswordModel({
      password: 'newPassword',
      oldPassword: 'password'
    })
    const { status, data } = await api.post('/passwd',
      changePasswordModel,
      share.withAuthorization(share.token))

    expect(status, 'status should be 200').to.equal(200)

    const result = new SignUpResponseModel(data)

    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true

    // check can signin with new password
    const signInModel = new SignInModel({
      email: 'confirm@example.com',
      password: 'newPassword'
    })

    const { status: status2 } = await api.post('/signin', signInModel)

    expect(status2, 'status should be 200').to.equal(200)

    // check cannot signin with old password
    const signInModelWithIncorrectPassword = new SignInModel({
      email: 'confirm@example.com',
      password: 'password'
    })

    const { status: status3 } = await api.post('/signin', signInModelWithIncorrectPassword)

    expect(status3, 'status should be 401').to.equal(401)
  })

  it('Start Forgot', async function () {
    const forgotPasswordModel = new ForgotPasswordModel({
      email: 'confirm@example.com'
    })

    const { status, data } = await api.post('/forgot', forgotPasswordModel)

    expect(status, 'status should be 200').to.equal(200)

    const result = new SignUpResponseModel(data)

    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true
  })

  it('Start Recover', async function () {
    const { status, data } = await api.post(`/recover/${CHECK_TOKEN}`)

    expect(status, 'status should be 200').to.equal(200)

    const result = new RecoverResponseModel(data)

    expect(result.token != null, 'token should be specified').to.be.true
    expect(result.check != null, 'check should be specified').to.be.true
    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true
    expect(result.user.email != null, 'user.email should be specified').to.be.true
    share.check = result.check
    share.token = result.token
  })

  it('Finish Recover', async function () {
    const changePasswordModel = new ChangePasswordModel({
      password: 'password',
      check: share.check
    })

    const { status, data } = await api.post('/passwd',
      changePasswordModel,
      share.withAuthorization(share.token))

    expect(status, 'status should be 200').to.equal(200)

    const result = new SignUpResponseModel(data)

    expect(result.user != null, 'user should be specified').to.be.true
    expect(result.user.id != null, 'user.id should be specified').to.be.true

    // check cannot signin with old password
    const signInModelWithIncorrectPassword = new SignInModel({
      email: 'confirm@example.com',
      password: 'newPassword'
    })

    const { status: status2 } = await api.post('/signin', signInModelWithIncorrectPassword)

    expect(status2, 'status should be 401').to.equal(401)

    // check can signin with new password
    const signInModel = new SignInModel({
      email: 'confirm@example.com',
      password: 'password'
    })

    const { status: status3, data: data3 } = await api.post('/signin', signInModel)

    expect(status3, 'status should be 200').to.equal(200)
    const result3 = new UserCredentials(data3)
    share.token = result3.token
  })
})
