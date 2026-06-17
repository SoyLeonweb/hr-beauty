import { Store, CreditCard, Share2, Save } from 'lucide-react'
import styles from './sections.module.css'

export default function Configuracion() {
  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Configuración</h1>
      <div className={styles.configGrid}>

        <div className={styles.configCard}>
          <p className={styles.configCardTitle}><Store size={16} /> Información de la tienda</p>
          <div className={styles.configRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre de la tienda</label>
              <input className={styles.formInput} defaultValue="HR Beauty" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email de contacto</label>
              <input className={styles.formInput} defaultValue="contacto@hrbeauty.co" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Teléfono</label>
              <input className={styles.formInput} defaultValue="+57 300 000 0000" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ciudad</label>
              <input className={styles.formInput} defaultValue="Bogotá, Colombia" />
            </div>
            <button className={styles.btnPrimary}><Save size={14} /> Guardar</button>
          </div>
        </div>

        <div className={styles.configCard}>
          <p className={styles.configCardTitle}><CreditCard size={16} /> Pagos y envíos</p>
          <div className={styles.configRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Pasarela de pago</label>
              <select className={styles.formInput}>
                <option>Wompi</option>
                <option>PayU</option>
                <option>MercadoPago</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Costo de envío base</label>
              <input className={styles.formInput} defaultValue="8000" type="number" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Envío gratis desde</label>
              <input className={styles.formInput} defaultValue="80000" type="number" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Días de entrega</label>
              <input className={styles.formInput} defaultValue="3-5 días hábiles" />
            </div>
            <button className={styles.btnPrimary}><Save size={14} /> Guardar</button>
          </div>
        </div>

        <div className={styles.configCard}>
          <p className={styles.configCardTitle}><Share2 size={16} /> Redes sociales</p>
          <div className={styles.configRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Instagram</label>
              <input className={styles.formInput} defaultValue="@hrbeauty.co" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>TikTok</label>
              <input className={styles.formInput} defaultValue="@hrbeauty" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Facebook</label>
              <input className={styles.formInput} defaultValue="HR Beauty Colombia" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>WhatsApp</label>
              <input className={styles.formInput} defaultValue="+57 300 000 0000" />
            </div>
            <button className={styles.btnPrimary}><Save size={14} /> Guardar</button>
          </div>
        </div>

      </div>
    </div>
  )
}
