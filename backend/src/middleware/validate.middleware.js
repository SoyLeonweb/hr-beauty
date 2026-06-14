/**
 * validate — middleware de validación con Zod.
 * Lanza AppError(422) si el body no pasa el schema.
 */
const AppError = require('../utils/AppError')

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const message = result.error.errors
      .map(e => `${e.path.join('.')}: ${e.message}`)
      .join(', ')
    return next(new AppError(422, message))
  }
  req.body = result.data // datos limpios y tipados
  next()
}

module.exports = { validate }
