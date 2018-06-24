const cloudinary = require('cloudinary')
const config = require('config')
const { promisify } = require('util')
const url = require('url')
const moment = require('moment')
const keystone = require('keystone')
const { WebError } = requireRoot('lib/errors')
const { ImageModel } = requireRoot('lib/models')

const ImageMongoModel = keystone.list('Image')

class ImageService {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
    const cloudinaryConfig = config.get('cloudinary')

    var parts = url.parse(cloudinaryConfig.url, true)
    var auth = parts.auth ? parts.auth.split(':') : []

    cloudinary.config({
      cloud_name: parts.host,
      api_key: auth[0],
      api_secret: auth[1]
    })
  }

  getFileName (file) {
    // remove extension
    const filename = file.originalname.substr(0, file.originalname.length - file.extension.length - 1)
    return `${moment().format('MM-DD-YYYY-hh-mm-ss')}-${filename}`
  }

  async upload (file, options) {
    const publicId = this.getFileName(file)

    const imageInfo = await promisify(cloudinary.v2.uploader.upload)(file.path, {
      ...options,
      use_filename: true,
      public_id: publicId
    })

    const savedImage = await ImageMongoModel.model.create({
      image: imageInfo
    })
    return ImageModel.fromMongo(savedImage)
  }

  async get (id) {
    const image = await ImageMongoModel.model.findOne({ _id: id })
    if (!image) {
      throw new WebError('Image not found', 404)
    }

    return ImageModel.fromMongo(image)
  }
}

module.exports = ImageService
