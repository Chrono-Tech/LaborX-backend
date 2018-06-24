const Core = require('./Core')
const Security = require('./Security')
const Profile = require('./Profile')
const WS = require('./WS')

module.exports = {
  ...Core,
  ...Security,
  ...Profile,
  ...WS,
  Core,
  Security,
  Profile,
  WS
}
