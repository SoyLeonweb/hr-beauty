const paymentSvc = require('../services/payment.service')

exports.processPayment = async (req, res, next) => {
  try {
    const payment = await paymentSvc.processPayment(req.params.orderId, req.body)
    res.json({ ok: true, data: payment })
  } catch (e) { next(e) }
}

exports.getPayment = async (req, res, next) => {
  try {
    const payment = await paymentSvc.getPaymentByOrder(req.params.orderId)
    res.json({ ok: true, data: payment })
  } catch (e) { next(e) }
}
