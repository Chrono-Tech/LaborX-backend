const keystone = require('keystone')
const path = require('path')
const config = require('config')
const uniqid = require('uniqid')
const Types = keystone.Field.Types

const generateFilename = file => `${path.basename(file.originalname)}-${uniqid()}${path.extname(file.originalname)}`

/**
 * Фабрика storage для keystone типа Types.File
 * @param relativePath - путь до папки, в которую будут сохраняться файлы.
 * относительный основной папки с файлами из конфига.
 */
const fileStorage = relativePath => new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: config.get('storage.files') + relativePath,
    generateFilename
  },
  schema: {
    path: true,
    size: true,
    mimetype: true,
    originalname: true
  }
})

const defaultImageOptions = {
  autoCleanup: true,
  width: 512,
  height: 512,
  initial: true,
  generateFilename
}

/**
 * Тип картинок для keystone типа Types.CloudinaryImage.
 */
const imageType = options => ({
  type: Types.CloudinaryImage,
  ...Object.assign({}, defaultImageOptions, options)
})

function requiredFilesPlugin (schema, options) {
  schema.pre('validate', function (next) {
    for (const entry of Object.entries(options)) {
      const [ fieldName, fieldConfig ] = entry

      const dependsOn = fieldConfig.dependsOn || {}
      const checkedField = fieldConfig.checkedField

      // Проверка обязательности
      if (fieldConfig.required && !this[fieldName][checkedField]) {
        return next(new Error(`[${fieldName}] is required`))
      }

      // Проверка зависимых полей
      for (const dependOnConfig of Object.entries(dependsOn)) {
        const [ dependsField, availableValue ] = dependOnConfig

        if (availableValue.includes(this[dependsField]) &&
         !this[fieldName][checkedField]) {
          return next(new Error(`[${fieldName}] is required whenProject
            field [${dependsField}]
            takes one of the following values: [${availableValue}]`))
        }
      }
    }
    return next()
  })
}

module.exports = {
  imageType,
  fileStorage,
  requiredFilesPlugin
}
