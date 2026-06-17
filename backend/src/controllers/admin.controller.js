const profitSvc = require('../services/profit.service')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getProfitSummary = async (req, res, next) => {
  try {
    const summary = await profitSvc.getSummary(req.query)
    res.json({ ok: true, data: summary })
  } catch (e) { next(e) }
}

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [orderCount, userCount, productCount, profit] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      profitSvc.getSummary(),
    ])
    res.json({ ok: true, data: { orderCount, userCount, productCount, ...profit } })
  } catch (e) { next(e) }
}
