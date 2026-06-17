import { useState } from 'react'
import { Search } from 'lucide-react'
import styles from './sections.module.css'

const CLIENTES = [
  { id:'C-001', nombre:'Laura Martínez',   email:'laura@email.com',   pedidos:12, total:420000, tipo:'VIP'      },
  { id:'C-002', nombre:'Valentina Ríos',   email:'vale@email.com',    pedidos:7,  total:210000, tipo:'Frecuente' },
  { id:'C-003', nombre:'Camila Torres',    email:'cami@email.com',    pedidos:3,  total:95000,  tipo:'Nuevo'     },
  { id:'C-004', nombre:'Sofía Herrera',    email:'sofi@email.com',    pedidos:15, total:580000, tipo:'VIP'       },
  { id:'C-005', nombre:'Isabella López',   email:'isa@email.com',     pedidos:5,  total:160000, tipo:'Frecuente' },
  { id:'C-006', nombre:'Mariana Gómez',    email:'mari@email.com',    pedidos:1,  total:46000,  tipo:'Nuevo'     },
  { id:'C-007', nombre:'Alejandra Ruiz',   email:'ale@email.com',     pedidos:9,  total:310000, tipo:'Frecuente' },
  { id:'C-008', nombre:'Natalia Castro',   email:'nat@email.com',     pedidos:20, total:740000, tipo:'VIP'       },
  { id:'C-009', nombre:'Daniela Moreno',   email:'dani@email.com',    pedidos:2,  total:54000,  tipo:'Nuevo'     },
  { id:'C-010', nombre:'Paula Jiménez',    email:'pau@email.com',     pedidos:6,  total:190000, tipo:'Frecuente' },
]

const BADGE = { 'VIP':'badgePink', 'Frecuente':'badgeBlue', 'Nuevo':'badgeGreen' }

export default function Clientes() {
  const [search, setSearch] = useState('')

  const lista = CLIENTES.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.section}>
      <h1 className={styles.sectionTitle}>Clientes</h1>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className={styles.table}>
          <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Pedidos</th><th>Total gastado</th><th>Tipo</th></tr></thead>
          <tbody>
            {lista.map(c => (
              <tr key={c.id}>
                <td style={{ color:'#9ca3af', fontSize:12 }}>{c.id}</td>
                <td style={{ fontWeight:600 }}>{c.nombre}</td>
                <td style={{ color:'#6b7280' }}>{c.email}</td>
                <td>{c.pedidos}</td>
                <td>${c.total.toLocaleString()}</td>
                <td><span className={`${styles.badge} ${styles[BADGE[c.tipo]]}`}>{c.tipo}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
