const router = require('express').Router()
const ctrl   = require('../controllers/payment.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)
router.post('/:orderId',  ctrl.processPayment)
router.get('/:orderId',   ctrl.getPayment)

module.exports = router
