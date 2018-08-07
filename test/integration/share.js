const config = require('config')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

async function dropDB () {
  return new Promise(function (resolve, reject) {
    mongoose.connect(config.get('storage.url'))

    const openCallback = function () {
      mongoose.connection.db.dropDatabase(function (err, result) {
        if (err) {
          return reject(err)
        }
        mongoose.connection.close(function () {
          mongoose.connection.removeListener('open', openCallback)
          resolve()
        })
      })
    }

    mongoose.connection.on('open', openCallback)
  })
}

function withAuthorization (token) {
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

function mockMail (app) {
  function mockSendMailer () {
    function createTransport () { }
    createTransport.sendMail = (data, callback) => callback(null, null)
    return createTransport
  }
  app.set('mail transport', mockSendMailer())
}

function restoreMailMock (app) {
  app.set('mail transport', nodemailer.createTransport(config.get('mail').transport))
}

const sharedObject = {
  dropDB,
  withAuthorization,
  mockMail,
  restoreMailMock
}
// object for sharing values from updates and tests
module.exports = sharedObject
