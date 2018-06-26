const keystone = require('keystone')
const useragent = require('express-useragent')

const { errorHandler } = require('./middleware')
const securityRouter = require('./lib/securityRoutes')
const mediaRouter = require('./lib/mediaRoutes')
const activityLogRouter = require('./lib/activityLogRoutes')

const restful = require('restful-keystone')(keystone, {
  root: '/api/v1'
})

exports = module.exports = function (app) {
  app.set('json spaces', 2)

  app.all('/api/v1/*', keystone.middleware.cors)

  app.options('/api/v1/*', (req, res) => {
    res.sendStatus(200)
  })
  app.use(useragent.express())

  app.use('/api/v1/security', securityRouter)
  app.use('/api/v1/media', mediaRouter)
  app.use('/api/v1/activityLog', activityLogRouter)

  app.get('/', (req, res) => {
    res.redirect('/keystone/')
  })

  restful.expose({
  }).start()

  app.use(errorHandler)
}
