const { PrismaClient } = require('@prisma/client')
const AppError = require('../utils/AppError')
const { applyDiscount } = require('../utils/money')

const prisma = new PrismaClient()

const validate = async (code, subtotal) => {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
  if (!coupon)              throw new AppError('Cupón no válido', 400)
  if (!coupon.active)       throw new AppError('Cupón inactivo', 400)
  if (coupon.usedCount >= coupon.maxUses) throw new AppError('Cupón agotado', 400)
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError('Cupón expirado', 400)

  const discount = subtotal - applyDiscount(subtotal, { type: coupon.type, value: coupon.value })
  return { coupon, discount, total: subtotal - discount }
}

const redeem = async (couponId) => {
  return prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } })
}

module.exports = { validate, redeem }
