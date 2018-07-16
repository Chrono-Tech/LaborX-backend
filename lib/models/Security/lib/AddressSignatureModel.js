const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')
const schemaFactory = () => Joi.object().keys({
	addresses: Joi.array().items(Joi.object().keys({
		type: Joi.string().allow([null, '']),
		value: Joi.string().lowercase().allow([null, ''])
	}))
})
module.exports.schemaFactory = schemaFactory
module.exports.model = class AddressSignatureModel extends AbstractModel {
	constructor (data, options) {
		super(data, schemaFactory, options)
		Object.freeze(this)
	}

	static fromJson (data) {
		return new AddressSignatureModel(data)
	}
}