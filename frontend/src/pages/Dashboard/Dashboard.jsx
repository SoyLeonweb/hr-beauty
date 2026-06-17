import { useState } from 'react'
import {
  LayoutDashboard, TrendingUp, Package, ShoppingBag, Users,
  FileText, Megaphone, Tag, Settings, DollarSign, ShoppingCart,
  UserPlus, Star, MapPin, ArrowUpRight
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
  { name: 'Sérum Vitamina C',     ventas: 118, max: 118, rating: 4.9 },
  { name: 'Mascarilla Velo Rosas',ventas: 104, max: 118, rating: 4.8 },
  { name: 'Protector Solar AH',   ventas: 91,  max: 118, rating: 4.9 },
  { name: 'Sérum Centella',       ventas: 93,  max: 118, rating: 4.8 },
  { name: 'Crema Aloe Vera',      ventas: 82,  max: 118, rating: 4.8 },
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

/* ── SVG Area Chart ─────────────────────────────────────────── */
function AreaChart({ data }) {
  const W = 520, H = 180
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 }
  const iW = W - PAD.left - PAD.right
  const iH = H - PAD.top  - PAD.bottom

  const maxV = Math.max(...data.map(d => d.ventas))
  const minV = Math.min(...data.map(d => d.ventas)) * 0.7

  const xOf = i  => PAD.left + (i / (data.length - 1)) * iW
  const yOf = v  => PAD.top  + iH - ((v - minV) / (maxV - minV)) * iH

  // Smooth cubic bezier
  const pts = data.map((d, i) => ({ x: xOf(i), y: yOf(d.ventas) }))
  const cp  = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

  let linePath = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], curr = pts[i]
    const mid1 = { x: (prev.x + curr.x) / 2, y: prev.y }
    const mid2 = { x: (prev.x + curr.x) / 2, y: curr.y }
    linePath += ` C ${mid1.x} ${mid1.y}, ${mid2.x} ${mid2.y}, ${curr.x} ${curr.y}`
  }

  const areaPath = linePath
    + ` L ${pts[pts.length-1].x} ${PAD.top + iH}`
    + ` L ${pts[0].x} ${PAD.top + iH} Z`

  const yLabels = [maxV, (maxV + minV) / 2, minV]
  const fmt = v => v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : `$${Math.round(v/1000)}k`

  const [tooltip, setTooltip] = useState(null)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svgChart}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF6FAE" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FF6FAE" stopOpacity="0.01" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {yLabels.map((v, i) => {
        const y = yOf(v)
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
              stroke="#f0eaf5" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end"
              fontSize="10" fill="#c4b5d4" fontFamily="Poppins, sans-serif">
              {fmt(v)}
            </text>
          </g>
        )
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#FF6FAE" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

      {/* Points + tooltips */}
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setTooltip(i)} onMouseLeave={() => setTooltip(null)}
          style={{ cursor: 'pointer' }}>
          <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
          <circle cx={p.x} cy={p.y} r={tooltip === i ? 6 : 4}
            fill="#fff" stroke="#FF6FAE" strokeWidth="2.5"
            style={{ transition: 'r 0.15s' }} />
          {tooltip === i && (
            <g>
              <rect x={p.x - 38} y={p.y - 36} width="76" height="24"
                rx="6" fill="#1e1826" />
              <text x={p.x} y={p.y - 20} textAnchor="middle"
                fontSize="11" fill="#fff" fontWeight="600" fontFamily="Poppins, sans-serif">
                {fmt(data[i].ventas)}
              </text>
            </g>
          )}
        </g>
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle"
          fontSize="11" fill="#9ca3af" fontFamily="Poppins, sans-serif">
          {d.mes}
        </text>
      ))}
    </svg>
  )
}

/* ── Horizontal bar chart for top products ──────────────────── */
function ProductBars({ data }) {
  const maxV = data[0].ventas
  return (
    <div className={styles.prodBars}>
      {data.map((p, i) => (
        <div key={p.name} className={styles.prodBarRow}>
          <span className={styles.prodRank}>{i + 1}</span>
          <div className={styles.prodBarInfo}>
            <div className={styles.prodBarMeta}>
              <span className={styles.prodBarName}>{p.name}</span>
              <span className={styles.prodBarVal}>{p.ventas} uds · ⭐{p.rating}</span>
            </div>
            <div className={styles.prodBarTrack}>
              <div
                className={styles.prodBarFill}
                style={{ width: `${(p.ventas / maxV) * 100}%`, '--delay': `${i * 80}ms` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ResumenGeneral() {
  return (
    <div className={styles.content}>
      <div className={styles.contentHeader}>
        <div>
          <h1 className={styles.pageTitle}>Resumen General</h1>
          <p className={styles.pageSubtitle}>Junio 2025 · actualizado hace 5 min</p>
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        {KPI_DATA.map(k => {
          const Icon     = k.icon
          const positive = !k.delta.startsWith('-') && k.delta !== '0%'
          return (
            <div key={k.label} className={`${styles.kpiCard} ${styles[k.color]}`}>
              <div className={styles.kpiIconWrap}><Icon size={20} /></div>
              <div className={styles.kpiBody}>
                <p className={styles.kpiLabel}>{k.label}</p>
                <p className={styles.kpiValue}>{k.value}</p>
                <span className={positive ? styles.kpiDeltaUp : styles.kpiDeltaNeutral}>
                  <ArrowUpRight size={11} /> {k.delta} este mes
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleGroup}>
              <p className={styles.chartTitle}>Ventas mensuales</p>
              <p className={styles.chartSub}>Ingresos en COP</p>
            </div>
            <span className={styles.chartBadge}>+12% vs mayo</span>
          </div>
          <AreaChart data={MONTHLY} />
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleGroup}>
              <p className={styles.chartTitle}>Top productos</p>
              <p className={styles.chartSub}>Por unidades vendidas</p>
            </div>
          </div>
          <ProductBars data={TOP_PRODUCTS} />
        </div>
      </div>

      {/* Quick stats */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><MapPin size={16} /></div>
          <div><p className={styles.statLabel}>Ciudad top</p><strong className={styles.statVal}>Bogotá</strong></div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><TrendingUp size={16} /></div>
          <div><p className={styles.statLabel}>Categoría top</p><strong className={styles.statVal}>Skincare</strong></div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><ShoppingCart size={16} /></div>
          <div><p className={styles.statLabel}>Ticket promedio</p><strong className={styles.statVal}>$34.928</strong></div>
        </div>
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
          <span className={styles.brandSub}>Admin Panel</span>
        </div>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`${styles.navLink} ${activeSection === label ? styles.navLinkActive : ''}`}
              onClick={() => setActiveSection(label)}
            >
              <Icon size={17} />
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
