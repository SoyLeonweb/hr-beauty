const prisma = require('../config/db')

exports.getAll = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 16 } = req.query
    const where = {}
    if (category) where.category = { slug: category }
    if (minPrice || maxPrice) where.price = { gte: +minPrice || 0, lte: +maxPrice || 9999 }
    const orderBy = sort === 'price_asc'  ? { price: 'asc' }
                  : sort === 'price_desc' ? { price: 'desc' }
                  : sort === 'rating'     ? { rating: 'desc' }
                  : { createdAt: 'desc' }
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip: (+page - 1) * +limit, take: +limit, include: { category: true } }),
      prisma.product.count({ where })
    ])
    res.json({ products, total, pages: Math.ceil(total / +limit), page: +page })
  } catch (e) { next(e) }
}

exports.getFeatured = async (req, res, next) => {
  try { res.json(await prisma.product.findMany({ where: { featured: true }, take: 8, include: { category: true } })) }
  catch (e) { next(e) }
}

exports.getById = async (req, res, next) => {
  try {
    const p = await prisma.product.findUnique({ where: { id: +req.params.id }, include: { category: true } })
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(p)
  } catch (e) { next(e) }
}

exports.create = async (req, res, next) => {
  try { res.status(201).json(await prisma.product.create({ data: req.body })) }
  catch (e) { next(e) }
}

exports.update = async (req, res, next) => {
  try { res.json(await prisma.product.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { next(e) }
}

exports.remove = async (req, res, next) => {
  try { await prisma.product.delete({ where: { id: +req.params.id } }); res.status(204).end() }
  catch (e) { next(e) }
}
