/**
 * AdminController 🔒
 * Solo accesible con protect + isAdmin middleware.
 * Nunca retorna datos internos a usuarios no-admin.
 */

const profitService = require('../services/profit.service')
const prisma        = require('../config/db')

// GET /admin/profit — resumen de rentabilidad
const getProfitSummary = async (req, res, next) => {
  try {
    const { desde, hasta, limit = 50, offset = 0 } = req.query
    const data = await profitService.getSummary({
      desde,
      hasta,
      limit:  parseInt(limit),
      offset: parseInt(offset),
    })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /admin/orders — listado de órdenes con totales internos
const getOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    const where = {}
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take:    parseInt(limit),
        skip:    parseInt(offset),
        include: {
          user:      { select: { id: true, name: true, email: true } },
          payment:   { select: { status: true, wompiTransactionId: true } },
          profitLog: true,  // 🔒 solo admin puede ver esto
        },
      }),
      prisma.order.count({ where }),
    ])

    res.json({ success: true, total, data: orders })
  } catch (err) { next(err) }
}

// GET /admin/products — con costoCompra visible para admin
const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
      // costoCompra SÍ se incluye porque es admin
    })
    res.json({ success: true, data: products })
  } catch (err) { next(err) }
}

// PATCH /admin/products/:id — actualizar precio/costo
const updateProduct = async (req, res, next) => {
  try {
    const { precioVenta, costoCompra, stock, activo } = req.body
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data:  {
        ...(precioVenta !== undefined && { precioVenta }),
        ...(costoCompra !== undefined && { costoCompra }),
        ...(stock       !== undefined && { stock       }),
        ...(activo      !== undefined && { activo      }),
      },
    })
    res.json({ success: true, data: product })
  } catch (err) { next(err) }
}

// POST /admin/coupons — crear cupón
const createCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minOrderPesos, maxUses, expiresAt } = req.body
    const coupon = await prisma.coupon.create({
      data: {
        code:         code.toUpperCase().trim(),
        type,
        value,
        minOrderPesos: minOrderPesos ?? 0,
        maxUses:      maxUses       ?? null,
        expiresAt:    expiresAt     ? new Date(expiresAt) : null,
      },
    })
    res.status(201).json({ success: true, data: coupon })
  } catch (err) { next(err) }
}

module.exports = { getProfitSummary, getOrders, getProducts, updateProduct, createCoupon }
