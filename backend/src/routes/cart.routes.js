const router  = require('express').Router()
const { z }   = require('zod')
const { protect }     = require('../middleware/auth.middleware')
const { validate }    = require('../middleware/validate.middleware')
const ctrl            = require('../controllers/cart.controller')

// Todos los endpoints del carrito requieren auth
router.use(protect)

// GET  /api/cart
router.get('/', ctrl.getCart)

// POST /api/cart/items
router.post('/items',
  validate(z.object({
    productId: z.number().int().positive(),
    quantity:  z.number().int().min(1).max(99).optional(),
  })),
  ctrl.addItem,
)

// PATCH /api/cart/items/:itemId
router.patch('/items/:itemId',
  validate(z.object({ quantity: z.number().int().min(0).max(99) })),
  ctrl.updateQty,
)

// DELETE /api/cart/items/:itemId
router.delete('/items/:itemId', ctrl.removeItem)

// DELETE /api/cart
router.delete('/', ctrl.clearCart)

// POST /api/cart/coupon
router.post('/coupon',
  validate(z.object({ code: z.string().min(1).max(50) })),
  ctrl.applyCoupon,
)

// DELETE /api/cart/coupon
router.delete('/coupon', ctrl.removeCoupon)

module.exports = router
