const Joi = require('joi')
const { ValidationError } = requireRoot('./lib/errors')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'AbstractModel'
})

module.exports = class AbstractModel {
  constructor (data, schema, options = {}) {
    try {
      const { error, value } = Joi.validate(
        (data instanceof Function) ? data(this) : data,
        (schema instanceof Function) ? schema() : schema,
        options
      )
      if (error) {
        throw new ValidationError(`[${this.constructor.name}].${error}`)
      }
      Object.assign(this, value)
    } catch (e) {
      log.debug(e.message, e.stack, data)
      throw e
    }
  }

  static buildArray (array, buildItem, context) {
    return array == null
      ? null
      : array.map(item => buildItem(item, context))
  }
}
