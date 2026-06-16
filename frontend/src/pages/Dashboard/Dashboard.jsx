import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  LayoutDashboard, TrendingUp, Package, ShoppingBag, Users,
  FileText, Megaphone, Tag, Settings,
  DollarSign, ShoppingCart, UserPlus, BarChart2,
  Star, MapPin
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

const VENTAS_MES = [
  { mes: 'Ene', ventas: 68400 },
  { mes: 'Feb', ventas: 72100 },
  { mes: 'Mar', ventas: 65800 },
  { mes: 'Abr', ventas: 89200 },
  { mes: 'May', ventas: 124850 },
  { mes: 'Jun', ventas: 98300 },
  { mes: 'Jul', ventas: 110500 },
  { mes: 'Ago', ventas: 105200 },
  { mes: 'Sep', ventas: 118700 },
  { mes: 'Oct', ventas: 132400 },
  { mes: 'Nov', ventas: 145600 },
  { mes: 'Dic', ventas: 158900 },
]

const PRODUCTOS_TOP = [
  { nombre: 'Sérum Hyaluronic Glow', ventas: 1245 },
  { nombre: 'Vitamina C Radiance',   ventas: 1102 },
  { nombre: 'Protector Solar SPF50', ventas: 943  },
  { nombre: 'Crema Night Renewal',   ventas: 822  },
  { nombre: 'Base Skin Perfect',     ventas: 721  },
]

const PEDIDOS_RECIENTES = [
  { id: '#12548', cliente: 'María González', monto: 46000,  estado: 'Entregado',  fecha: '31 May 2024' },
  { id: '#12547', cliente: 'Laura Martínez', monto: 83000,  estado: 'Enviado',    fecha: '31 May 2024' },
  { id: '#12546', cliente: 'Andrea Ruiz',    monto: 39000,  estado: 'Procesando', fecha: '30 May 2024' },
  { id: '#12545', cliente: 'Sofía Pérez',    monto: 104000, estado: 'Entregado',  fecha: '30 May 2024' },
]

const NAV_LINKS = [
  { label: 'Resumen General', icon: LayoutDashboard },
  { label: 'Ventas',          icon: TrendingUp      },
  { label: 'Productos',       icon: Package         },
  { label: 'Pedidos',         icon: ShoppingBag     },
  { label: 'Clientes',        icon: Users           },
  { label: 'Reportes',        icon: FileText        },
  { label: 'Marketing',       icon: Megaphone       },
  { label: 'Descuentos',      icon: Tag             },
  { label: 'Configuración',   icon: Settings        },
]

const KPI_DATA = [
  { label: 'Ventas Totales',  value: '$124.850', delta: '+23.5%', icon: DollarSign,  color: 'kpiPink'   },
  { label: 'Pedidos',         value: '1.248',    delta: '+18.4%', icon: ShoppingCart, color: 'kpiPurple' },
  { label: 'Clientes Nuevos', value: '583',      delta: '+15.7%', icon: UserPlus,    color: 'kpiBlue'   },
  { label: 'Tasa Conversión', value: '3.24%',    delta: '+8.2%',  icon: BarChart2,   color: 'kpiGreen'  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipVal}>${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

function ResumenGeneral({ estadoBadge }) {
  return (
    <>
      <div className={styles.kpiGrid}>
        {KPI_DATA.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`${styles.kpiCard} ${styles[kpi.color]}`}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <div className={styles.kpiIconBox}>
                  <Icon size={18} />
                </div>
              </div>
              <span className={styles.kpiValue}>{kpi.value}</span>
              <span className={styles.kpiDelta}>{kpi.delta} vs mes anterior</span>
            </div>
          )
        })}
      </div>

      <div className={styles.midRow}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <TrendingUp size={16} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Ventas por mes</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={VENTAS_MES} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ventasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF6FAE" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF6FAE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF6FAE', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone" dataKey="ventas"
                stroke="#FF6FAE" strokeWidth={2.5}
                fill="url(#ventasGrad)"
                dot={false} activeDot={{ r: 5, fill: '#FF6FAE', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.productsCard}>
          <div className={styles.cardHeader}>
            <Star size={16} className={styles.cardIconPurple} />
            <h2 className={styles.cardTitle}>Productos más Vendidos</h2>
          </div>
          <ul className={styles.productList}>
            {PRODUCTOS_TOP.map((p, i) => (
              <li key={i} className={styles.productRow}>
                <div className={`${styles.productThumb} ${styles[`rank${i+1}`]}`}>
                  <span className={styles.rankNum}>{i + 1}</span>
                </div>
                <span className={styles.productName}>{p.nombre}</span>
                <span className={styles.productSales}>{p.ventas.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.mapCard}>
          <div className={styles.cardHeader}>
            <MapPin size={16} className={styles.cardIconBlue} />
            <h2 className={styles.cardTitle}>Clientes por Ubicación</h2>
          </div>
          <div className={styles.mapPlaceholder} />
        </div>
      </div>

      <div className={styles.ordersCard}>
        <div className={styles.cardHeader}>
          <ShoppingBag size={16} className={styles.cardIconGreen} />
          <h2 className={styles.cardTitle}>Pedidos Recientes</h2>
        </div>
        <table className={styles.table}>
          <tbody>
            {PEDIDOS_RECIENTES.map(p => (
              <tr key={p.id} className={styles.tableRow}>
                <td className={styles.tdId}>{p.id}</td>
                <td className={styles.tdCliente}>{p.cliente}</td>
                <td className={styles.tdMonto}>${p.monto.toLocaleString()}</td>
                <td><span className={estadoBadge(p.estado)}>{p.estado}</span></td>
                <td className={styles.tdFecha}>{p.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

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

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Resumen General')

  const estadoBadge = (estado) => {
    const map = { Entregado: styles.badgeGreen, Enviado: styles.badgeBlue, Procesando: styles.badgeOrange }
    return `${styles.badge} ${map[estado] || ''}`
  }

  const ActiveIcon = NAV_LINKS.find(n => n.label === activeNav)?.icon

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.pageTitleRow}>
            {ActiveIcon && <ActiveIcon size={22} className={styles.pageTitleIcon} />}
            <h1 className={styles.pageTitle}>{activeNav}</h1>
          </div>
          <div className={styles.datePicker}>1 May – 31 May 2024 ▾</div>
        </div>

        {activeNav === 'Resumen General'
          ? <ResumenGeneral estadoBadge={estadoBadge} />
          : SECCIONES[activeNav]
        }
      </main>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandDot} />
          HR Beauty
        </div>
        <nav className={styles.sidebarNav}>
          {NAV_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`${styles.navLink} ${activeNav === label ? styles.navLinkActive : ''}`}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={16} className={styles.navIcon} />
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  )
}
