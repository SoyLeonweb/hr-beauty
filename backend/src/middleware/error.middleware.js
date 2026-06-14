const errorHandler = function (err, req, res, next) {
  // Errores operacionales conocidos (AppError)
  if (err.isOperational) {
    return res.status(err.status).json({ success: false, message: err.message })
  }

  // Error de Prisma: registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Registro no encontrado' })
  }

  // Error de Prisma: violación de constraint único
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Ya existe un registro con esos datos' })
  }

  // Error inesperado — no revelar detalles en producción
  console.error('[ERROR]', err)
  var message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : err.message

  res.status(500).json({ success: false, message: message })
}

module.exports = { errorHandler }
