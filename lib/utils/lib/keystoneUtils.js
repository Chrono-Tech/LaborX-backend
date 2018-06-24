const path = require('path')
const fs = require('fs-extra')
const tmp = require('tmp-promise')

const cloudinary = require('cloudinary')
const { promisify } = require('util')

const uploadCloundinaryImage = (...args) => promisify(cloudinary.v2.uploader.upload)(...args)
const uploadKeystoneFile = async (field, data, originalname = null) => {
  const dir = await tmp.dir()
  const dest = path.join(dir.path, originalname || path.basename(data.path))
  await fs.copy(data.path, dest)
  const response = await promisify(field.storage.uploadFile.bind(field.storage))({
    ...data,
    path: dest
  })
  await dir.cleanup()
  return response
}
module.exports = {
  uploadCloundinaryImage,
  uploadKeystoneFile
}
