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
  { name: 'Sérum Facial',      ventas: 2100000, pct: 44 },
  { name: 'Crema Facial',      ventas: 1200000, pct: 25 },
  { name: 'Protector Solar',   ventas:  720000, pct: 15 },
  { name: 'Mascarilla Facial', ventas:  480000, pct: 10 },
  { name: 'Otros',             ventas:  320000, pct: 6  },
]

const maxBar = Math.max(...MONTHLY.map(m => m.ingresos))

export default function Ventas() {
  const [tab, setTab] = useState('mensual')

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
        <div className={`${styles.kpiCard} ${styles.kpiRed || styles.kpiPurple}`}>
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
        <p className={styles.cardTitle}>Ingresos vs Costos – últimos 6 meses</p>
        <div style={{ display:'flex', alignItems:'flex-end', gap:16, height:160, borderBottom:'1px solid #f0eaf5', paddingBottom:8, marginBottom:8 }}>
          {MONTHLY.map(m => (
            <div key={m.mes} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, width:'100%' }}>
                <div style={{ flex:1, background:'linear-gradient(180deg,#FF6FAE,#ffadd2)', borderRadius:'4px 4px 0 0', height:`${(m.ingresos/maxBar)*120}px` }} title={`$${m.ingresos.toLocaleString()}`} />
                <div style={{ flex:1, background:'linear-gradient(180deg,#a78bfa,#c4b5fd)', borderRadius:'4px 4px 0 0', height:`${(m.costos/maxBar)*120}px` }} title={`$${m.costos.toLocaleString()}`} />
              </div>
              <span style={{ fontSize:11, color:'#9ca3af' }}>{m.mes}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, fontSize:12, color:'#6b7280' }}>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:12,height:12,borderRadius:3,background:'#FF6FAE',display:'inline-block' }} /> Ingresos</span>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:12,height:12,borderRadius:3,background:'#a78bfa',display:'inline-block' }} /> Costos</span>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Ventas por categoría</p>
        {CATEGORIAS.map(c => (
          <div key={c.name} className={styles.barRow}>
            <span className={styles.barLabel}>{c.name}</span>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width:`${c.pct}%` }} />
            </div>
            <span className={styles.barVal}>${(c.ventas/1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
    </div>
  )
}
