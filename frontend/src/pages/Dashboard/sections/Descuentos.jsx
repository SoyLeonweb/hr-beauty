import { useState } from 'react'
import { Tag, Plus } from 'lucide-react'
import styles from './sections.module.css'

const CUPONES = [
  { codigo: 'BIENVENIDA10', tipo: '%',  valor: 10,    usos: 124, limite: 500,  vence: '30 Jun 2024', estado: 'Activo'  },
  { codigo: 'VERANO15',     tipo: '%',  valor: 15,    usos: 89,  limite: 200,  vence: '15 Jun 2024', estado: 'Activo'  },
  { codigo: 'SKINCARE20',   tipo: '%',  valor: 20,    usos: 200, limite: 200,  vence: '01 Jun 2024', estado: 'Agotado' },
  { codigo: 'ENVIOGRATIS',  tipo: '$',  valor: 10000, usos: 312, limite: 1000, vence: '31 Dic 2024', estado: 'Activo'  },
  { codigo: 'VIP30',        tipo: '%',  valor: 30,    usos: 45,  limite: 100,  vence: '30 Jun 2024', estado: 'Activo'  },
  { codigo: 'MAYO2024',     tipo: '%',  valor: 12,    usos: 500, limite: 500,  vence: '31 May 2024', estado: 'Vencido' },
]

const ESTADO_CLASS = { Activo: 'badgeGreen', Agotado: 'badgeOrange', Vencido: 'badgeMuted' }

export default function Descuentos() {
  const [mostrarForm, setMostrarForm] = useState(false)

  return (
    <div className={styles.section}>
      <div className={styles.tableHeader}>
        <span style={{ flex: 1 }} />
        <button className={styles.ctaBtn} onClick={() => setMostrarForm(!mostrarForm)}>
          <Plus size={14} /> Nuevo cupón
        </button>
      </div>

      {mostrarForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Tag size={15} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Crear cupón</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Código</label>
              <input className={styles.formInput} placeholder="Ej: PROMO25" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Tipo</label>
              <select className={styles.formInput}>
                <option>Porcentaje (%)</option>
                <option>Monto fijo ($)</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Valor</label>
              <input className={styles.formInput} type="number" placeholder="Ej: 15" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Límite de usos</label>
              <input className={styles.formInput} type="number" placeholder="Ej: 100" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Fecha de vencimiento</label>
              <input className={styles.formInput} type="date" />
            </div>
          </div>
          <button className={styles.ctaBtn} style={{ marginTop: 16 }}>Guardar cupón</button>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Tag size={15} className={styles.cardIconOrange} />
          <h2 className={styles.cardTitle}>Cupones activos</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Código</th>
              <th className={styles.th}>Descuento</th>
              <th className={styles.th}>Usos</th>
              <th className={styles.th}>Límite</th>
              <th className={styles.th}>Vence</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {CUPONES.map(c => (
              <tr key={c.codigo} className={styles.tableRow}>
                <td className={styles.tdBold}>{c.codigo}</td>
                <td className={styles.tdNormal}>{c.tipo === '%' ? `${c.valor}%` : `$${c.valor.toLocaleString()}`}</td>
                <td className={styles.tdNormal}>{c.usos}</td>
                <td className={styles.tdMuted}>{c.limite}</td>
                <td className={styles.tdMuted}>{c.vence}</td>
                <td><span className={`${styles.badge} ${styles[ESTADO_CLASS[c.estado]]}`}>{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
