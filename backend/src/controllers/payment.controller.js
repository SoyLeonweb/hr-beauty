const paymentService = require('../services/payment.service')

// POST /payment/webhook — recibe notificaciones de Wompi
// IMPORTANTE: usa rawBody (Buffer), no JSON parseado, para verificar la firma HMAC
const webhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-event-checksum'] ?? ''
    const rawBody   = req.rawBody // ver server.js para cómo capturamos rawBody

    const result = await paymentService.handleWebhook(rawBody, signature)

    // Wompi espera HTTP 200 para considerar el webhook entregado
    res.status(200).json({ received: true, ...result })
  } catch (err) {
    // Loguear pero siempre responder 200 para evitar reenvíos infinitos de Wompi
    console.error('[Webhook Error]', err.message)
    res.status(200).json({ received: true, error: err.message })
  }
}

module.exports = { webhook }
