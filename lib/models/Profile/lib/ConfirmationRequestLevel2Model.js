const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  emailCode: Joi.string().allow([null, '']),
  phoneCode: Joi.string().allow([null, ''])
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ConfirmationRequestLevel2Model extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new ConfirmationRequestLevel2Model({
      ...data
    })
  }
}
