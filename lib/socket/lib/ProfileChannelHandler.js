const EventEmitter = require('events')
const {
  SubscribeProfileRequest,
  UpdateProfileMessage
} = requireRoot('lib/models')

class ProfilesChannelHandler extends EventEmitter {
  constructor () {
    super()
    this._subscribers = { }
  }

  async subscribe (connection, data) {
    const { securityService } = requireRoot('lib/services')
    const request = new SubscribeProfileRequest(data)

    const token = await securityService.findToken({ token: request.payload.token })
    if (!token) {
      // TODO: send error to client
      return
    }

    const requests = this._subscribers[connection.id] || []
    requests.push({
      ...request,
      userID: token.user.id
    })

    this._subscribers[connection.id] = requests
  }

  unsubscribe (connection, { requestId }) {
    const requests = this._subscribers[connection.id] || []
    const newRequests = requests.filter(r => r.requestId !== requestId)
    this._subscribers[connection.id] = newRequests
  }

  async profileUpdated ({ id }) {
    for (let [connectionId, requests] of Object.entries(this._subscribers)) {
      for (let req of requests) {
        if (req.userID === id) {
          const message = new UpdateProfileMessage({
            requestId: req.requestId,
            payload: {
              id
            }
          })
          this.emit('send message', connectionId, message)
        }
      }
    }
  }

  async closeConnection (connectionId) {
    delete this._subscribers[connectionId]
  }
}

module.exports = ProfilesChannelHandler
