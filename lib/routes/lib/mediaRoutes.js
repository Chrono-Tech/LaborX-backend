const express = require('express')
const { WebError } = requireRoot('lib/errors')
const { asyncHandler, authenticate } = require('../middleware')
const { fileService, imageService } = requireRoot('./lib/services')
const {
  AttachmentModel
} = requireRoot('lib/models')

const router = express.Router()

router.post('/image/upload', authenticate(), asyncHandler(async (req, res) => {
  // TODO @mdkardaev: cloundinary options in the future
  const image = req.files.image
  if (!image) {
    throw new WebError('No image attached', 400)
  }
  const imageModel = await imageService.upload(image)
  return res.send(imageModel)
}))

router.get('/image/:id', asyncHandler(async (req, res) => {
  const imageModel = await imageService.get(req.params.id)
  res.send(imageModel)
}))

router.post('/file/upload', authenticate(), asyncHandler(async (req, res) => {
  const file = req.files.file
  if (!file) {
    throw new WebError('No file attached', 400)
  }
  const fileModel = await fileService.save(file)
  res.send(AttachmentModel.fromMongo(fileModel))
}))

router.get('/file/:id', authenticate(), asyncHandler(async (req, res) => {
  const file = await fileService.get(req.params.id)
  res.download(file.path + file.filename, file.filename)
}))

module.exports = router
