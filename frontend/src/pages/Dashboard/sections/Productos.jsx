import { useState } from 'react'
import { Package, Search } from 'lucide-react'
import styles from './sections.module.css'

const PRODUCTOS = [
  { id: 1, nombre: 'Sérum Hyaluronic Glow',   categoria: 'Skincare',   precio: 89000,  stock: 142, ventas: 1245, estado: 'Activo'    },
  { id: 2, nombre: 'Vitamina C Radiance',      categoria: 'Skincare',   precio: 74000,  stock: 88,  ventas: 1102, estado: 'Activo'    },
  { id: 3, nombre: 'Protector Solar SPF50',    categoria: 'Skincare',   precio: 62000,  stock: 5,   ventas: 943,  estado: 'Bajo stock'},
  { id: 4, nombre: 'Crema Night Renewal',      categoria: 'Skincare',   precio: 98000,  stock: 67,  ventas: 822,  estado: 'Activo'    },
  { id: 5, nombre: 'Base Skin Perfect',        categoria: 'Maquillaje', precio: 115000, stock: 54,  ventas: 721,  estado: 'Activo'    },
  { id: 6, nombre: 'Labial Velvet Rose',       categoria: 'Maquillaje', precio: 38000,  stock: 0,   ventas: 698,  estado: 'Agotado'   },
  { id: 7, nombre: 'Paleta Sunset Eyes',       categoria: 'Maquillaje', precio: 145000, stock: 31,  ventas: 512,  estado: 'Activo'    },
  { id: 8, nombre: 'Shampoo Repair Intenso',   categoria: 'Cabello',    precio: 54000,  stock: 203, ventas: 489,  estado: 'Activo'    },
  { id: 9, nombre: 'Mascarilla Hidra Deep',    categoria: 'Cabello',    precio: 67000,  stock: 78,  ventas: 421,  estado: 'Activo'    },
  { id:10, nombre: 'Perfume Bloom 50ml',       categoria: 'Fragancias', precio: 189000, stock: 23,  ventas: 304,  estado: 'Activo'    },
]

const ESTADO_CLASS = { Activo: 'badgeGreen', 'Bajo stock': 'badgeOrange', Agotado: 'badgeRed' }

export default function Productos() {
  const [buscar, setBuscar] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const categorias = ['Todos', ...new Set(PRODUCTOS.map(p => p.categoria))]

  const filtrados = PRODUCTOS.filter(p => {
    const matchBuscar = p.nombre.toLowerCase().includes(buscar.toLowerCase())
    const matchFiltro = filtro === 'Todos' || p.categoria === filtro
    return matchBuscar && matchFiltro
  })

  return (
    <div className={styles.section}>
      <div className={styles.tableHeader}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Buscar producto..." value={buscar} onChange={e => setBuscar(e.target.value)} />
        </div>
        <div className={styles.filterTabs}>
          {categorias.map(c => (
            <button key={c} className={`${styles.filterTab} ${filtro === c ? styles.filterTabActive : ''}`} onClick={() => setFiltro(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Package size={15} className={styles.cardIconPurple} />
          <h2 className={styles.cardTitle}>Catálogo de Productos</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Producto</th>
              <th className={styles.th}>Categoría</th>
              <th className={styles.th}>Precio</th>
              <th className={styles.th}>Stock</th>
              <th className={styles.th}>Ventas</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id} className={styles.tableRow}>
                <td className={styles.tdBold}>{p.nombre}</td>
                <td className={styles.tdMuted}>{p.categoria}</td>
                <td className={styles.tdNormal}>${p.precio.toLocaleString()}</td>
                <td className={styles.tdNormal}>{p.stock}</td>
                <td className={styles.tdNormal}>{p.ventas.toLocaleString()}</td>
                <td><span className={`${styles.badge} ${styles[ESTADO_CLASS[p.estado]]}`}>{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
