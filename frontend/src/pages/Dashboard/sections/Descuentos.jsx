import { useState } from 'react'
import { Tag, Plus } from 'lucide-react'
import styles from './sections.module.css'

const CUPONES = [
  { codigo:'BIENVENIDA10', tipo:'%',  valor:10, usos:47, limite:100, estado:'Activo'   },
  { codigo:'VERANO20',     tipo:'%',  valor:20, usos:23, limite:50,  estado:'Activo'   },
  { codigo:'FREESHIP',     tipo:'$',  valor:5000, usos:88, limite:100, estado:'Agotado' },
  { codigo:'VIP15',        tipo:'%',  valor:15, usos:12, limite:30,  estado:'Activo'   },
  { codigo:'NAVIDAD25',    tipo:'%',  valor:25, usos:0,  limite:200, estado:'Inactivo' },
]

const BESTADO = { 'Activo':'badgeGreen', 'Agotado':'badgeRed', 'Inactivo':'badgeMuted' }

export default function Descuentos() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ codigo:'', tipo:'%', valor:'', limite:'' })

  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Descuentos y Cupones</h1>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <p className={styles.cardTitle} style={{ margin:0 }}><Tag size={16} /> Cupones activos</p>
          <button className={styles.btnPrimary} onClick={() => setShowForm(v => !v)}>
            <Plus size={14} /> Nuevo cupón
          </button>
        </div>

        {showForm && (
          <div style={{ background:'#faf8fc', borderRadius:12, padding:18, marginBottom:16 }}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Código</label>
                <input className={styles.formInput} placeholder="Ej: PROMO10" value={form.codigo} onChange={e => setForm({...form, codigo:e.target.value.toUpperCase()})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo</label>
                <select className={styles.formInput} value={form.tipo} onChange={e => setForm({...form, tipo:e.target.value})}>
                  <option value="%">Porcentaje (%)</option>
                  <option value="$">Valor fijo ($)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Valor</label>
                <input className={styles.formInput} type="number" placeholder="Ej: 10" value={form.valor} onChange={e => setForm({...form, valor:e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Límite de usos</label>
                <input className={styles.formInput} type="number" placeholder="Ej: 100" value={form.limite} onChange={e => setForm({...form, limite:e.target.value})} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button className={styles.btnPrimary}>Guardar cupón</button>
              <button className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        <table className={styles.table}>
          <thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Usos</th><th>Límite</th><th>Estado</th></tr></thead>
          <tbody>
            {CUPONES.map(c => (
              <tr key={c.codigo}>
                <td style={{ fontWeight:700, color:'#FF6FAE', letterSpacing:1 }}>{c.codigo}</td>
                <td>{c.tipo === '%' ? 'Porcentaje' : 'Valor fijo'}</td>
                <td>{c.tipo === '%' ? `${c.valor}%` : `$${c.valor.toLocaleString()}`}</td>
                <td>{c.usos}</td>
                <td>{c.limite}</td>
                <td><span className={`${styles.badge} ${styles[BESTADO[c.estado]]}`}>{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
