const mongoose = require('mongoose')
const config = require('config')
const nodemailer = require('nodemailer')
const bip39 = require('bip39')
const hdKey = require('ethereumjs-wallet/hdkey')
const assert = require('assert')
const { web3Holder } = requireRoot('lib/web3')
const Tx = require('ethereumjs-tx')

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

function getBlockchainInfo () {
  const mnemonic = config.blockchain.test.mnemonic

  assert(mnemonic, 'config.blockchain.test.mnemonic must be specified')

  const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))

  const derivedWallets = Array
    .from({ length: 10 })
    .map((item, index) => hdWallet.derivePath(`m/44'/60'/0'/0/${index}`).getWallet())

  const privateKeys = derivedWallets.map(wallet => wallet.getPrivateKey().toString('hex'))
  const addresses = derivedWallets.map(wallet => `0x${wallet.getAddress().toString('hex')}`)

  return {
    privateKeys,
    addresses
  }
}

async function createTx ({ from, to, privateKey, value, data }) {
  const web3 = web3Holder.web3
  const nonce = await web3.eth.getTransactionCount(from)
  const gasPrice = await web3.eth.getGasPrice()
  const { gasLimit } = await web3.eth.getBlock('latest')

  var rawTx = {
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to,
    value: web3.utils.toHex(value),
    data: web3.utils.toHex(data)
  }
  const tx = new Tx(rawTx)
  tx.sign(Buffer.from(privateKey, 'hex'))
  const rawtx = `0x${tx.serialize().toString('hex')}`

  return {
    rawtx,
    hash: `0x${tx.hash(true).toString('hex')}`
  }
}

async function createAndSendTx ({ from, to, privateKey, value, data }) {
  const { rawtx } = await createTx({ from, to, privateKey, value, data })
  return web3Holder.web3.eth.sendSignedTransaction(rawtx)
}

const sharedObject = {
  dropDB,
  withAuthorization,
  mockMail,
  restoreMailMock,
  getBlockchainInfo,
  createTx,
  createAndSendTx
}
// object for sharing values from updates and tests
module.exports = sharedObject
