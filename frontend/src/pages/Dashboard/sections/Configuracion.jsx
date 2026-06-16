import { useState } from 'react'
import { Store, CreditCard, Share2, Save } from 'lucide-react'
import styles from './sections.module.css'

export default function Configuracion() {
  const [form, setForm] = useState({
    nombreTienda: 'HR Beauty',
    email: 'contacto@hrbeauty.com',
    telefono: '+57 300 123 4567',
    moneda: 'COP',
    envioGratis: '50000',
    comisionWompi: '3.49',
    ciudad: 'Bogotá',
    direccion: 'Cra 15 #85-32',
    instagram: '@hrbeauty.co',
    whatsapp: '+57 300 123 4567',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={styles.section}>
      <div className={styles.configGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Store size={15} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Información de la tienda</h2>
          </div>
          <div className={styles.formGrid}>
            {[
              { label: 'Nombre de la tienda', key: 'nombreTienda' },
              { label: 'Email de contacto',   key: 'email',        type: 'email' },
              { label: 'Teléfono',            key: 'telefono' },
              { label: 'Ciudad',              key: 'ciudad' },
              { label: 'Dirección',           key: 'direccion' },
            ].map(f => (
              <div key={f.key} className={styles.formField}>
                <label className={styles.formLabel}>{f.label}</label>
                <input className={styles.formInput} type={f.type || 'text'} value={form[f.key]} onChange={e => update(f.key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <CreditCard size={15} className={styles.cardIconGreen} />
            <h2 className={styles.cardTitle}>Pagos y envíos</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Moneda</label>
              <select className={styles.formInput} value={form.moneda} onChange={e => update('moneda', e.target.value)}>
                <option value="COP">COP — Peso colombiano</option>
                <option value="USD">USD — Dólar</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Umbral envío gratis (COP)</label>
              <input className={styles.formInput} type="number" value={form.envioGratis} onChange={e => update('envioGratis', e.target.value)} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Comisión Wompi (%)</label>
              <input className={styles.formInput} type="number" step="0.01" value={form.comisionWompi} onChange={e => update('comisionWompi', e.target.value)} />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Share2 size={15} className={styles.cardIconPurple} />
            <h2 className={styles.cardTitle}>Redes sociales</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Instagram</label>
              <input className={styles.formInput} value={form.instagram} onChange={e => update('instagram', e.target.value)} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>WhatsApp</label>
              <input className={styles.formInput} value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <button className={styles.ctaBtn}>
        <Save size={14} /> Guardar cambios
      </button>
    </div>
  )
}
