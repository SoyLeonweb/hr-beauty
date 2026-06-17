/** Format cents or raw COP to readable string: 14000 → "$14.000" */
const formatCOP = (amount) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)

/** Round to 2 decimal places */
const round2 = (n) => Math.round(n * 100) / 100

/** Calculate discount amount */
const applyDiscount = (price, coupon) => {
  if (!coupon) return price
  if (coupon.type === 'percent') return round2(price * (1 - coupon.value / 100))
  if (coupon.type === 'fixed')   return Math.max(0, price - coupon.value)
  return price
}

module.exports = { formatCOP, round2, applyDiscount }
