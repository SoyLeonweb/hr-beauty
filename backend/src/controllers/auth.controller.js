const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const prisma = require('../config/db')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hash } })
    res.status(201).json({ token: signToken(user.id), user: { id: user.id, name, email } })
  } catch (e) { next(e) }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    res.json({ token: signToken(user.id), user: { id: user.id, name: user.name, email, role: user.role } })
  } catch (e) { next(e) }
}

exports.me = async (req, res) => res.json(req.user)
