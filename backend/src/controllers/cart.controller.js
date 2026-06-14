const cartService   = require('../services/cart.service')
const couponService = require('../services/coupon.service')

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id)
    res.json({ success: true, data: cart })
  } catch (err) { next(err) }
}

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body
    const cart = await cartService.addItem(req.user.id, productId, quantity)
    res.status(201).json({ success: true, data: cart })
  } catch (err) { next(err) }
}

const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.user.id, parseInt(req.params.itemId))
    res.json({ success: true, data: cart })
  } catch (err) { next(err) }
}

const updateQty = async (req, res, next) => {
  try {
    const { quantity } = req.body
    const cart = await cartService.updateQty(req.user.id, parseInt(req.params.itemId), quantity)
    res.json({ success: true, data: cart })
  } catch (err) { next(err) }
}

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id)
    res.json({ success: true, message: 'Carrito vaciado' })
  } catch (err) { next(err) }
}

const applyCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.applyCouponToCart(req.user.id, req.body.code)
    // Retornar carrito actualizado + info del cupón
    const cart = await cartService.getCart(req.user.id)
    res.json({ success: true, data: { cart, coupon } })
  } catch (err) { next(err) }
}

const removeCoupon = async (req, res, next) => {
  try {
    await couponService.removeCouponFromCart(req.user.id)
    const cart = await cartService.getCart(req.user.id)
    res.json({ success: true, data: cart })
  } catch (err) { next(err) }
}

module.exports = { getCart, addItem, removeItem, updateQty, clearCart, applyCoupon, removeCoupon }
