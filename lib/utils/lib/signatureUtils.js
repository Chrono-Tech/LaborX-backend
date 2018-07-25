const Web3Accounts = require('web3-eth-accounts')
const ethUtil = require('ethereumjs-util')
const { decodeSignature } = require('eth-lib/lib/account')
const { keccak256 } = require('eth-lib/lib/hash')

function recoverPublicKey (data, signature) {
  const parts = signature.split(':')
  const [format, value] = parts.length > 1
    ? parts
    : ['web3', signature]
  let [v, r, s] = decodeSignature(value)
  v = Number(v)
  if (v < 27) {
    v += 27
  }
  const hash = hashMessage(data, format)
  return '0x' + ethUtil.ecrecover(Buffer.from(hash.substring(2), 'hex'), v, r, s).toString('hex')
}

function hashMessage (data, format) {
  switch (format) {
    case 'trezor':
      return keccak256('\x19Ethereum Signed Message:\n' + String.fromCharCode(data.length) + data)
    case 'web3':
    default:
      return Web3Accounts.prototype.hashMessage(data)
  }
}

function publicKeyToAddress (publicKey) {
  const publicHash = keccak256(publicKey)
  return '0x' + publicHash.slice(-40)
}

function deepSortByKey (obj) {
  return Object.keys(obj).sort().reduce((acc, key) => {
    if (Array.isArray(obj[key])) {
      acc[key] = obj[key].map(deepSortByKey)
    } else if (typeof obj[key] === 'object') {
      acc[key] = deepSortByKey(obj[key])
    } else {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

module.exports = {
  deepSortByKey,
  recoverPublicKey,
  publicKeyToAddress
}
