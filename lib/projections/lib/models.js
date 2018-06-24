const userDetailsProjection = [
  { path: 'avatar' }
]

const verificationProfileProjection = [
  { path: 'level1.avatar' },
  { path: 'verificationProfile' }
]

const extendedOrder = [
  { path: 'takers' }
]

module.exports = {
  userDetailsProjection,
  verificationProfileProjection,
  extendedOrder
}
