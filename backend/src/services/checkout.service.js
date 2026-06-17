const { PrismaClient } = require('@prisma/client')
const AppError  = require('../utils/AppError')
const cartSvc   = require('./cart.service')
const couponSvc = require('./coupon.service')

const prisma = new PrismaClient()

const createOrder = async (userId, { shippingAddress, couponCode, paymentMethod }) => {
  const cart = await cartSvc.getCart(userId)
  if (!cart.items.length) throw new AppError('El carrito está vacío', 400)

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  let discount = 0
  let couponId = null

  if (couponCode) {
    const result = await couponSvc.validate(couponCode, subtotal)
    discount = result.discount
    couponId = result.coupon.id
    await couponSvc.redeem(couponId)
  }

  const shippingCost = subtotal >= 80000 ? 0 : 8000
  const total = subtotal - discount + shippingCost

  const order = await prisma.order.create({
    data: {
      userId,
      subtotal,
      discount,
      shippingCost,
      total,
      couponId,
      paymentMethod,
      shippingAddress,
      status: 'pending',
      items: {
        create: cart.items.map(i => ({
          productId: i.productId,
          quantity:  i.quantity,
          price:     i.price,
        }))
      }
    },
    include: { items: true }
  })

  await cartSvc.clearCart(userId)
  return order
}

module.exports = { createOrder }
