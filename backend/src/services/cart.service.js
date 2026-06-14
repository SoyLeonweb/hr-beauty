/**
 * CartService — lógica del carrito de compras.
 *
 * SEGURIDAD: nunca devolvemos costoCompra ni datos internos al cliente.
 * Los precios SIEMPRE se leen de la BD; nunca se confía en lo que envía el cliente.
 */

const prisma = require('../config/db')
const AppError = require('../utils/AppError')
const { calcClienteSummary } = require('../utils/money')

// ── Selects seguros (sin costoCompra) ────────────────────────────────────────

const PRODUCT_SELECT_PUBLIC = {
  id:          true,
  name:        true,
  slug:        true,
  marca:       true,
  tipo:        true,
  images:      true,
  precioVenta: true,
  stock:       true,
  activo:      true,
  // costoCompra: false  ← nunca
}

const CART_ITEM_INCLUDE_PUBLIC = {
  product: { select: PRODUCT_SELECT_PUBLIC },
}

// ── Helper: obtener o crear carrito del usuario ───────────────────────────────

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: CART_ITEM_INCLUDE_PUBLIC }, coupon: true },
  })
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: CART_ITEM_INCLUDE_PUBLIC }, coupon: true },
    })
  }
  return cart
}

// ── Helper: formatear carrito para respuesta al cliente ───────────────────────

function formatCart(cart) {
  const items = cart.items.map(item => ({
    id:             item.id,
    productId:      item.productId,
    quantity:       item.quantity,
    precioSnapshot: item.precioSnapshot,
    lineTotal:      item.precioSnapshot * item.quantity,
    product: {
      id:     item.product.id,
      name:   item.product.name,
      slug:   item.product.slug,
      marca:  item.product.marca,
      tipo:   item.product.tipo,
      images: item.product.images,
      stock:  item.product.stock,
      // precioVenta también va aquí para mostrar si cambió vs snapshot
      precioVenta: item.product.precioVenta,
    },
  }))

  const summary = calcClienteSummary(
    cart.items.map(i => ({ precioSnapshot: i.precioSnapshot, quantity: i.quantity })),
    cart.coupon,
  )

  return {
    id:       cart.id,
    coupon:   cart.coupon ? { code: cart.coupon.code, type: cart.coupon.type, value: cart.coupon.value } : null,
    items,
    ...summary,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  }
}

// ── getCart ───────────────────────────────────────────────────────────────────

async function getCart(userId) {
  const cart = await getOrCreateCart(userId)
  return formatCart(cart)
}

// ── addItem ───────────────────────────────────────────────────────────────────

async function addItem(userId, productId, qty = 1) {
  if (qty < 1) throw new AppError(400, 'La cantidad debe ser mayor a 0')

  // 1. Validar producto desde BD (nunca desde el cliente)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: PRODUCT_SELECT_PUBLIC,
  })
  if (!product)        throw new AppError(404, 'Producto no encontrado')
  if (!product.activo) throw new AppError(400, 'Producto no disponible')

  const cart = await getOrCreateCart(userId)

  // 2. Verificar stock
  const existing = cart.items.find(i => i.productId === productId)
  const newQty   = (existing?.quantity ?? 0) + qty
  if (newQty > product.stock) {
    throw new AppError(409, `Stock insuficiente. Disponible: ${product.stock}`)
  }

  // 3. Upsert — precio se toma SIEMPRE de la BD
  await prisma.cartItem.upsert({
    where:  { cartId_productId: { cartId: cart.id, productId } },
    create: {
      cartId,
      productId,
      quantity:       qty,
      precioSnapshot: product.precioVenta, // precio de BD, no del cliente
    },
    update: { quantity: { increment: qty } },
  })

  // 4. Retornar carrito actualizado
  const updated = await prisma.cart.findUnique({
    where:   { userId },
    include: { items: { include: CART_ITEM_INCLUDE_PUBLIC }, coupon: true },
  })
  return formatCart(updated)
}

// ── removeItem ────────────────────────────────────────────────────────────────

async function removeItem(userId, cartItemId) {
  const cart = await getOrCreateCart(userId)

  const item = cart.items.find(i => i.id === cartItemId)
  if (!item) throw new AppError(404, 'Item no encontrado en el carrito')

  await prisma.cartItem.delete({ where: { id: cartItemId } })

  const updated = await prisma.cart.findUnique({
    where:   { userId },
    include: { items: { include: CART_ITEM_INCLUDE_PUBLIC }, coupon: true },
  })
  return formatCart(updated)
}

// ── updateQty ─────────────────────────────────────────────────────────────────

async function updateQty(userId, cartItemId, qty) {
  if (qty < 0) throw new AppError(400, 'Cantidad inválida')

  // qty === 0 → eliminar
  if (qty === 0) return removeItem(userId, cartItemId)

  const cart = await getOrCreateCart(userId)
  const item = cart.items.find(i => i.id === cartItemId)
  if (!item) throw new AppError(404, 'Item no encontrado en el carrito')

  // Validar stock
  const product = await prisma.product.findUnique({
    where:  { id: item.productId },
    select: { stock: true, activo: true },
  })
  if (!product.activo)    throw new AppError(400, 'Producto no disponible')
  if (qty > product.stock) throw new AppError(409, `Stock insuficiente. Disponible: ${product.stock}`)

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data:  { quantity: qty },
  })

  const updated = await prisma.cart.findUnique({
    where:   { userId },
    include: { items: { include: CART_ITEM_INCLUDE_PUBLIC }, coupon: true },
  })
  return formatCart(updated)
}

// ── clearCart ─────────────────────────────────────────────────────────────────

async function clearCart(userId) {
  const cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) return

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  await prisma.cart.update({
    where: { id: cart.id },
    data:  { couponId: null },
  })
}

// ── Validar precios (anti-manipulación) ──────────────────────────────────────
// Verifica que los precioSnapshot del carrito coincidan con los precios actuales.
// Útil al iniciar checkout. Si hay discrepancias, actualiza los snapshots.

async function validateAndSyncPrices(userId) {
  const cart = await prisma.cart.findUnique({
    where:   { userId },
    include: { items: { include: { product: { select: { precioVenta: true, activo: true, stock: true } } } } },
  })
  if (!cart || cart.items.length === 0) throw new AppError(400, 'El carrito está vacío')

  const warnings = []

  for (const item of cart.items) {
    if (!item.product.activo) {
      throw new AppError(400, `El producto ya no está disponible`)
    }
    if (item.quantity > item.product.stock) {
      throw new AppError(409, `Stock insuficiente para uno de los productos`)
    }
    // Si el precio cambió, actualizar el snapshot
    if (item.precioSnapshot !== item.product.precioVenta) {
      await prisma.cartItem.update({
        where: { id: item.id },
        data:  { precioSnapshot: item.product.precioVenta },
      })
      warnings.push(`Precio actualizado para el producto #${item.productId}`)
    }
  }

  return warnings
}

module.exports = {
  getCart,
  addItem,
  removeItem,
  updateQty,
  clearCart,
  validateAndSyncPrices,
  getOrCreateCart,
  formatCart,
}
