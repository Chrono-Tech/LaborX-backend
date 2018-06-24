const EventEmitter = require('events')

const {
  SubscribeRequest,
  SocketMessage
} = requireRoot('lib/models')

class ProfilesChannelHandler extends EventEmitter {
  constructor () {
    super()
    this._subscribers = { }
  }

  async subscribe (connection, data) {
    const request = new SubscribeRequest(data)
    const requests = this._subscribers[connection.id] || []
    requests.push(request)
    this._subscribers[connection.id] = requests
  }

  unsubscribe (connection, { requestId }) {
    const requests = this._subscribers[connection.id] || []
    const newRequests = requests.filter(r => r.requestId !== requestId)
    this._subscribers[connection.id] = newRequests
  }

  async updateProfile (token) {
    await this._notify({ token, type: 'update' })
  }

  async deleteProfile (token) {
    this._notify({ token, type: 'delete' })
  }

  async _notify ({ profile, type }) {
    for (let [connectionId, requests] of Object.entries(this._subscribers)) {
      for (let req of requests) {
        const message = new SocketMessage({
          channel: 'profiles',
          type,
          requestId: req.requestId,
          payload: profile
        })
        this.emit('send message', connectionId, message)
      }
    }
  }

  async closeConnection (connectionId) {
    delete this._subscribers[connectionId]
  }
}

module.exports = ProfilesChannelHandler
