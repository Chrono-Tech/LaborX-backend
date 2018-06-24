const Web3Accounts = require('web3-eth-accounts')
const ethUtil = require('ethereumjs-util')

function sign (data, privateKey) {
  return Web3Accounts.prototype.sign(data, privateKey)
}

function isValidSignature (data, signature, signerAddress) {
  const reoveredAddress = Web3Accounts.prototype.recover(data, signature)
  return reoveredAddress.toLowerCase() === signerAddress.toLowerCase()
}

function isValidSignatureVRS (data, { v, r, s }, signerAddress) {
  const dataBuff = ethUtil.toBuffer(data)
  const msgHashBuff = ethUtil.hashPersonalMessage(dataBuff)
  try {
    const pubKey = ethUtil.ecrecover(
      msgHashBuff,
      v,
      ethUtil.toBuffer(r),
      ethUtil.toBuffer(s))
    const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey))
    return retrievedAddress.toLowerCase() === signerAddress.toLowerCase()
  } catch (err) {
    return false
  }
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

function parseSignatureHexAsRSV (signatureHex) {
  const { v, r, s } = ethUtil.fromRpcSig(signatureHex)
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
  isValidSignatureVRS,
  parseSignatureHexAsVRS,
  parseSignatureHexAsRSV,
  deepSortByKey
}
