/**
 * AppError — error operacional con código HTTP.
 * Se distingue de errores de programación (bugs) para que
 * el errorHandler los maneje correctamente.
 */
class AppError extends Error {
  /**
   * @param {number} status  - código HTTP (400, 401, 403, 404, 409, 422...)
   * @param {string} message - mensaje legible para el cliente
   */
  constructor(status, message) {
    super(message)
    this.status      = status
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
