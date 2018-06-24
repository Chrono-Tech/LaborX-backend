const path = require('path')
const { createApp } = requireRoot('lib/app')
const share = require('../share')

const {
  TokenModel,
  CreateTokenModelRequest
} = require('@laborx/exchange.core').models

const axios = require('axios')
const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api/v1/tokens`,
  validateStatus: status => true
})

describe('Tokens Tests', function () {
  let app

  before(async function () {
    await share.dropDB()

    app = createApp({
      headless: true,
      logger: null,
      'auto update': true,
      updates: path.join(__dirname, './updates')
    })
    await app.startAsync()
  })

  after(async function () {
    await app.stopAsync()
  })

  it('Get all tokens', async function () {
    const expected = [
      TokenModel.fromMongo(share.tokens.btc)
    ]
    const { data, status } = await api.get('/')

    expect(status, 'status should be 200').to.equal(200)

    expect(data).to.deep.equal(expected, 'Not expected data')
  })

  it('Create token', async function () {
    const request = new CreateTokenModelRequest({
      name: 'name',
      symbol: 'smb',
      address: '0x00000000000000000000000000000000000000a2',
      icon: share.img.image.secure_url,
      projectUrl: 'https://proejct2.io',
      decimals: 18
    })

    const { status } = await api.post('/', request, {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(201)
  })
})
