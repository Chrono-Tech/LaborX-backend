const path = require('path')
const keystone = require('keystone')
const config = require('config')
const { promisify } = require('util')
const debug = require('debug')('@laborx/profile.backend:app')
const nodemailer = require('nodemailer')

function createApp (options) {
  keystone.init({
    'name': 'LaborX Profile',
    'brand': 'LaborX',
    'mongo': config.get('storage.url'),
    'static': ['public'],
    'module root': path.join(__dirname, '../'),
    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'KeystoneUser',
    'cookie secret': config.get('keystone.cookieSecret'),
    'cloudinary config': config.get('cloudinary.url'),
    'cloudinary folders': true,
    'file limit': '10MB',
    ...options
  })

  keystone.import('lib/keystone')

  keystone.set('cors allow origin', true)

  keystone.set('routes', require('./routes'))

  keystone.set('nav', {
    profiles: ['security-users', 'reqruiter-profiles', 'worker-profiles', 'client-profiles', 'collaborator-profiles', 'verification-requests'],
    security: ['security-signatures', 'security-checks', 'security-tokens'],
    attachments: ['files', 'images'],
    activity: ['ActivityLog'],
    keystone: ['keystone-users']
  })

  keystone.set('mail transport', nodemailer.createTransport(config.get('mail').transport))
  keystone.set('app-started', false)

  keystone.stopAsync = async function () {
    await promisify(keystone.httpServer.close.bind(keystone.httpServer))()

    const { shutdownServices } = requireRoot('lib/services')
    await shutdownServices()

    const { shutdownListeners } = requireRoot('lib/rabbit')
    await shutdownListeners()

    const { shutdownSocketServer } = requireRoot('lib/socket')
    await shutdownSocketServer()

    await promisify(keystone.mongoose.connection.close.bind(keystone.mongoose.connection))()

    keystone.set('app-started', false)
  }

  keystone.startAsync = async function () {
    return new Promise(function (resolve, reject) {
      keystone.start(async function () {
        const { startSocketServer } = requireRoot('lib/socket')
        await startSocketServer(keystone)

        const { startServices } = requireRoot('lib/services')
        await startServices(keystone)

        const { startListeners } = requireRoot('lib/rabbit')
        await startListeners()

        debug('Server successfully started')

        keystone.set('app-started', true)

        resolve()
      })
    })
  }
  return keystone
}

exports = module.exports = {
  createApp
}
