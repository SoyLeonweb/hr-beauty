/**
 * PaymentService — integración con Wompi (Colombia).
 *
 * Wompi docs: https://docs.wompi.co
 *
 * Flujo:
 * 1. initTransaction   → crea transacción en Wompi, devuelve URL de pago
 * 2. handleWebhook     → Wompi llama a nuestro endpoint; verificamos firma HMAC
 *                        Si APPROVED → confirmOrder + calcAndSave(profit)
 *                        Si DECLINED → cancelOrder + releaseStock
 */

const crypto       = require('crypto')
const prisma       = require('../config/db')
const AppError     = require('../utils/AppError')
const profitService = require('./profit.service')
const cartService   = require('./cart.service')

const WOMPI_PUBLIC_KEY  = process.env.WOMPI_PUBLIC_KEY  || ''
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY || ''
const WOMPI_EVENTS_KEY  = process.env.WOMPI_EVENTS_KEY  || '' // para verificar webhooks
const WOMPI_BASE_URL    = 'https://production.wompi.co/v1'    // staging: sandbox.wompi.co

// ── initTransaction ───────────────────────────────────────────────────────────

async function initTransaction(orderId, userId) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, status: 'PENDING' },
    include: { payment: true, user: { select: { email: true, name: true, phone: true } } },
  })

  if (!order) throw new AppError(404, 'Orden no encontrada o ya procesada')
  if (order.payment?.status === 'APPROVED') throw new AppError(409, 'Esta orden ya fue pagada')

  // Construir referencia única
  const reference = `HRBEAUTY-${order.id}-${Date.now()}`

  // Wompi trabaja en centavos
  const amountInCents = order.totalClientePesos * 100

  // Construir el objeto de transacción para Wompi
  // En producción: POST https://production.wompi.co/v1/transactions
  // Aquí retornamos el objeto para que el frontend lo use con el widget de Wompi
  const transactionData = {
    public_key:        WOMPI_PUBLIC_KEY,
    currency:          'COP',
    amount_in_cents:   amountInCents,
    reference,
    customer_email:    order.user.email,
    customer_data: {
      full_name:    order.user.name,
      phone_number: order.user.phone ?? '',
    },
    redirect_url: `${process.env.CLIENT_URL}/orden/${order.id}/confirmacion`,
  }

  // Actualizar payment con la referencia
  await prisma.payment.update({
    where: { orderId },
    data:  { wompiTransactionId: reference },
  })

  return {
    orderId:          order.id,
    reference,
    amountInCents,
    totalClientePesos: order.totalClientePesos,
    wompiPublicKey:   WOMPI_PUBLIC_KEY,
    transactionData,  // el frontend usa esto para renderizar el widget de Wompi
  }
}

// ── handleWebhook ─────────────────────────────────────────────────────────────

async function handleWebhook(rawBody, signature) {
  // 1. Verificar firma HMAC-SHA256
  verifyWompiSignature(rawBody, signature)

  const payload = JSON.parse(rawBody)
  const event   = payload?.event
  const data    = payload?.data?.transaction

  if (event !== 'transaction.updated') return { handled: false }
  if (!data) throw new AppError(400, 'Payload de webhook inválido')

  const { reference, status, id: wompiId } = data

  // 2. Buscar el pago por referencia
  const payment = await prisma.payment.findFirst({
    where:   { wompiTransactionId: reference },
    include: { order: { include: { items: true, user: { select: { id: true } } } } },
  })

  if (!payment) {
    console.warn(`[Webhook] Referencia no encontrada: ${reference}`)
    return { handled: false }
  }

  // 3. Guardar payload crudo para auditoría
  await prisma.payment.update({
    where: { id: payment.id },
    data:  { webhookPayload: payload },
  })

  // 4. Procesar según el estado de Wompi
  if (status === 'APPROVED') {
    await handleApproved(payment, wompiId)
  } else if (['DECLINED', 'VOIDED', 'ERROR'].includes(status)) {
    await handleDeclined(payment)
  }
  // PENDING → no hacer nada, esperar próximo webhook

  return { handled: true, status }
}

// ── handleApproved (interno) ──────────────────────────────────────────────────

async function handleApproved(payment, wompiId) {
  const orderId = payment.orderId

  await prisma.$transaction(async (tx) => {
    // Actualizar pago
    await tx.payment.update({
      where: { id: payment.id },
      data:  { status: 'APPROVED', wompiTransactionId: wompiId ?? payment.wompiTransactionId },
    })
    // Confirmar orden
    await tx.order.update({
      where: { id: orderId },
      data:  { status: 'PAID', paidAt: new Date() },
    })
    // Marcar carrito como merged
    if (payment.order.cartId) {
      await tx.cart.update({
        where: { id: payment.order.cartId },
        data:  { status: 'MERGED' },
      })
    }
  })

  // Calcular y guardar rentabilidad 🔒
  await profitService.calcAndSave(orderId)

  console.log(`[Payment] Orden #${orderId} APROBADA por Wompi`)
}

// ── handleDeclined (interno) ──────────────────────────────────────────────────

async function handleDeclined(payment) {
  const orderId = payment.orderId

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data:  { status: 'DECLINED' },
    })
    await tx.order.update({
      where: { id: orderId },
      data:  { status: 'CANCELLED' },
    })
    // Restaurar stock
    for (const item of payment.order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data:  { stock: { increment: item.quantity } },
      })
    }
  })

  console.log(`[Payment] Orden #${orderId} RECHAZADA por Wompi — stock restaurado`)
}

// ── verifyWompiSignature ──────────────────────────────────────────────────────

function verifyWompiSignature(rawBody, signature) {
  if (!WOMPI_EVENTS_KEY) {
    console.warn('[Webhook] WOMPI_EVENTS_KEY no configurada — saltando verificación')
    return
  }
  const expected = crypto
    .createHmac('sha256', WOMPI_EVENTS_KEY)
    .update(rawBody)
    .digest('hex')

  if (expected !== signature) {
    throw new AppError(401, 'Firma de webhook inválida')
  }
}

module.exports = { initTransaction, handleWebhook }
