const router = require('express').Router()
const ctrl   = require('../controllers/cart.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)
router.get('/',                  ctrl.getCart)
router.post('/items',            ctrl.addItem)
router.patch('/items/:itemId',   ctrl.updateItem)
router.delete('/items/:itemId',  ctrl.removeItem)
router.delete('/',               ctrl.clearCart)

module.exports = router
