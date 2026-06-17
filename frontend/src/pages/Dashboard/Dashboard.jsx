import { useState } from 'react'
import {
  LayoutDashboard, TrendingUp, Package, ShoppingBag, Users,
  FileText, Megaphone, Tag, Settings, DollarSign, ShoppingCart,
  UserPlus, BarChart2, Star, MapPin
} from 'lucide-react'
import styles from './Dashboard.module.css'
import Ventas        from './sections/Ventas'
import Productos     from './sections/Productos'
import Pedidos       from './sections/Pedidos'
import Clientes      from './sections/Clientes'
import Reportes      from './sections/Reportes'
import Marketing     from './sections/Marketing'
import Descuentos    from './sections/Descuentos'
import Configuracion from './sections/Configuracion'

const NAV_LINKS = [
  { label: 'Resumen',       icon: LayoutDashboard },
  { label: 'Ventas',        icon: TrendingUp      },
  { label: 'Productos',     icon: Package         },
  { label: 'Pedidos',       icon: ShoppingBag     },
  { label: 'Clientes',      icon: Users           },
  { label: 'Reportes',      icon: FileText        },
  { label: 'Marketing',     icon: Megaphone       },
  { label: 'Descuentos',    icon: Tag             },
  { label: 'Configuración', icon: Settings        },
]

const KPI_DATA = [
  { label: 'Ingresos del mes',  value: '$4.820.000', delta: '+12%', icon: DollarSign,   color: 'kpiPink'   },
  { label: 'Pedidos nuevos',    value: '138',         delta: '+8%',  icon: ShoppingCart, color: 'kpiPurple' },
  { label: 'Clientes nuevos',   value: '47',          delta: '+5%',  icon: UserPlus,     color: 'kpiBlue'   },
  { label: 'Productos activos', value: '67',          delta: '0%',   icon: Package,      color: 'kpiGreen'  },
]

const MONTHLY = [
  { mes: 'Ene', ventas: 2800000 },
  { mes: 'Feb', ventas: 3200000 },
  { mes: 'Mar', ventas: 2900000 },
  { mes: 'Abr', ventas: 3800000 },
  { mes: 'May', ventas: 4100000 },
  { mes: 'Jun', ventas: 4820000 },
]

const TOP_PRODUCTS = [
  { name: 'Sérum Vitamina C Bioaqua',   ventas: 118, rating: 4.9 },
  { name: 'Protector Solar AH Bioaqua', ventas: 91,  rating: 4.9 },
  { name: 'Mascarilla Velo de Rosas',   ventas: 104, rating: 4.8 },
  { name: 'Sérum Centella Bioaqua',     ventas: 93,  rating: 4.8 },
  { name: 'Crema Aloe Vera Bioaqua',    ventas: 82,  rating: 4.8 },
]

const SECCIONES = {
  'Ventas':        <Ventas />,
  'Productos':     <Productos />,
  'Pedidos':       <Pedidos />,
  'Clientes':      <Clientes />,
  'Reportes':      <Reportes />,
  'Marketing':     <Marketing />,
  'Descuentos':    <Descuentos />,
  'Configuración': <Configuracion />,
}

const maxVentas = Math.max(...MONTHLY.map(m => m.ventas))

function ResumenGeneral() {
  return (
    <div className={styles.content}>
      <h1 className={styles.pageTitle}>Resumen General</h1>

      <div className={styles.kpiGrid}>
        {KPI_DATA.map(k => {
          const Icon = k.icon
          const positive = !k.delta.startsWith('-') && k.delta !== '0%'
          return (
            <div key={k.label} className={`${styles.kpiCard} ${styles[k.color]}`}>
              <div className={styles.kpiIconWrap}><Icon size={20} /></div>
              <div>
                <p className={styles.kpiLabel}>{k.label}</p>
                <p className={styles.kpiValue}>{k.value}</p>
                <span className={positive ? styles.kpiDeltaUp : styles.kpiDeltaNeutral}>
                  {k.delta} este mes
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}><BarChart2 size={18} /><span>Ventas mensuales</span></div>
          <div className={styles.barChart}>
            {MONTHLY.map(m => (
              <div key={m.mes} className={styles.barGroup}>
                <div className={styles.bar} style={{ height: `${(m.ventas / maxVentas) * 140}px` }} title={`$${m.ventas.toLocaleString()}`} />
                <span className={styles.barLabel}>{m.mes}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}><Star size={18} /><span>Top productos</span></div>
          <table className={styles.topTable}>
            <thead><tr><th>Producto</th><th>Ventas</th><th>Rating</th></tr></thead>
            <tbody>
              {TOP_PRODUCTS.map(p => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td className={styles.tdCenter}>{p.ventas}</td>
                  <td className={styles.tdCenter}>⭐ {p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.statItem}><MapPin size={16} /><span>Ciudad top: <strong>Bogotá</strong></span></div>
        <div className={styles.statItem}><TrendingUp size={16} /><span>Categoría top: <strong>Skincare</strong></span></div>
        <div className={styles.statItem}><ShoppingCart size={16} /><span>Ticket promedio: <strong>$34.928</strong></span></div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('Resumen')

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandName}>HR Beauty</span>
          <span className={styles.brandSub}>Admin</span>
        </div>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`${styles.navLink} ${activeSection === label ? styles.navLinkActive : ''}`}
              onClick={() => setActiveSection(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        {activeSection === 'Resumen' ? <ResumenGeneral /> : SECCIONES[activeSection]}
      </main>
    </div>
  )
}
