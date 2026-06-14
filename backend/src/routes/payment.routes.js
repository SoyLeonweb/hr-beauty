const router = require('express').Router()
const ctrl   = require('../controllers/payment.controller')

// POST /api/payment/webhook  — llamado por Wompi, NO por el cliente
// No lleva protect (Wompi no tiene token JWT); la seguridad es la firma HMAC
router.post('/webhook', ctrl.webhook)

module.exports = router
