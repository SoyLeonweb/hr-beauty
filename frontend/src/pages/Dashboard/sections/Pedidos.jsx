import { useState } from 'react'
import { Search } from 'lucide-react'
import styles from './sections.module.css'

const PEDIDOS = [
  { id:'#4521', cliente:'Laura Martínez',   fecha:'2024-06-15', total:46000,  items:3, estado:'Entregado'  },
  { id:'#4520', cliente:'Valentina Ríos',   fecha:'2024-06-15', total:22000,  items:1, estado:'Enviado'    },
  { id:'#4519', cliente:'Camila Torres',    fecha:'2024-06-14', total:68000,  items:4, estado:'Procesando' },
  { id:'#4518', cliente:'Sofía Herrera',    fecha:'2024-06-14', total:14000,  items:1, estado:'Entregado'  },
  { id:'#4517', cliente:'Isabella López',   fecha:'2024-06-13', total:35000,  items:2, estado:'Cancelado'  },
  { id:'#4516', cliente:'Mariana Gómez',    fecha:'2024-06-13', total:49000,  items:3, estado:'Entregado'  },
  { id:'#4515', cliente:'Alejandra Ruiz',   fecha:'2024-06-12', total:25000,  items:2, estado:'Enviado'    },
  { id:'#4514', cliente:'Natalia Castro',   fecha:'2024-06-12', total:17000,  items:1, estado:'Procesando' },
  { id:'#4513', cliente:'Daniela Moreno',   fecha:'2024-06-11', total:88000,  items:5, estado:'Entregado'  },
  { id:'#4512', cliente:'Paula Jiménez',    fecha:'2024-06-11', total:32000,  items:2, estado:'Enviado'    },
]

const BADGE = { 'Entregado':'badgeGreen', 'Enviado':'badgeBlue', 'Procesando':'badgeOrange', 'Cancelado':'badgeRed' }

export default function Pedidos() {
  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState('')

  const lista = PEDIDOS.filter(p =>
    (p.id.includes(search) || p.cliente.toLowerCase().includes(search.toLowerCase())) &&
    (filtro === '' || p.estado === filtro)
  )

  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Pedidos</h1>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Buscar pedido o cliente..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className={styles.select} value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="">Todos</option>
            <option>Entregado</option>
            <option>Enviado</option>
            <option>Procesando</option>
            <option>Cancelado</option>
          </select>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Ítems</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>
            {lista.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight:600, color:'#FF6FAE' }}>{p.id}</td>
                <td>{p.cliente}</td>
                <td style={{ color:'#9ca3af', fontSize:12 }}>{p.fecha}</td>
                <td>{p.items}</td>
                <td>${p.total.toLocaleString()}</td>
                <td><span className={`${styles.badge} ${styles[BADGE[p.estado]]}`}>{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
