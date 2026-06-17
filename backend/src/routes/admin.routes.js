const router = require('express').Router()
const ctrl   = require('../controllers/admin.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)
router.get('/stats',  ctrl.getDashboardStats)
router.get('/profit', ctrl.getProfitSummary)

module.exports = router
