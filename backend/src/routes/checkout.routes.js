const router  = require('express').Router()
const { z }   = require('zod')
const { protect }  = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const ctrl         = require('../controllers/checkout.controller')

router.use(protect)

// GET  /api/checkout/preview
router.get('/preview', ctrl.preview)

// POST /api/checkout
router.post('/',
  validate(z.object({
    address:    z.string().min(5),
    city:       z.string().min(2),
    department: z.string().min(2),
    zip:        z.string().optional(),
    phone:      z.string().optional(),
    notes:      z.string().optional(),
  })),
  ctrl.createOrder,
)

// GET  /api/checkout/orders/:id
router.get('/orders/:id', ctrl.getOrder)

// POST /api/checkout/orders/:id/pay
router.post('/orders/:id/pay', ctrl.initPayment)

module.exports = router
