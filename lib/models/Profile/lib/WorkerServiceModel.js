const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const { AttachmentModel, ServiceCategoryModel } = requireRoot('lib/models/Core')

const schemaFactory = () => ({
  id: Joi.string().allow([null, '']),
  name: Joi.string(),
  category: Joi.object().type(ServiceCategoryModel),
  description: Joi.string(),
  fee: Joi.string(),
  minFee: Joi.string(),
  attachments: Joi.array().items(Joi.object().type(AttachmentModel)).allow(null)
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class WorkerServiceModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }

    return new WorkerServiceModel({
      id: data._id.toString(),
      name: data.name,
      category: ServiceCategoryModel.fromMongo(data.category, context, options),
      description: data.description,
      fee: data.fee,
      minFee: data.minFee,
      attachments: !data.attachments ? null : data.attachments.map(AttachmentModel.fromMongo)
    })
  }
}
