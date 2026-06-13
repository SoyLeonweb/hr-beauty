const prisma = require('../config/db')

exports.create = async (req, res, next) => {
  try {
    const { items, address } = req.body
    const total = items.reduce((s, i) => s + i.price * i.qty, 0)
    const order = await prisma.order.create({
      data: { userId: req.user.id, address, total, items: { create: items } },
      include: { items: true }
    })
    res.status(201).json(order)
  } catch (e) { next(e) }
}

exports.getMyOrders = async (req, res, next) => {
  try { res.json(await prisma.order.findMany({ where: { userId: req.user.id }, include: { items: { include: { product: true } } } })) }
  catch (e) { next(e) }
}

exports.getById = async (req, res, next) => {
  try {
    const o = await prisma.order.findUnique({ where: { id: +req.params.id }, include: { items: { include: { product: true } } } })
    if (!o || o.userId !== req.user.id) return res.status(404).json({ message: 'Pedido no encontrado' })
    res.json(o)
  } catch (e) { next(e) }
}
