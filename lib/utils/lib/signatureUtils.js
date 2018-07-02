const Web3Accounts = require('web3-eth-accounts')
const ethUtil = require('ethereumjs-util')
const { decodeSignature } = require('eth-lib/lib/account')
const { keccak256 } = require('eth-lib/lib/hash')

function sign (data, privateKey) {
  return Web3Accounts.prototype.sign(data, privateKey)
}

function isValidSignature (data, signature, signerAddress) {
  const reoveredAddress = Web3Accounts.prototype.recover(data, signature)
  return reoveredAddress.toLowerCase() === signerAddress.toLowerCase()
}

function recoverAddress (data, signature) {
  return Web3Accounts.prototype.recover(data, signature)
}

function recoverPublicKey (data, signature) {
  let [v, r, s] = decodeSignature(signature)
  v = Number(v)
  if (v < 27) {
    v += 27
  }
  const hash = Web3Accounts.prototype.hashMessage(data)
  return '0x' + ethUtil.ecrecover(Buffer.from(hash.substring(2), 'hex'), v, r, s).toString('hex')
}

function publicKeyToAddress (publicKey) {
  const publicHash = keccak256(publicKey)
  return '0x' + publicHash.slice(-40)
}

function parseSignatureHexAsVRS (signatureHex) {
  const signatureBuffer = ethUtil.toBuffer(signatureHex)
  let v = signatureBuffer[0]
  if (v < 27) {
    v += 27
  }
  const r = signatureBuffer.slice(1, 33)
  const s = signatureBuffer.slice(33, 65)
  const ecSignature = {
    v,
    r: ethUtil.bufferToHex(r),
    s: ethUtil.bufferToHex(s)
  }
  return ecSignature
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
  sign,
  isValidSignature,
  parseSignatureHexAsVRS,
  deepSortByKey,
  recoverAddress,
  recoverPublicKey,
  publicKeyToAddress
}
