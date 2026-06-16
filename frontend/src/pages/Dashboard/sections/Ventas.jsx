import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import { TrendingUp, PieChart, DollarSign, TrendingDown, Percent, Award } from 'lucide-react'
import styles from './sections.module.css'

const VENTAS_MENSUAL = [
  { mes: 'Ene', ingresos: 68400, costos: 41000 },
  { mes: 'Feb', ingresos: 72100, costos: 43200 },
  { mes: 'Mar', ingresos: 65800, costos: 39500 },
  { mes: 'Abr', ingresos: 89200, costos: 53500 },
  { mes: 'May', ingresos: 124850, costos: 74900 },
  { mes: 'Jun', ingresos: 98300, costos: 58900 },
  { mes: 'Jul', ingresos: 110500, costos: 66300 },
  { mes: 'Ago', ingresos: 105200, costos: 63100 },
  { mes: 'Sep', ingresos: 118700, costos: 71200 },
  { mes: 'Oct', ingresos: 132400, costos: 79400 },
  { mes: 'Nov', ingresos: 145600, costos: 87300 },
  { mes: 'Dic', ingresos: 158900, costos: 95300 },
]

const VENTAS_CATEGORIA = [
  { categoria: 'Skincare',    ventas: 48200 },
  { categoria: 'Maquillaje',  ventas: 32600 },
  { categoria: 'Cabello',     ventas: 21400 },
  { categoria: 'Fragancias',  ventas: 14800 },
  { categoria: 'Cuerpo',      ventas: 7850  },
]

const METRICAS = [
  { label: 'Ingresos totales', value: '$1.189.750', delta: '+23.5%', icon: DollarSign,   color: 'kpiPink'   },
  { label: 'Costo de ventas',  value: '$713.700',   delta: '+19.1%', icon: TrendingDown, color: 'kpiPurple' },
  { label: 'Ganancia bruta',   value: '$476.050',   delta: '+29.4%', icon: Award,        color: 'kpiGreen'  },
  { label: 'Margen promedio',  value: '40.0%',      delta: '+2.1pp', icon: Percent,      color: 'kpiBlue'   },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className={styles.tooltipVal} style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function Ventas() {
  return (
    <div className={styles.section}>
      <div className={styles.kpiGrid}>
        {METRICAS.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className={`${styles.kpiCard} ${styles[m.color]}`}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>{m.label}</span>
                <div className={styles.kpiIconBox}><Icon size={16} /></div>
              </div>
              <span className={styles.kpiValue}>{m.value}</span>
              <span className={styles.kpiDelta}>{m.delta} vs mes anterior</span>
            </div>
          )
        })}
      </div>

      <div className={styles.row2}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TrendingUp size={15} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Ingresos vs Costos</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={VENTAS_MENSUAL} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e6f6" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ingresos" name="Ingresos" fill="#FF6FAE" radius={[4,4,0,0]} />
              <Bar dataKey="costos"   name="Costos"   fill="#e2d5ff" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <PieChart size={15} className={styles.cardIconPurple} />
            <h2 className={styles.cardTitle}>Ventas por Categoría</h2>
          </div>
          <ul className={styles.catList}>
            {VENTAS_CATEGORIA.map(c => {
              const max = VENTAS_CATEGORIA[0].ventas
              const pct = Math.round((c.ventas / max) * 100)
              return (
                <li key={c.categoria} className={styles.catRow}>
                  <span className={styles.catName}>{c.categoria}</span>
                  <div className={styles.barBg}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.catVal}>${c.ventas.toLocaleString()}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
