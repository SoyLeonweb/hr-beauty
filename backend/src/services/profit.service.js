const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getSummary = async ({ from, to } = {}) => {
  const where = { status: { in: ['processing', 'shipped', 'delivered'] } }
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from)
    if (to)   where.createdAt.lte = new Date(to)
  }

  const orders = await prisma.order.findMany({ where, include: { items: { include: { product: true } } } })

  const totalRevenue  = orders.reduce((s, o) => s + o.total, 0)
  const totalDiscount = orders.reduce((s, o) => s + o.discount, 0)
  const totalShipping = orders.reduce((s, o) => s + o.shippingCost, 0)

  // Estimated cost: 50% of product subtotal
  const totalCost = orders.reduce((s, o) => s + o.subtotal * 0.5, 0)
  const grossProfit = totalRevenue - totalCost
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

  return {
    orderCount: orders.length,
    totalRevenue,
    totalDiscount,
    totalShipping,
    totalCost: Math.round(totalCost),
    grossProfit: Math.round(grossProfit),
    margin: Math.round(margin * 100) / 100,
  }
}

module.exports = { getSummary }
