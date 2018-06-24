const express = require('express')
const { securityService } = requireRoot('lib/services')
const { asyncHandler, authenticate } = require('../middleware')
const {
  SigninSignatureModel,
  VerificationRequestLevel1Model,
  VerificationRequestLevel2Model,
  ConfirmationRequestLevel2Model,
  VerificationRequestLevel3Model,
  VerificationRequestLevel4Model,
  NotificationToggleModel
} = requireRoot('lib/models')

const router = express.Router()

router.get('/me', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.get('/person', asyncHandler(async (req, res) => {
  const person = await securityService.selectPerson(req.query.address)
  res.send(person)
}))

router.post('/persons/query', asyncHandler(async (req, res) => {
  const persons = await securityService.selectPersons(req.body)
  res.send(persons)
}))

router.post('/signin/signature', authenticate.signature(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const { purpose } = SigninSignatureModel.fromJson(req.body)
  const token = await securityService.upsertToken({ user, purpose })
  const profile = await securityService.selectProfile(user)
  res.send({
    token: token.token,
    profile
  })
}))

router.post('/me/profile/level1', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.upsertLevel1Request(
    user,
    VerificationRequestLevel1Model.fromJson(req.body)
  )
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.post('/me/profile/level2', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.upsertLevel2Request(
    user,
    VerificationRequestLevel2Model.fromJson(req.body)
  )
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.post('/me/profile/level3', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  console.log(req.body)
  await securityService.upsertLevel3Request(
    user,
    VerificationRequestLevel3Model.fromJson(req.body)
  )
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.post('/me/profile/level4', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.upsertLevel4Request(
    user,
    VerificationRequestLevel4Model.fromJson(req.body)
  )
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.post('/me/profile/level2/validate/email', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.validateEmail(user)
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.post('/me/profile/level2/validate/phone', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.validatePhone(user)
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.post('/me/profile/level2/confirm', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const status = await securityService.confirmLevel2Request(
    user,
    ConfirmationRequestLevel2Model.fromJson(req.body)
  )
  const profile = await securityService.selectProfile(user)
  res.send({
    profile,
    status
  })
}))

router.post('/me/profile/notifications', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.updateNotification(
    user,
    NotificationToggleModel.fromJson(req.body)
  )
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

module.exports = router
