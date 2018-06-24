const keystone = require('keystone')
const config = require('config')
const { fileStorage, requiredFilesPlugin } = requireRoot('lib/helpers')
const Types = keystone.Field.Types
const SELF = config.get('self.url')

const File = new keystone.List('File', {
  map: { name: 'file.originalname' }
})

const requiredFilesOptions = {
  file: {
    checkedField: 'size',
    required: true,
    initial: true,
    noedit: true
  }
}

File.add({
  url: { type: Types.Url, noedit: true, default: null, initial: false },
  file: {
    type: Types.File,
    storage: fileStorage('/'),
    ...requiredFilesOptions.file
  }
})

File.schema.plugin(requiredFilesPlugin, requiredFilesOptions)

File.schema.pre('save', async function (next) {
  this.url = `${SELF}/api/v1/media/file/${this._id.toString()}`
  next()
})

File.defaultColumns = 'file'
File.register()
