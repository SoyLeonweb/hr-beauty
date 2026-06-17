const { PrismaClient } = require('@prisma/client')
const AppError = require('../utils/AppError')

const prisma = new PrismaClient()

/** Simulate payment processing (replace with Wompi/PayU SDK calls) */
const processPayment = async (orderId, paymentData) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new AppError('Pedido no encontrado', 404)
  if (order.status !== 'pending') throw new AppError('El pedido ya fue procesado', 400)

  // TODO: integrate real payment gateway here
  const paymentRecord = await prisma.payment.create({
    data: {
      orderId,
      amount:   order.total,
      method:   paymentData.method || order.paymentMethod,
      status:   'completed',
      reference: `PAY-${Date.now()}`,
    }
  })

  await prisma.order.update({ where: { id: orderId }, data: { status: 'processing' } })
  return paymentRecord
}

const getPaymentByOrder = async (orderId) => {
  return prisma.payment.findFirst({ where: { orderId } })
}

module.exports = { processPayment, getPaymentByOrder }
