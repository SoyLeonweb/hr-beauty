const router = require('express').Router()
const ctrl   = require('../controllers/checkout.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)
router.post('/', ctrl.createOrder)

module.exports = router
