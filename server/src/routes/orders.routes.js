const router = require('express').Router()
const ctrl   = require('../controllers/orders.controller')
const { protect } = require('../middleware/auth.middleware')
router.use(protect)
router.get('/me',  ctrl.getMyOrders)
router.get('/:id', ctrl.getById)
router.post('/',   ctrl.create)
module.exports = router
