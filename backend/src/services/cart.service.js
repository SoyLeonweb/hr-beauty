const { PrismaClient } = require('@prisma/client')
const AppError = require('../utils/AppError')

const prisma = new PrismaClient()

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findFirst({ where: { userId }, include: { items: { include: { product: true } } } })
  if (!cart) cart = await prisma.cart.create({ data: { userId }, include: { items: { include: { product: true } } } })
  return cart
}

const addItem = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId)
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new AppError('Producto no encontrado', 404)

  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
  if (existing) {
    return prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
  }
  return prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity, price: product.price } })
}

const updateItem = async (userId, itemId, quantity) => {
  if (quantity <= 0) return removeItem(userId, itemId)
  const cart = await getOrCreateCart(userId)
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } })
  if (!item) throw new AppError('Ítem no encontrado', 404)
  return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } })
}

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId)
  return prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } })
}

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)
  return prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
}

const getCart = async (userId) => getOrCreateCart(userId)

module.exports = { getCart, addItem, updateItem, removeItem, clearCart }
