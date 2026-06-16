import { useState } from 'react'
import { Users, Search } from 'lucide-react'
import styles from './sections.module.css'

const CLIENTES = [
  { id: 1, nombre: 'María González',  email: 'maria@gmail.com',   pedidos: 12, total: 548000,  ultimo: '31 May 2024', tipo: 'VIP'      },
  { id: 2, nombre: 'Laura Martínez',  email: 'laura@gmail.com',   pedidos: 8,  total: 362000,  ultimo: '31 May 2024', tipo: 'Frecuente'},
  { id: 3, nombre: 'Andrea Ruiz',     email: 'andrea@gmail.com',  pedidos: 5,  total: 198000,  ultimo: '30 May 2024', tipo: 'Frecuente'},
  { id: 4, nombre: 'Sofía Pérez',     email: 'sofia@gmail.com',   pedidos: 15, total: 820000,  ultimo: '30 May 2024', tipo: 'VIP'      },
  { id: 5, nombre: 'Valentina López', email: 'vale@gmail.com',    pedidos: 3,  total: 124000,  ultimo: '29 May 2024', tipo: 'Nuevo'    },
  { id: 6, nombre: 'Daniela Torres',  email: 'daniela@gmail.com', pedidos: 7,  total: 287000,  ultimo: '29 May 2024', tipo: 'Frecuente'},
  { id: 7, nombre: 'Camila Herrera',  email: 'camila@gmail.com',  pedidos: 21, total: 1140000, ultimo: '28 May 2024', tipo: 'VIP'      },
  { id: 8, nombre: 'Isabella Mora',   email: 'isa@gmail.com',     pedidos: 1,  total: 55000,   ultimo: '28 May 2024', tipo: 'Nuevo'    },
  { id: 9, nombre: 'Mariana Castro',  email: 'mariana@gmail.com', pedidos: 9,  total: 415000,  ultimo: '27 May 2024', tipo: 'Frecuente'},
  { id:10, nombre: 'Natalia Vargas',  email: 'nata@gmail.com',    pedidos: 4,  total: 168000,  ultimo: '27 May 2024', tipo: 'Frecuente'},
]

const TIPO_CLASS = { VIP: 'badgePink', Frecuente: 'badgeBlue', Nuevo: 'badgeGreen' }

export default function Clientes() {
  const [buscar, setBuscar] = useState('')
  const filtrados = CLIENTES.filter(c =>
    c.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    c.email.toLowerCase().includes(buscar.toLowerCase())
  )

  return (
    <div className={styles.section}>
      <div className={styles.tableHeader}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Buscar cliente..." value={buscar} onChange={e => setBuscar(e.target.value)} />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Users size={15} className={styles.cardIconBlue} />
          <h2 className={styles.cardTitle}>Base de Clientes</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Cliente</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Pedidos</th>
              <th className={styles.th}>Total gastado</th>
              <th className={styles.th}>Último pedido</th>
              <th className={styles.th}>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(c => (
              <tr key={c.id} className={styles.tableRow}>
                <td className={styles.tdBold}>{c.nombre}</td>
                <td className={styles.tdMuted}>{c.email}</td>
                <td className={styles.tdNormal}>{c.pedidos}</td>
                <td className={styles.tdNormal}>${c.total.toLocaleString()}</td>
                <td className={styles.tdMuted}>{c.ultimo}</td>
                <td><span className={`${styles.badge} ${styles[TIPO_CLASS[c.tipo]]}`}>{c.tipo}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
