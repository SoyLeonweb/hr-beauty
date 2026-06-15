import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const SHIPPING_THRESHOLD = 200000   // envío gratis sobre este valor
const SHIPPING_COST      = 15000    // costo de envío estándar

const VALID_COUPONS = {
  'HRBEAUTY10':  { type: 'percent',  value: 10, label: '10% de descuento' },
  'BIENVENIDA':  { type: 'percent',  value: 15, label: '15% de descuento' },
  'BEAUTY20':    { type: 'percent',  value: 20, label: '20% de descuento' },
  'ENVIOGRATIS': { type: 'shipping', value: 0,  label: 'Envío gratis'     },
}

export function CartProvider({ children }) {
  // Persistencia en localStorage
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_beauty_cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [couponCode,    setCouponCode]    = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError,   setCouponError]   = useState('')

  useEffect(() => {
    localStorage.setItem('hr_beauty_cart', JSON.stringify(items))
  }, [items])

  // ── Item actions ─────────────────────────────────────────────────────────────
  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) =>
    qty < 1 ? removeItem(id) : setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  // ── Coupon actions ────────────────────────────────────────────────────────────
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase()
    const found = VALID_COUPONS[clean]
    if (!found) {
      setCouponError('Código no válido. Intenta con otro.')
      setAppliedCoupon(null)
      return false
    }
    setAppliedCoupon({ code: clean, ...found })
    setCouponError('')
    return true
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  // ── Totals ────────────────────────────────────────────────────────────────────
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0)

  const discount = (() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'percent') return Math.round(subtotal * appliedCoupon.value / 100)
    return 0
  })()

  const shippingFree = subtotal >= SHIPPING_THRESHOLD || appliedCoupon?.type === 'shipping'
  const shipping     = subtotal === 0 ? 0 : shippingFree ? 0 : SHIPPING_COST

  const total = subtotal - discount + shipping
  const count = items.reduce((acc, i) => acc + i.qty, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      couponCode, setCouponCode,
      appliedCoupon, applyCoupon, removeCoupon, couponError,
      subtotal, discount, shipping, shippingFree, total, count,
      SHIPPING_THRESHOLD, SHIPPING_COST,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
