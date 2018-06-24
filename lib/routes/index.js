const keystone = require('keystone')

const { errorHandler } = require('./middleware')
const securityRouter = require('./lib/securityRoutes')
const mediaRouter = require('./lib/mediaRoutes')

const restful = require('restful-keystone')(keystone, {
  root: '/api/v1'
})

exports = module.exports = function (app) {
  app.set('json spaces', 2)

  app.all('/api/v1/*', keystone.middleware.cors)

  app.options('/api/v1/*', (req, res) => {
    res.sendStatus(200)
  })

  app.use('/api/v1/security', securityRouter)
  app.use('/api/v1/media', mediaRouter)
  // app.use('/api/v1/user', usersRouter)

  app.get('/', (req, res) => {
    res.redirect('/keystone/')
  })

  restful.expose({
  }).start()

  app.use(errorHandler)
}
