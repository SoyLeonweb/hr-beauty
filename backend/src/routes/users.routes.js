const router = require('express').Router()
const { protect, isAdmin } = require('../middleware/auth.middleware')
const ctrl = require('../controllers/users.controller')
router.get('/', protect, isAdmin, ctrl.getAll)
module.exports = router
