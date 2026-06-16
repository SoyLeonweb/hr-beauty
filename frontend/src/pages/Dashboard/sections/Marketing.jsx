import { Megaphone, Image } from 'lucide-react'
import styles from './sections.module.css'

const CAMPANAS = [
  { nombre: 'Semana del Skincare',   canal: 'Email',     alcance: 4820,  clicks: 1204, conv: 342, estado: 'Activa'    },
  { nombre: 'Promo Día de la Mujer', canal: 'Instagram', alcance: 12400, clicks: 3100, conv: 680, estado: 'Finalizada'},
  { nombre: 'Kit Verano 2024',       canal: 'Email',     alcance: 3600,  clicks: 900,  conv: 198, estado: 'Activa'    },
  { nombre: 'Flash Sale 24h',        canal: 'WhatsApp',  alcance: 2100,  clicks: 1890, conv: 512, estado: 'Finalizada'},
  { nombre: 'Membresía VIP',         canal: 'Email',     alcance: 1540,  clicks: 618,  conv: 89,  estado: 'Borrador'  },
]

const BANNERS = [
  { titulo: 'Banner Hero - Mayo',  estado: 'Activo',   vistas: 8420 },
  { titulo: 'Popup Descuento 15%', estado: 'Activo',   vistas: 3210 },
  { titulo: 'Banner Categorías',   estado: 'Inactivo', vistas: 1840 },
]

const ESTADO_CLASS = { Activa: 'badgeGreen', Finalizada: 'badgeMuted', Borrador: 'badgeOrange', Activo: 'badgeGreen', Inactivo: 'badgeMuted' }

export default function Marketing() {
  return (
    <div className={styles.section}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Megaphone size={15} className={styles.cardIcon} />
          <h2 className={styles.cardTitle}>Campañas</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Campaña</th>
              <th className={styles.th}>Canal</th>
              <th className={styles.th}>Alcance</th>
              <th className={styles.th}>Clicks</th>
              <th className={styles.th}>Conversiones</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {CAMPANAS.map(c => (
              <tr key={c.nombre} className={styles.tableRow}>
                <td className={styles.tdBold}>{c.nombre}</td>
                <td className={styles.tdMuted}>{c.canal}</td>
                <td className={styles.tdNormal}>{c.alcance.toLocaleString()}</td>
                <td className={styles.tdNormal}>{c.clicks.toLocaleString()}</td>
                <td className={styles.tdNormal}>{c.conv}</td>
                <td><span className={`${styles.badge} ${styles[ESTADO_CLASS[c.estado]]}`}>{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Image size={15} className={styles.cardIconBlue} />
          <h2 className={styles.cardTitle}>Banners activos</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Banner</th>
              <th className={styles.th}>Vistas</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {BANNERS.map(b => (
              <tr key={b.titulo} className={styles.tableRow}>
                <td className={styles.tdBold}>{b.titulo}</td>
                <td className={styles.tdNormal}>{b.vistas.toLocaleString()}</td>
                <td><span className={`${styles.badge} ${styles[ESTADO_CLASS[b.estado]]}`}>{b.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
