const jwt    = require('jsonwebtoken')
const prisma = require('../config/db')

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No autorizado' })
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } })
    next()
  } catch { res.status(401).json({ message: 'Token inválido' }) }
}

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Acceso denegado' })
  next()
}

module.exports = { protect, isAdmin }
