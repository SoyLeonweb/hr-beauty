/**
 * ProfitService 🔒 — INTERNO. NUNCA exponer al cliente.
 *
 * Calcula y persiste la rentabilidad real de cada pedido.
 * Solo se llama desde PaymentService cuando Wompi confirma el pago.
 *
 * Si alguna vez un controller intenta llamar esto directamente,
 * debe estar protegido por isAdmin middleware.
 */

const prisma     = require('../config/db')
const AppError   = require('../utils/AppError')
const { calcProfit, formatCOP } = require('../utils/money')

// ── calcAndSave ───────────────────────────────────────────────────────────────

async function calcAndSave(orderId) {
  // 1. Cargar orden con items internos (costoCompraSnapshot)
  const order = await prisma.order.findUnique({
    where:   { id: orderId },
    include: {
      items: {
        select: {
          quantity:            true,
          costoCompraSnapshot: true, // 🔒 campo interno
        },
      },
    },
  })

  if (!order) throw new AppError(404, `Orden #${orderId} no encontrada para calcular profit`)

  // 2. Calcular rentabilidad
  const profitData = calcProfit(
    { totalClientePesos: order.totalClientePesos, envioPesos: order.envioPesos },
    order.items,
  )

  // 3. Guardar en profit_logs (upsert en caso de reintento de webhook)
  const log = await prisma.profitLog.upsert({
    where:  { orderId },
    create: { orderId, ...profitData },
    update: { ...profitData },
  })

  // 4. Log interno (nunca se envía al cliente)
  console.log(
    `[ProfitLog] Orden #${orderId} | ` +
    `Ingreso: ${formatCOP(profitData.totalClientePesos)} | ` +
    `Costo: ${formatCOP(profitData.totalCostosPesos)} | ` +
    `Ganancia: ${formatCOP(profitData.gananciaNeta)} (${profitData.margenPct}%)`,
  )

  return log
}

// ── getSummary (admin only) ───────────────────────────────────────────────────

async function getSummary(filters = {}) {
  const { desde, hasta, limit = 50, offset = 0 } = filters

  const where = {}
  if (desde || hasta) {
    where.createdAt = {}
    if (desde) where.createdAt.gte = new Date(desde)
    if (hasta) where.createdAt.lte = new Date(hasta)
  }

  const [logs, total] = await Promise.all([
    prisma.profitLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take:    limit,
      skip:    offset,
      include: {
        order: {
          select: {
            id:     true,
            status: true,
            createdAt: true,
            user:   { select: { name: true, email: true } },
          },
        },
      },
    }),
    prisma.profitLog.count({ where }),
  ])

  // Totales agregados
  const aggregate = await prisma.profitLog.aggregate({
    where,
    _sum: {
      totalClientePesos:   true,
      costoProductosPesos: true,
      comisionWompiPesos:  true,
      ivaComisionPesos:    true,
      empaquePesos:        true,
      publicidadPesos:     true,
      totalCostosPesos:    true,
      gananciaNeta:        true,
    },
  })

  const ingresoTotal  = aggregate._sum.totalClientePesos  ?? 0
  const gananciaTotal = aggregate._sum.gananciaNeta        ?? 0
  const margenPromedio = ingresoTotal > 0
    ? parseFloat(((gananciaTotal / ingresoTotal) * 100).toFixed(2))
    : 0

  return {
    total,
    limit,
    offset,
    resumen: {
      ingresoTotal,
      costoProductosTotal: aggregate._sum.costoProductosPesos ?? 0,
      comisionWompiTotal:  aggregate._sum.comisionWompiPesos  ?? 0,
      ivaComisionTotal:    aggregate._sum.ivaComisionPesos     ?? 0,
      empaqueTotal:        aggregate._sum.empaquePesos         ?? 0,
      publicidadTotal:     aggregate._sum.publicidadPesos      ?? 0,
      totalCostosTotal:    aggregate._sum.totalCostosPesos     ?? 0,
      gananciaTotal,
      margenPromedio,
    },
    logs,
  }
}

module.exports = { calcAndSave, getSummary }
