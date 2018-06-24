const path = require('path')
const { createApp } = requireRoot('lib/app')
const share = require('../share')

const {
  VerificationProfileLevel1ResponseModel,
  VerificationProfileLevel2ResponseModel,
  VerificationProfileLevel3ResponseModel
} = require('@laborx/exchange.core').models

const axios = require('axios')
const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api/v1/user`
})

let app

describe('User test', function () {
  this.timeout(10000)
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

  it('Successfully Update level 1', async function () {
    const level1Data = {
      firstName: 'FirstName',
      familyName: 'FamilyName',
      email: 'example@example.com',
      birthDate: '949363200000',
      country: 'Russia'
    }

    const expectedData = {
      firstName: {
        value: 'FirstName',
        isConfirmed: false,
        isOverride: true
      },
      familyName: {
        value: 'FamilyName',
        isConfirmed: false,
        isOverride: true
      },
      email: {
        value: 'example@example.com',
        isConfirmed: false,
        isOverride: true
      },
      birthDate: {
        value: '2000-02-01T00:00:00.000Z',
        isConfirmed: false,
        isOverride: true
      },
      country: {
        value: 'Russia',
        isConfirmed: false,
        isOverride: true
      }
    }

    // Request Model is VerificationProfileLevel1RequestModel
    const { status, data } = await api.post('/verification?level=1', level1Data, {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)

    const response = new VerificationProfileLevel1ResponseModel(data)

    expect(response).to.deep.equal(new VerificationProfileLevel1ResponseModel(expectedData), 'Not expected data')
  })

  it('Successfully get level 1', async function () {
    const expectedData = {
      firstName: {
        value: 'FirstName',
        isConfirmed: false,
        isOverride: true
      },
      familyName: {
        value: 'FamilyName',
        isConfirmed: false,
        isOverride: true
      },
      email: {
        value: 'example@example.com',
        isConfirmed: false,
        isOverride: true
      },
      birthDate: {
        value: '2000-02-01T00:00:00.000Z',
        isConfirmed: false,
        isOverride: true
      },
      country: {
        value: 'Russia',
        isConfirmed: false,
        isOverride: true
      }
    }

    const { status, data } = await api.get('/verification?level=1', {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)

    const response = new VerificationProfileLevel1ResponseModel(data)

    expect(response).to.deep.equal(new VerificationProfileLevel1ResponseModel(expectedData), 'Not expected data')
  })

  it('Successfully Update level 2', async function () {
    const level2Data = {
      state: 'state',
      city: 'city',
      address: 'address',
      zipcode: 123456
    }

    const expectedData = {
      state: {
        value: 'state',
        isConfirmed: false,
        isOverride: true
      },
      city: {
        value: 'city',
        isConfirmed: false,
        isOverride: true
      },
      address: {
        value: 'address',
        isConfirmed: false,
        isOverride: true
      },
      zipcode: {
        value: '123456',
        isConfirmed: false,
        isOverride: true
      }
    }

    // Request Model is VerificationProfileLevel2RequestModel
    const { status, data } = await api.post('/verification?level=2', level2Data, {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)

    const response = new VerificationProfileLevel2ResponseModel(data)

    expect(response).to.deep.equal(new VerificationProfileLevel2ResponseModel(expectedData), 'Not expected data')
  })

  it('Successfully get level 2', async function () {
    const expectedData = {
      state: {
        value: 'state',
        isConfirmed: false,
        isOverride: true
      },
      city: {
        value: 'city',
        isConfirmed: false,
        isOverride: true
      },
      address: {
        value: 'address',
        isConfirmed: false,
        isOverride: true
      },
      zipcode: {
        value: '123456',
        isConfirmed: false,
        isOverride: true
      }
    }

    const { status, data } = await api.get('/verification?level=2', {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)

    const response = new VerificationProfileLevel2ResponseModel(data)

    expect(response).to.deep.equal(new VerificationProfileLevel2ResponseModel(expectedData), 'Not expected data')
  })

  it('Successfully Update level 3', async function () {
    const fileId = share.file._id.toString()
    const level3Data = {
      passport: fileId,
      proofOfAddress: fileId,
      passportNumber: '123456',
      passportExpirationDate: '949363200000'
    }

    const expectedData = {
      passport: {
        value: fileId,
        isConfirmed: false,
        isOverride: true
      },
      proofOfAddress: {
        value: fileId,
        isConfirmed: false,
        isOverride: true
      },
      passportNumber: {
        value: '123456',
        isConfirmed: false,
        isOverride: true
      },
      passportExpirationDate: {
        value: '2000-02-01T00:00:00.000Z',
        isConfirmed: false,
        isOverride: true
      }
    }

    // Request Model is VerificationProfileLevel3RequestModel
    const { status, data } = await api.post('/verification?level=3', level3Data, {
      headers: { Authorization: 'Bearer ' + share.token.token }
    })

    expect(status, 'status should be 200').to.equal(200)

    const response = new VerificationProfileLevel3ResponseModel(data)

    expect(response).to.deep.equal(new VerificationProfileLevel3ResponseModel(expectedData), 'Not expected data')
  })
})
