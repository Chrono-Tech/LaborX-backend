const express = require('express')
const { securityService } = requireRoot('lib/services')
const { asyncHandler, authenticate } = require('../middleware')
const {
  SigninSignatureModel,
  AddressSignatureModel,
  SigninSignatureLaborxModel,
  VerificationRequestLevel1Model,
  VerificationRequestLevel2Model,
  ConfirmationRequestLevel2Model,
  VerificationRequestLevel3Model,
  VerificationRequestLevel4Model,
  VerificationRequestWorkerModel,
  VerificationRequestRecruiterModel,
  VerificationRequestClientModel,
  NotificationToggleModel,
  CreateAgentModel
} = requireRoot('lib/models')

const router = express.Router()

router.get('/me', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const profile = await securityService.selectProfile(user)
  res.send(profile)
}))

router.get('/me/full', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const profile = await securityService.selectProfile(user)
  const worker = await securityService.selectWorkerProfile(user)
  const recruiter = await securityService.selectRecruiterProfile(user)
  const client = await securityService.selectClientProfile(user)
  res.send({
    worker,
    recruiter,
    client,
    profile
  })
}))

router.get('/person', asyncHandler(async (req, res) => {
  const person = await securityService.selectPerson(req.query.address)
  if (person) {
    res.send(person)
  } else {
    res.sendStatus(404)
  }
}))

router.post('/persons/query', asyncHandler(async (req, res) => {
  const persons = await securityService.selectPersons(req.body)
  res.send(persons)
}))

router.post('/signin/signature', authenticate.signature(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext

  const request = new SigninSignatureModel(req.body)

  const token = await securityService.upsertToken({ user, ...request, expressRequest: req })
  const profile = await securityService.selectProfile(user)
  res.send({
    token: token.token,
    profile
  })
}))

router.post('/signin/signature/chronomint', authenticate.signature(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const request = new AddressSignatureModel(req.body)

  const token = await securityService.upsertToken({ user, ...request, expressRequest: req })
  const profile = await securityService.selectProfile(user)
  
  await securityService.upsertAddresses({ user, ...request })
  const addresses = await securityService.selectAddresses(user)
  res.send({
    token: token.token,
    profile,
    addresses
  })
}))


router.get('/me/addresses', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const addresses = await securityService.selectAddresses(user)
  res.send({
    addresses
  })
}))



router.post('/signin/signature/laborx', authenticate.signature(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const { roles } = req.body
  if (roles) {
    user.worker.isRequested = roles.isWorker
    user.client.isRequested = roles.isClient
    user.recruiter.isRequested = roles.isRecruiter
    await user.save()
  }
  const request = new SigninSignatureLaborxModel(req.body)
  const token = await securityService.upsertToken({ user, ...request, expressRequest: req })
  const profile = await securityService.selectProfile(user)
  const client = await securityService.selectClientProfile(user)
  const worker = await securityService.selectWorkerProfile(user)
  const recruiter = await securityService.selectRecruiterProfile(user)
  res.send({
    token: token.token,
    profile,
    worker,
    client,
    recruiter
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

router.post('/me/profile/worker', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.upsertWorkerRequest(
    user,
    VerificationRequestWorkerModel.fromJson(req.body)
  )
  const worker = await securityService.selectWorkerProfile(user)
  res.send(worker)
}))

router.post('/me/profile/recruiter', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.upsertRecruiterRequest(
    user,
    VerificationRequestRecruiterModel.fromJson(req.body)
  )
  const recruiter = await securityService.selectRecruiterProfile(user)
  res.send(recruiter)
}))

router.post('/me/profile/client', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  await securityService.upsertClientRequest(
    user,
    VerificationRequestClientModel.fromJson(req.body)
  )
  const client = await securityService.selectClientProfile(user)
  res.send(client)
}))

router.get('/me/agents', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const { purpose, principal } = req.query
  const agents = await securityService.selectAgents(user, { purpose, principal })
  res.send(agents)
}))

router.post('/me/agents', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const agent = await securityService.createAgent(
    user,
    CreateAgentModel.fromJson(req.body)
  )
  res.send(agent)
}))

router.get('/me/profile/client', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const client = await securityService.selectClientProfile(user)
  res.send(client)
}))

router.get('/me/profile/worker', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const worker = await securityService.selectWorkerProfile(user)
  res.send(worker)
}))

router.get('/me/profile/recruiter', authenticate(), asyncHandler(async (req, res) => {
  const { user } = req.securityContext
  const recruiter = await securityService.selectRecruiterProfile(user)
  res.send(recruiter)
}))

module.exports = router
