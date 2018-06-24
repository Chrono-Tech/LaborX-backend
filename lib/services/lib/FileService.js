const config = require('config')
const mime = require('mime-types')
const path = require('path')
const keystone = require('keystone')
const { WebError } = requireRoot('lib/errors')
const { uploadKeystoneFile } = requireRoot('lib/utils')

const File = keystone.list('File')

class FileService {
  constructor (applicationContext) {
    this.fileRootPath = config.get('storage.files')
  }

  async save (file) {
    return File.model.create({
      file: await uploadKeystoneFile(File.fields.file, {
        path: file.path,
        mimetype: mime.lookup(path.extname(file.originalname))
      }, file.originalname)
    })
  }

  async get (id) {
    const file = await File.model.findOne({ _id: id })
    if (!file) {
      throw new WebError('File not found', 404)
    }
    return file.file
  }
}

module.exports = FileService
