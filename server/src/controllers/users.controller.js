const prisma = require('../config/db')
exports.getAll = async (req, res, next) => {
  try { res.json(await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } })) }
  catch (e) { next(e) }
}
