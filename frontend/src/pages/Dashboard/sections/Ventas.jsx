import { useState } from 'react'
import { DollarSign, TrendingDown, TrendingUp, Percent } from 'lucide-react'
import styles from './sections.module.css'

const MONTHLY = [
  { mes: 'Ene', ingresos: 2800000, costos: 1400000 },
  { mes: 'Feb', ingresos: 3200000, costos: 1600000 },
  { mes: 'Mar', ingresos: 2900000, costos: 1450000 },
  { mes: 'Abr', ingresos: 3800000, costos: 1900000 },
  { mes: 'May', ingresos: 4100000, costos: 2050000 },
  { mes: 'Jun', ingresos: 4820000, costos: 2410000 },
]

const CATEGORIAS = [
  { name: 'Sérum Facial',      ventas: 2100000, pct: 44, color: '#FF6FAE' },
  { name: 'Crema Facial',      ventas: 1200000, pct: 25, color: '#a78bfa' },
  { name: 'Protector Solar',   ventas:  720000, pct: 15, color: '#60a5fa' },
  { name: 'Mascarilla Facial', ventas:  480000, pct: 10, color: '#34d399' },
  { name: 'Otros',             ventas:  320000, pct:  6, color: '#fbbf24' },
]

const fmt = v => v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : `$${Math.round(v/1000)}k`

/* ── Grouped Bar Chart SVG ──────────────────────────────────── */
function GroupedBarChart({ data }) {
  const W = 560, H = 220
  const PAD = { top: 20, right: 20, bottom: 36, left: 52 }
  const iW = W - PAD.left - PAD.right
  const iH = H - PAD.top  - PAD.bottom

  const maxV   = Math.max(...data.map(d => d.ingresos))
  const yOf    = v => PAD.top + iH - (v / (maxV * 1.08)) * iH
  const slotW  = iW / data.length
  const barW   = slotW * 0.28
  const gap    = slotW * 0.06

  const [hov, setHov] = useState(null) // { i, type }

  const GRID_COUNT = 4
  const gridVals = Array.from({ length: GRID_COUNT + 1 }, (_, i) =>
    Math.round((maxV * 1.08 / GRID_COUNT) * i)
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', overflow:'visible' }}>
      <defs>
        <linearGradient id="gradIng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF6FAE" />
          <stop offset="100%" stopColor="#ffadd2" />
        </linearGradient>
        <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF6FAE" floodOpacity="0.18"/>
        </filter>
      </defs>

      {/* Grid lines */}
      {gridVals.map((v, i) => {
        const y = yOf(v)
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
              stroke={i === 0 ? '#e5dff0' : '#f0eaf5'} strokeWidth="1"
              strokeDasharray={i === 0 ? '0' : '4 4'} />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end"
              fontSize="10" fill="#c4b5d4" fontFamily="Poppins,sans-serif" fontWeight="500">
              {fmt(v)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const cx    = PAD.left + slotW * i + slotW / 2
        const xIng  = cx - barW - gap / 2
        const xCost = cx + gap / 2
        const yIng  = yOf(d.ingresos)
        const yCost = yOf(d.costos)
        const hIng  = PAD.top + iH - yIng
        const hCost = PAD.top + iH - yCost
        const hovIng  = hov?.i === i && hov?.type === 'ing'
        const hovCost = hov?.i === i && hov?.type === 'cost'

        return (
          <g key={d.mes}>
            {/* Ingresos bar */}
            <rect x={xIng} y={yIng} width={barW} height={hIng}
              rx="5" fill="url(#gradIng)"
              opacity={hovIng ? 1 : 0.85}
              filter={hovIng ? 'url(#dropShadow)' : ''}
              style={{ cursor:'pointer', transition:'opacity 0.15s' }}
              onMouseEnter={() => setHov({ i, type:'ing' })}
              onMouseLeave={() => setHov(null)} />

            {/* Costos bar */}
            <rect x={xCost} y={yCost} width={barW} height={hCost}
              rx="5" fill="url(#gradCost)"
              opacity={hovCost ? 1 : 0.8}
              style={{ cursor:'pointer', transition:'opacity 0.15s' }}
              onMouseEnter={() => setHov({ i, type:'cost' })}
              onMouseLeave={() => setHov(null)} />

            {/* Tooltip ingresos */}
            {hovIng && (
              <g>
                <rect x={xIng + barW/2 - 36} y={yIng - 30} width="72" height="22" rx="6" fill="#1e1826" />
                <text x={xIng + barW/2} y={yIng - 15} textAnchor="middle"
                  fontSize="11" fill="#fff" fontWeight="600" fontFamily="Poppins,sans-serif">
                  {fmt(d.ingresos)}
                </text>
              </g>
            )}

            {/* Tooltip costos */}
            {hovCost && (
              <g>
                <rect x={xCost + barW/2 - 36} y={yCost - 30} width="72" height="22" rx="6" fill="#1e1826" />
                <text x={xCost + barW/2} y={yCost - 15} textAnchor="middle"
                  fontSize="11" fill="#fff" fontWeight="600" fontFamily="Poppins,sans-serif">
                  {fmt(d.costos)}
                </text>
              </g>
            )}

            {/* X label */}
            <text x={cx} y={H - 8} textAnchor="middle"
              fontSize="11" fill="#9ca3af" fontFamily="Poppins,sans-serif" fontWeight="500">
              {d.mes}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── Donut Chart SVG ─────────────────────────────────────────── */
function DonutChart({ data }) {
  const R = 68, r = 42, cx = 90, cy = 90
  const total = data.reduce((s, d) => s + d.pct, 0)
  const [hov, setHov] = useState(null)

  let angle = -90
  const slices = data.map(d => {
    const start = angle
    const sweep = (d.pct / total) * 360
    angle += sweep
    return { ...d, start, sweep }
  })

  const arc = (cx, cy, R, startDeg, sweepDeg) => {
    const rad = d => (d * Math.PI) / 180
    const x1 = cx + R * Math.cos(rad(startDeg))
    const y1 = cy + R * Math.sin(rad(startDeg))
    const x2 = cx + R * Math.cos(rad(startDeg + sweepDeg))
    const y2 = cy + R * Math.sin(rad(startDeg + sweepDeg))
    const large = sweepDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`
  }

  const hovSlice = hov !== null ? slices[hov] : null

  return (
    <div style={{ display:'flex', alignItems:'center', gap:28 }}>
      <svg viewBox="0 0 180 180" style={{ width:160, height:160, flexShrink:0, overflow:'visible' }}>
        <defs>
          <filter id="sliceShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>

        {slices.map((s, i) => {
          const isHov  = hov === i
          const offset = isHov ? 6 : 0
          const mid    = (s.start + s.sweep / 2) * Math.PI / 180
          const ox     = Math.cos(mid) * offset
          const oy     = Math.sin(mid) * offset

          return (
            <path key={s.name}
              d={`${arc(cx + ox, cy + oy, R, s.start, s.sweep - 0.5)}
                  L ${cx + ox + r * Math.cos((s.start + s.sweep - 0.5) * Math.PI / 180)}
                    ${cy + oy + r * Math.sin((s.start + s.sweep - 0.5) * Math.PI / 180)}
                  A ${r} ${r} 0 ${s.sweep > 180 ? 1 : 0} 0
                    ${cx + ox + r * Math.cos(s.start * Math.PI / 180)}
                    ${cy + oy + r * Math.sin(s.start * Math.PI / 180)} Z`}
              fill={s.color}
              opacity={hov !== null && !isHov ? 0.55 : 1}
              filter={isHov ? 'url(#sliceShadow)' : ''}
              style={{ cursor:'pointer', transition:'opacity 0.2s, filter 0.2s' }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            />
          )
        })}

        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700"
          fill={hovSlice ? hovSlice.color : '#1a1530'} fontFamily="Poppins,sans-serif">
          {hovSlice ? `${hovSlice.pct}%` : '100%'}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#b0a8c0"
          fontFamily="Poppins,sans-serif">
          {hovSlice ? hovSlice.name.split(' ')[0] : 'Total'}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
        {data.map((d, i) => (
          <div key={d.name}
            style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer',
              opacity: hov !== null && hov !== i ? 0.45 : 1, transition:'opacity 0.2s' }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}>
            <span style={{ width:10, height:10, borderRadius:3, background:d.color, flexShrink:0 }} />
            <span style={{ flex:1, fontSize:12.5, color:'#374151', fontWeight:500 }}>{d.name}</span>
            <span style={{ fontSize:12, color:'#b0a8c0', fontWeight:600 }}>{d.pct}%</span>
            <span style={{ fontSize:12, color:'#9ca3af' }}>{fmt(d.ventas)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Ventas() {
  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Ventas</h1>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiPink}`}>
          <div className={styles.kpiIcon}><DollarSign size={20} /></div>
          <div>
            <p className={styles.kpiLabel}>Ingresos totales</p>
            <p className={styles.kpiValue}>$21.620.000</p>
            <span className={styles.kpiSub}>Acumulado 2024</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiIcon}><TrendingDown size={20} /></div>
          <div>
            <p className={styles.kpiLabel}>Costo de ventas</p>
            <p className={styles.kpiValue}>$10.810.000</p>
            <span className={styles.kpiSub}>50% de ingresos</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}><TrendingUp size={20} /></div>
          <div>
            <p className={styles.kpiLabel}>Ganancia bruta</p>
            <p className={styles.kpiValue}>$10.810.000</p>
            <span className={styles.kpiSub}>+12% vs mes anterior</span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}><Percent size={20} /></div>
          <div>
            <p className={styles.kpiLabel}>Margen promedio</p>
            <p className={styles.kpiValue}>50%</p>
            <span className={styles.kpiSub}>Meta: 48%</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardTitle}>Ingresos vs Costos</p>
            <p className={styles.cardSub}>Últimos 6 meses · hover para ver valores</p>
          </div>
          <div style={{ display:'flex', gap:16, fontSize:12, color:'#6b7280', alignItems:'center' }}>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10,height:10,borderRadius:3,background:'#FF6FAE',display:'inline-block' }} /> Ingresos
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10,height:10,borderRadius:3,background:'#a78bfa',display:'inline-block' }} /> Costos
            </span>
          </div>
        </div>
        <GroupedBarChart data={MONTHLY} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardTitle}>Ventas por categoría</p>
            <p className={styles.cardSub}>Distribución del período · hover para explorar</p>
          </div>
        </div>
        <DonutChart data={CATEGORIAS} />
      </div>
    </div>
  )
}
