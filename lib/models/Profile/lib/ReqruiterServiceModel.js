const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { AttachmentModel } = requireRoot('lib/models/Core')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  name: Joi.string(),
  description: Joi.string(),
  fee: Joi.string(),
  attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ReqruiterServiceModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    return new ReqruiterServiceModel({
      id: data._id.toString(),
      name: data.name,
      description: data.description,
      fee: data.fee,
      attachments: !data.attachments ? null : data.attachments.map(AttachmentModel.fromMongo)
    })
  }
}
