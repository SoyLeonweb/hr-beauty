import { Megaphone, Image } from 'lucide-react'
import styles from './sections.module.css'

const CAMPANAS = [
  { nombre:'Promo Día de la Madre',  canal:'Instagram',  inicio:'2024-05-01', fin:'2024-05-12', estado:'Finalizada', resultado:'+38% ventas' },
  { nombre:'Lanzamiento Sérum Oro',  canal:'Email',      inicio:'2024-06-01', fin:'2024-06-15', estado:'Activa',     resultado:'+22 leads'   },
  { nombre:'Descuentos de Verano',   canal:'WhatsApp',   inicio:'2024-06-10', fin:'2024-06-30', estado:'Activa',     resultado:'En curso'    },
  { nombre:'Black Friday Beauty',    canal:'Multi',      inicio:'2024-11-25', fin:'2024-11-29', estado:'Planeada',   resultado:'-'           },
]

const BANNERS = [
  { nombre:'Banner Hero – Home',     tamaño:'1440×600', estado:'Activo'   },
  { nombre:'Banner Skincare',        tamaño:'800×400',  estado:'Activo'   },
  { nombre:'Banner Maquillaje',      tamaño:'800×400',  estado:'Inactivo' },
  { nombre:'Pop-up Descuento 10%',   tamaño:'500×500',  estado:'Activo'   },
]

const BESTADO = { 'Finalizada':'badgeMuted', 'Activa':'badgeGreen', 'Planeada':'badgeBlue' }
const BESTADO2 = { 'Activo':'badgeGreen', 'Inactivo':'badgeMuted' }

export default function Marketing() {
  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Marketing</h1>

      <div className={styles.card}>
        <p className={styles.cardTitle}><Megaphone size={16} /> Campañas</p>
        <table className={styles.table}>
          <thead><tr><th>Campaña</th><th>Canal</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Resultado</th></tr></thead>
          <tbody>
            {CAMPANAS.map(c => (
              <tr key={c.nombre}>
                <td style={{ fontWeight:600 }}>{c.nombre}</td>
                <td>{c.canal}</td>
                <td style={{ color:'#9ca3af', fontSize:12 }}>{c.inicio}</td>
                <td style={{ color:'#9ca3af', fontSize:12 }}>{c.fin}</td>
                <td><span className={`${styles.badge} ${styles[BESTADO[c.estado]]}`}>{c.estado}</span></td>
                <td style={{ color:'#6b7280' }}>{c.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}><Image size={16} /> Banners</p>
        <table className={styles.table}>
          <thead><tr><th>Banner</th><th>Tamaño</th><th>Estado</th></tr></thead>
          <tbody>
            {BANNERS.map(b => (
              <tr key={b.nombre}>
                <td>{b.nombre}</td>
                <td style={{ color:'#9ca3af', fontSize:12 }}>{b.tamaño}</td>
                <td><span className={`${styles.badge} ${styles[BESTADO2[b.estado]]}`}>{b.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
