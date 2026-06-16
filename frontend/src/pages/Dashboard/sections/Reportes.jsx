import { Download, FileText, Package, Users, ShoppingBag, DollarSign, Megaphone } from 'lucide-react'
import styles from './sections.module.css'

const REPORTES = [
  { titulo: 'Reporte de Ventas',        desc: 'Ventas totales, por categoría y producto. Mayo 2024.',  icon: DollarSign,  tipo: 'PDF'   },
  { titulo: 'Inventario General',        desc: 'Stock actual, productos agotados y bajo stock.',        icon: Package,     tipo: 'Excel' },
  { titulo: 'Informe de Clientes',       desc: 'Clientes nuevos, frecuentes y VIP del mes.',            icon: Users,       tipo: 'PDF'   },
  { titulo: 'Reporte de Pedidos',        desc: 'Todos los pedidos con estado y detalle de pago.',       icon: ShoppingBag, tipo: 'Excel' },
  { titulo: 'Análisis de Rentabilidad',  desc: 'Ingresos, costos, márgenes y ganancias netas.',         icon: FileText,    tipo: 'PDF'   },
  { titulo: 'Campaña de Marketing',      desc: 'Alcance, conversiones y ROI de campañas activas.',      icon: Megaphone,   tipo: 'PDF'   },
]

const ICON_COLORS = ['#FF6FAE','#7c3aed','#1d6fa4','#1a7f4b','#b45309','#d63384']
const ICON_BG     = ['#fff0f6','#f3eeff','#e8f4ff','#edfaf3','#fff4e5','#fff0f6']

export default function Reportes() {
  return (
    <div className={styles.section}>
      <div className={styles.reportGrid}>
        {REPORTES.map((r, i) => {
          const Icon = r.icon
          return (
            <div key={r.titulo} className={styles.reportCard}>
              <div className={styles.reportIconBox} style={{ background: ICON_BG[i], color: ICON_COLORS[i] }}>
                <Icon size={20} />
              </div>
              <div className={styles.reportInfo}>
                <h3 className={styles.reportTitle}>{r.titulo}</h3>
                <p className={styles.reportDesc}>{r.desc}</p>
              </div>
              <div className={styles.reportActions}>
                <span className={`${styles.badge} ${r.tipo === 'PDF' ? styles.badgeRed : styles.badgeGreen}`}>{r.tipo}</span>
                <button className={styles.downloadBtn}>
                  <Download size={13} />
                  Descargar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
