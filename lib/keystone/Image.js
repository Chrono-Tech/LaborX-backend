const keystone = require('keystone')
const { imageType } = requireRoot('lib/helpers')

const Image = new keystone.List('Image', {
  track: {
    createdAt: true
  }
})

/**
 * Опции для файлов, которые в дальнейшем будут использоваться для валидации
 * на обязательность заполнения
 */
// const requiredImageOptions = {
//   image: {
//     checkedField: 'url',
//     required: true
//   }
// }

Image.add({
  image: imageType({
    folder: 'images',
    required: true
  })
})

// Image.schema.pre('save', async function (next) {
//   console.log('Image', this)
//   next()
// })

// Image.schema.plugin(requiredFilesPlugin, requiredImageOptions)

Image.defaultColumns = 'image'
Image.register()
