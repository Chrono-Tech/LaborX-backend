const express = require('express')
const { activityLogService } = requireRoot('lib/services')
const { asyncHandler, authenticate } = require('../middleware')
const { ActivityLogRequest } = requireRoot('lib/models')

const router = express.Router()

router.get('/', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const request = new ActivityLogRequest(req.query)
  const response = await activityLogService.get(user, request)
  res.send(response)
}))

module.exports = router
