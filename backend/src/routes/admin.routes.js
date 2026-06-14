const router  = require('express').Router()
const { z }   = require('zod')
const { protect, isAdmin } = require('../middleware/auth.middleware')
const { validate }         = require('../middleware/validate.middleware')
const ctrl                 = require('../controllers/admin.controller')

// Todos los endpoints admin requieren auth + rol ADMIN
router.use(protect, isAdmin)

// GET  /api/admin/profit
router.get('/profit', ctrl.getProfitSummary)

// GET  /api/admin/orders
router.get('/orders', ctrl.getOrders)

// GET  /api/admin/products
router.get('/products', ctrl.getProducts)

// PATCH /api/admin/products/:id
router.patch('/products/:id',
  validate(z.object({
    precioVenta: z.number().int().positive().optional(),
    costoCompra: z.number().int().min(0).optional(),
    stock:       z.number().int().min(0).optional(),
    activo:      z.boolean().optional(),
  })),
  ctrl.updateProduct,
)

// POST /api/admin/coupons
router.post('/coupons',
  validate(z.object({
    code:          z.string().min(3).max(50),
    type:          z.enum(['PERCENT', 'FIXED', 'SHIPPING']),
    value:         z.number().int().min(0),
    minOrderPesos: z.number().int().min(0).optional(),
    maxUses:       z.number().int().positive().optional(),
    expiresAt:     z.string().datetime().optional(),
  })),
  ctrl.createCoupon,
)

module.exports = router
