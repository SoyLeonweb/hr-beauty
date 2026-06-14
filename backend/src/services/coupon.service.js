/**
 * CouponService — validación y aplicación de cupones.
 */

const prisma   = require('../config/db')
const AppError = require('../utils/AppError')

// ── validateCoupon ────────────────────────────────────────────────────────────

async function validateCoupon(code, subtotalPesos) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } })

  if (!coupon)         throw new AppError(404, 'Cupón no encontrado')
  if (!coupon.activo)  throw new AppError(400, 'Este cupón ya no está activo')
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new AppError(400, 'Este cupón ha expirado')
  }
  if (coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses) {
    throw new AppError(400, 'Este cupón ha alcanzado su límite de usos')
  }
  if (subtotalPesos < coupon.minOrderPesos) {
    throw new AppError(400, `Compra mínima para este cupón: $${coupon.minOrderPesos.toLocaleString('es-CO')}`)
  }

  return {
    id:    coupon.id,
    code:  coupon.code,
    type:  coupon.type,
    value: coupon.value,
    label: buildLabel(coupon),
  }
}

// ── applyCoupon (al carrito) ──────────────────────────────────────────────────

async function applyCouponToCart(userId, code) {
  const prismaCart = await prisma.cart.findUnique({
    where:   { userId },
    include: { items: true },
  })
  if (!prismaCart)             throw new AppError(400, 'Carrito no encontrado')
  if (prismaCart.items.length === 0) throw new AppError(400, 'El carrito está vacío')

  const subtotal = prismaCart.items.reduce(
    (acc, i) => acc + i.precioSnapshot * i.quantity,
    0,
  )

  const coupon = await validateCoupon(code, subtotal)

  await prisma.cart.update({
    where: { id: prismaCart.id },
    data:  { couponId: coupon.id },
  })

  return coupon
}

// ── removeCoupon ──────────────────────────────────────────────────────────────

async function removeCouponFromCart(userId) {
  await prisma.cart.update({
    where: { userId },
    data:  { couponId: null },
  })
}

// ── incrementUsesCount (al confirmar pago) ────────────────────────────────────

async function incrementCouponUses(couponId) {
  if (!couponId) return
  await prisma.coupon.update({
    where: { id: couponId },
    data:  { usesCount: { increment: 1 } },
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLabel(coupon) {
  if (coupon.type === 'PERCENT')  return `${coupon.value}% de descuento`
  if (coupon.type === 'FIXED')    return `$${coupon.value.toLocaleString('es-CO')} de descuento`
  if (coupon.type === 'SHIPPING') return 'Envío gratis'
  return ''
}

module.exports = {
  validateCoupon,
  applyCouponToCart,
  removeCouponFromCart,
  incrementCouponUses,
}
