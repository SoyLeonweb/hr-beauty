const cartSvc = require('../services/cart.service')

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartSvc.getCart(req.user.id)
    res.json({ ok: true, data: cart })
  } catch (e) { next(e) }
}

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body
    const item = await cartSvc.addItem(req.user.id, productId, quantity)
    res.status(201).json({ ok: true, data: item })
  } catch (e) { next(e) }
}

exports.updateItem = async (req, res, next) => {
  try {
    const item = await cartSvc.updateItem(req.user.id, req.params.itemId, req.body.quantity)
    res.json({ ok: true, data: item })
  } catch (e) { next(e) }
}

exports.removeItem = async (req, res, next) => {
  try {
    await cartSvc.removeItem(req.user.id, req.params.itemId)
    res.json({ ok: true })
  } catch (e) { next(e) }
}

exports.clearCart = async (req, res, next) => {
  try {
    await cartSvc.clearCart(req.user.id)
    res.json({ ok: true })
  } catch (e) { next(e) }
}
