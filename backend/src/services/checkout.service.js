/**
 * CheckoutService — crea la orden a partir del carrito.
 *
 * SEGURIDAD:
 * - Los precios se re-leen de BD, nunca del cuerpo del request.
 * - costoCompra se guarda en order_items pero NUNCA se devuelve al cliente.
 * - El cliente solo ve: subtotal, descuento, envío, total.
 */

const prisma        = require('../config/db')
const AppError      = require('../utils/AppError')
const { calcClienteSummary } = require('../utils/money')
const { validateAndSyncPrices } = require('./cart.service')
const { incrementCouponUses }   = require('./coupon.service')

// ── buildOrderPreview ─────────────────────────────────────────────────────────
// Devuelve el resumen del pedido SIN crearlo. Para mostrar al cliente en checkout.

async function buildOrderPreview(userId) {
  await validateAndSyncPrices(userId)

  const cart = await prisma.cart.findUnique({
    where:   { userId },
    include: {
      items:  { include: { product: { select: { precioVenta: true, name: true, images: true } } } },
      coupon: true,
    },
  })

  const summary = calcClienteSummary(
    cart.items.map(i => ({ precioSnapshot: i.precioSnapshot, quantity: i.quantity })),
    cart.coupon,
  )

  return {
    items: cart.items.map(i => ({
      productId: i.productId,
      name:      i.product.name,
      image:     i.product.images[0] ?? null,
      quantity:  i.quantity,
      precio:    i.precioSnapshot,
      lineTotal: i.precioSnapshot * i.quantity,
    })),
    coupon:  cart.coupon ? { code: cart.coupon.code, label: buildLabel(cart.coupon) } : null,
    ...summary,
  }
}

// ── createOrder ───────────────────────────────────────────────────────────────
// Crea la Order y sus OrderItems. Estado inicial: PENDING.

async function createOrder(userId, shippingData) {
  const warnings = await validateAndSyncPrices(userId)

  const cart = await prisma.cart.findUnique({
    where:   { userId },
    include: {
      items:  {
        include: {
          product: {
            select: {
              id:          true,
              precioVenta: true,
              costoCompra: true, // 🔒 solo para guardar en order_items
              stock:       true,
              activo:      true,
            },
          },
        },
      },
      coupon: true,
    },
  })

  if (!cart || cart.items.length === 0) throw new AppError(400, 'El carrito está vacío')

  const summary = calcClienteSummary(
    cart.items.map(i => ({ precioSnapshot: i.precioSnapshot, quantity: i.quantity })),
    cart.coupon,
  )

  // Crear orden en una transacción para garantizar atomicidad
  const order = await prisma.$transaction(async (tx) => {
    // 1. Crear orden
    const newOrder = await tx.order.create({
      data: {
        userId,
        cartId:            cart.id,
        couponId:          cart.couponId,
        status:            'PENDING',
        subtotalPesos:     summary.subtotalPesos,
        descuentoPesos:    summary.descuentoPesos,
        envioPesos:        summary.envioPesos,
        totalClientePesos: summary.totalClientePesos,
        // Datos de envío
        address:    shippingData.address,
        city:       shippingData.city,
        department: shippingData.department,
        zip:        shippingData.zip    ?? null,
        phone:      shippingData.phone  ?? null,
        notes:      shippingData.notes  ?? null,
        // OrderItems
        items: {
          create: cart.items.map(i => ({
            productId:           i.productId,
            quantity:            i.quantity,
            precioVentaSnapshot: i.precioSnapshot,
            costoCompraSnapshot: i.product.costoCompra, // 🔒 interno
          })),
        },
      },
      include: {
        items: {
          select: {
            id:                  true,
            productId:           true,
            quantity:            true,
            precioVentaSnapshot: true,
            // costoCompraSnapshot: false ← nunca en la respuesta pública
          },
        },
      },
    })

    // 2. Reservar stock (decrement optimista)
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data:  { stock: { decrement: item.quantity } },
      })
    }

    // 3. Crear registro de pago en PENDING
    await tx.payment.create({
      data: {
        orderId:    newOrder.id,
        amountPesos: summary.totalClientePesos,
        status:     'PENDING',
      },
    })

    return newOrder
  })

  // 4. Incrementar uso del cupón
  if (cart.couponId) await incrementCouponUses(cart.couponId)

  return {
    orderId:           order.id,
    subtotalPesos:     summary.subtotalPesos,
    descuentoPesos:    summary.descuentoPesos,
    envioPesos:        summary.envioPesos,
    totalClientePesos: summary.totalClientePesos,
    coupon:            cart.coupon ? { code: cart.coupon.code } : null,
    warnings,
  }
}

// ── getOrderForClient ─────────────────────────────────────────────────────────
// Devuelve una orden SIN datos internos de rentabilidad.

async function getOrderForClient(orderId, userId) {
  const order = await prisma.order.findFirst({
    where:   { id: orderId, userId },
    include: {
      items: {
        select: {
          id:                  true,
          productId:           true,
          quantity:            true,
          precioVentaSnapshot: true,
          // costoCompraSnapshot: false
          product: {
            select: { name: true, images: true, slug: true },
          },
        },
      },
      payment: {
        select: { status: true, wompiTransactionId: true },
      },
      coupon: {
        select: { code: true, type: true, value: true },
      },
    },
  })

  if (!order) throw new AppError(404, 'Orden no encontrada')

  return {
    id:                order.id,
    status:            order.status,
    subtotalPesos:     order.subtotalPesos,
    descuentoPesos:    order.descuentoPesos,
    envioPesos:        order.envioPesos,
    totalClientePesos: order.totalClientePesos,
    address:           order.address,
    city:              order.city,
    createdAt:         order.createdAt,
    paidAt:            order.paidAt,
    coupon:            order.coupon ? { code: order.coupon.code } : null,
    payment:           order.payment ? { status: order.payment.status } : null,
    items:             order.items.map(i => ({
      id:        i.id,
      productId: i.productId,
      name:      i.product.name,
      image:     i.product.images[0] ?? null,
      slug:      i.product.slug,
      quantity:  i.quantity,
      precio:    i.precioVentaSnapshot,
      lineTotal: i.precioVentaSnapshot * i.quantity,
    })),
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

function buildLabel(coupon) {
  if (coupon.type === 'PERCENT')  return `${coupon.value}% de descuento`
  if (coupon.type === 'FIXED')    return `$${coupon.value.toLocaleString('es-CO')} de descuento`
  if (coupon.type === 'SHIPPING') return 'Envío gratis'
  return ''
}

module.exports = {
  buildOrderPreview,
  createOrder,
  getOrderForClient,
}
