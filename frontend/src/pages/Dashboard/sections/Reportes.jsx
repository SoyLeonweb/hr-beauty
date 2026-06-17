import { DollarSign, Package, Users, ShoppingBag, FileText, Megaphone } from 'lucide-react'
import styles from './sections.module.css'

const REPORTES = [
  { title:'Reporte de Ventas',       desc:'Ingresos, costos y margen por período.',       icon: DollarSign  },
  { title:'Inventario de Productos', desc:'Stock actual, bajos y agotados.',               icon: Package     },
  { title:'Base de Clientes',        desc:'Clientes registrados, VIP y nuevos.',           icon: Users       },
  { title:'Historial de Pedidos',    desc:'Todos los pedidos con estado y detalle.',       icon: ShoppingBag },
  { title:'Rentabilidad',            desc:'Ganancia bruta y neta por categoría.',          icon: FileText    },
  { title:'Campañas de Marketing',   desc:'Resultados de campañas activas y cerradas.',   icon: Megaphone   },
]

export default function Reportes() {
  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Reportes</h1>
      <div className={styles.reportGrid}>
        {REPORTES.map(r => {
          const Icon = r.icon
          return (
            <div key={r.title} className={styles.reportCard}>
              <div className={styles.reportIcon}><Icon size={22} /></div>
              <div>
                <p className={styles.reportTitle}>{r.title}</p>
                <p className={styles.reportDesc}>{r.desc}</p>
                <button className={styles.btnOutline}>Descargar</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
