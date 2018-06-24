const errorDebug = require('debug')('@laborx/profile.backend:middleware')

const keystone = require('keystone')
const Web3Utils = require('web3-utils')
const Web3Accounts = require('web3-eth-accounts')
const { WebError, ValidationError } = requireRoot('lib/errors')
const { deepSortByKey } = requireRoot('lib/utils')
const { securityService } = requireRoot('lib/services')

const KeystoneUser = keystone.list('KeystoneUser')

const AUTH_TYPE_BEARER = 'Bearer'
const AUTH_TYPE_SIGNATURE = 'Signature'

function asyncHandler (fn) {
  return (...args) => fn(...args).catch(args[2])
}

function authenticate (
  { types = [AUTH_TYPE_BEARER, AUTH_TYPE_SIGNATURE] } =
  { types: [AUTH_TYPE_BEARER, AUTH_TYPE_SIGNATURE] }
) {
  return asyncHandler(async (req, res, next) => {
    if (req.session.userId) {
      // login in keystone
      const user = await KeystoneUser.model.findOne({ _id: req.session.userId })
      req.securityContext = {
        user
      }
      return next()
    }

    if (req.headers.authorization == null) {
      throw new WebError('Unauthorized', 401)
    }

    const [ type, value ] = req.headers.authorization.split(' ')

    if (!types.includes(type)) {
      throw new WebError('Unauthorized', 401)
    }

    if (type === AUTH_TYPE_BEARER) {
      const token = await securityService.findToken({ token: value })
      const user = token.user
      req.securityContext = {
        user,
        token
      }
      return next()
    }

    if (type === AUTH_TYPE_SIGNATURE) {
      const data = JSON.stringify(
        deepSortByKey({
          url: req.originalUrl,
          body: req.body
        })
      )

      const address = Web3Accounts.prototype.recover(data, value).toLowerCase()

      if (!Web3Utils.isAddress(address)) {
        throw new WebError('Wrong credentials', 401)
      }

      const signature = await securityService.requireSignature({
        value: address,
        type: 'ethereum-address'
      })

      req.securityContext = {
        user: signature.user,
        signature
      }

      return next()
    }

    throw new WebError('Unauthorized', 401)
  })
}

authenticate.signature = (props = {}) => authenticate({
  ...props,
  types: [AUTH_TYPE_SIGNATURE]
})

authenticate.bearer = (props = {}) => authenticate({
  ...props,
  types: [AUTH_TYPE_BEARER]
})

// Forced to have 4 arguments due to express convension about error handlers
// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  errorDebug(err)
  let status = 500
  if (err instanceof WebError) {
    status = err.status
  } else if (err instanceof ValidationError) {
    status = 400
  }
  res.status(status).send({ error: err.message })
}

module.exports = {
  asyncHandler,
  errorHandler,
  authenticate,
  AUTH_TYPE_BEARER,
  AUTH_TYPE_SIGNATURE
}
