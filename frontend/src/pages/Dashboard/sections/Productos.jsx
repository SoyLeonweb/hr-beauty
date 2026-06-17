import { useState } from 'react'
import { Package, Search } from 'lucide-react'
import styles from './sections.module.css'

const PRODUCTOS = [
  { id:'BIO-SR-002', name:'Sérum Vitamina C 100ML Bioaqua',    tipo:'Sérum Facial',    precio:22000, stock:42, estado:'Activo'    },
  { id:'BIO-PS-003', name:'Protector Solar ÁH Bioaqua',        tipo:'Protector Solar',  precio:24000, stock:18, estado:'Bajo stock' },
  { id:'BIO-MAS-007',name:'Mascarilla Velo de Rosas Bioaqua',  tipo:'Mascarilla Facial',precio:8000,  stock:0,  estado:'Agotado'   },
  { id:'BIO-CRE-004',name:'Crema Aloe Vera Bioaqua',           tipo:'Crema Facial',    precio:17000, stock:55, estado:'Activo'    },
  { id:'BIO-CON-004',name:'Contorno ÁH Azul Bioaqua',          tipo:'Contorno de Ojos',precio:14000, stock:31, estado:'Activo'    },
  { id:'BIO-SR-006', name:'Sérum de Oro Bioaqua',              tipo:'Sérum Facial',    precio:25000, stock:12, estado:'Bajo stock' },
  { id:'BIO-JAB-006',name:'Jabón Vitamina C Bioaqua',          tipo:'Jabón Facial',    precio:3500,  stock:88, estado:'Activo'    },
  { id:'RUB-SR-005', name:'Sérum Antiedad Rubyskin',           tipo:'Sérum Facial',    precio:22000, stock:27, estado:'Activo'    },
  { id:'BIO-COL-003',name:'Colágeno Ojeras Centella Bioaqua',  tipo:'Tarro de Ojeras', precio:14000, stock:5,  estado:'Bajo stock' },
  { id:'BIO-PL-003', name:'Parche de Labios ÁH Bioaqua',       tipo:'Parche de Labios',precio:10000, stock:0,  estado:'Agotado'   },
]

const BADGE = { 'Activo': 'badgeGreen', 'Bajo stock': 'badgeOrange', 'Agotado': 'badgeRed' }

export default function Productos() {
  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState('')

  const lista = PRODUCTOS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filtro === '' || p.estado === filtro)
  )

  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Productos</h1>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className={styles.select} value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            <option>Activo</option>
            <option>Bajo stock</option>
            <option>Agotado</option>
          </select>
        </div>
        <table className={styles.table}>
          <thead><tr><th>ID</th><th>Nombre</th><th>Tipo</th><th>Precio</th><th>Stock</th><th>Estado</th></tr></thead>
          <tbody>
            {lista.map(p => (
              <tr key={p.id}>
                <td style={{ color:'#9ca3af', fontSize:12 }}>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.tipo}</td>
                <td>${p.precio.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td><span className={`${styles.badge} ${styles[BADGE[p.estado]]}`}>{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
