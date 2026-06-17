const checkoutSvc = require('../services/checkout.service')

exports.createOrder = async (req, res, next) => {
  try {
    const order = await checkoutSvc.createOrder(req.user.id, req.body)
    res.status(201).json({ ok: true, data: order })
  } catch (e) { next(e) }
}
