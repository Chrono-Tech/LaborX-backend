const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
// const PersonModel = require('PersonModel').model

const schemaFactory = () => ({
  type: Joi.string().allow(['organization', 'entrepreneur']).required(),
  info: Joi.object({
    name: Joi.string(),
    registeredAt: Joi.date(),
    website: Joi.string(),
    email: Joi.string()
  }),
  staff: Joi.array().item(
    Joi.object({
      id: Joi.string().required(),
      person: Joi.PersonModel
    })
  ),
  currency: Joi.object({
    lhus: Joi.boolean(),
    bitcoin: Joi.boolean(),
    another: Joi.boolean()
  }),
  attachments: Joi.array().items(Joi.string())
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class LaborXRequestClientModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new LaborXRequestClientModel({
      ...data,
      info: !data.info ? null : {
        ...data.info,
        registeredAt: new Date(data.info.registeredAt)
      }
      // staff: !data.staff ?
    })
  }
}
