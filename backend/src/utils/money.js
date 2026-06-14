/**
 * money.js — Utilidades financieras para HR Beauty
 *
 * Todos los valores en la BD son pesos COP enteros (Integer).
 * El peso colombiano no tiene centavos vigentes desde 1984,
 * así que usamos enteros directamente sin multiplicar × 100.
 *
 * REGLA: nunca usar Float para dinero. Solo Math.round().
 */

// Constantes de negocio
const WOMPI_RATE       = 0.0265  // 2.65% comisión Wompi
const WOMPI_FIXED      = 700     // cargo fijo por transacción (COP)
const IVA_COMISION     = 0.19    // 19% IVA sobre la comisión
const EMPAQUE_COSTO    = 500     // costo de empaque por pedido
const PUBLICIDAD_COSTO = 1500    // costo estimado de publicidad por venta
const ENVIO_GRATIS_MIN = 50000   // umbral para envío gratis al cliente
const ENVIO_COSTO      = 8000    // costo de envío cobrado al cliente

/**
 * Calcula el descuento según el tipo de cupón.
 * @param {number} subtotal - subtotal en pesos
 * @param {object} coupon   - { type: 'PERCENT'|'FIXED'|'SHIPPING', value }
 * @returns {number} descuento en pesos (entero)
 */
function calcDescuento(subtotal, coupon) {
  if (!coupon) return 0
  if (coupon.type === 'PERCENT') return Math.round(subtotal * coupon.value / 100)
  if (coupon.type === 'FIXED')   return Math.min(coupon.value, subtotal)
  return 0 // SHIPPING no descuenta del subtotal
}

/**
 * Calcula el costo de envío cobrado al cliente.
 * @param {number} subtotal    - subtotal antes de descuento
 * @param {object|null} coupon - cupón aplicado
 * @returns {number} envío en pesos
 */
function calcEnvio(subtotal, coupon) {
  if (subtotal === 0) return 0
  if (coupon?.type === 'SHIPPING') return 0
  return subtotal >= ENVIO_GRATIS_MIN ? 0 : ENVIO_COSTO
}

/**
 * Construye el resumen financiero visible al cliente.
 * NUNCA incluir costos internos aquí.
 */
function calcClienteSummary(items, coupon) {
  const subtotal   = items.reduce((acc, i) => acc + i.precioSnapshot * i.quantity, 0)
  const descuento  = calcDescuento(subtotal, coupon)
  const envio      = calcEnvio(subtotal, coupon)
  const total      = subtotal - descuento + envio

  return {
    subtotalPesos:     subtotal,
    descuentoPesos:    descuento,
    envioPesos:        envio,
    totalClientePesos: total,
  }
}

/**
 * Calcula la comisión de Wompi (interna 🔒).
 * @param {number} total - total cobrado al cliente en pesos
 * @returns {{ comision, ivaComision, totalComision }}
 */
function calcComisionWompi(total) {
  const comision    = Math.round(total * WOMPI_RATE) + WOMPI_FIXED
  const ivaComision = Math.round(comision * IVA_COMISION)
  return { comision, ivaComision, totalComision: comision + ivaComision }
}

/**
 * Calcula la rentabilidad neta del pedido (interna 🔒).
 * Solo se llama desde ProfitService, nunca desde controllers públicos.
 *
 * @param {object} order     - { totalClientePesos, envioPesos }
 * @param {Array}  items     - [{ costoCompraSnapshot, quantity }]
 * @returns {object} profit log data
 */
function calcProfit(order, items) {
  const { totalClientePesos, envioPesos } = order

  const costoProductos = items.reduce(
    (acc, i) => acc + i.costoCompraSnapshot * i.quantity,
    0,
  )

  const { comision, ivaComision } = calcComisionWompi(totalClientePesos)

  const totalCostos =
    costoProductos +
    comision +
    ivaComision +
    EMPAQUE_COSTO +
    PUBLICIDAD_COSTO +
    (envioPesos > 0 ? 0 : 0) // envío gratis al cliente = costo real absorbido por negocio

  const gananciaNeta = totalClientePesos - totalCostos
  const margenPct    = totalClientePesos > 0
    ? parseFloat(((gananciaNeta / totalClientePesos) * 100).toFixed(2))
    : 0

  return {
    totalClientePesos,
    costoProductosPesos: costoProductos,
    comisionWompiPesos:  comision,
    ivaComisionPesos:    ivaComision,
    empaquePesos:        EMPAQUE_COSTO,
    publicidadPesos:     PUBLICIDAD_COSTO,
    envioCostoPesos:     0,
    totalCostosPesos:    totalCostos,
    gananciaNeta,
    margenPct,
  }
}

/**
 * Formatea pesos para logs internos (nunca para el cliente).
 */
function formatCOP(pesos) {
  return `$${pesos.toLocaleString('es-CO')}`
}

module.exports = {
  calcDescuento,
  calcEnvio,
  calcClienteSummary,
  calcComisionWompi,
  calcProfit,
  formatCOP,
  ENVIO_GRATIS_MIN,
  ENVIO_COSTO,
  WOMPI_RATE,
  WOMPI_FIXED,
  IVA_COMISION,
}
