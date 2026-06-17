const router = require('express').Router()

router.use('/auth',     require('./auth.routes'))
router.use('/products', require('./products.routes'))
router.use('/orders',   require('./orders.routes'))
router.use('/users',    require('./users.routes'))
router.use('/cart',     require('./cart.routes'))
router.use('/checkout', require('./checkout.routes'))
router.use('/payment',  require('./payment.routes'))
router.use('/admin',    require('./admin.routes'))

module.exports = router
