const checkoutService = require('../services/checkout.service')
const paymentService  = require('../services/payment.service')

// GET /checkout/preview — resumen del pedido antes de confirmar
const preview = async (req, res, next) => {
  try {
    const data = await checkoutService.buildOrderPreview(req.user.id)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// POST /checkout — crea la orden
const createOrder = async (req, res, next) => {
  try {
    const { address, city, department, zip, phone, notes } = req.body
    const result = await checkoutService.createOrder(req.user.id, {
      address, city, department, zip, phone, notes,
    })
    res.status(201).json({ success: true, data: result })
  } catch (err) { next(err) }
}

// GET /checkout/orders/:id — detalle de orden del cliente
const getOrder = async (req, res, next) => {
  try {
    const order = await checkoutService.getOrderForClient(
      parseInt(req.params.id),
      req.user.id,
    )
    res.json({ success: true, data: order })
  } catch (err) { next(err) }
}

// POST /checkout/orders/:id/pay — iniciar pago con Wompi
const initPayment = async (req, res, next) => {
  try {
    const data = await paymentService.initTransaction(
      parseInt(req.params.id),
      req.user.id,
    )
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

module.exports = { preview, createOrder, getOrder, initPayment }
