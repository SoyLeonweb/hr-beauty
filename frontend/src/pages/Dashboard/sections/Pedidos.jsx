import { useState } from 'react'
import { ShoppingBag, Search } from 'lucide-react'
import styles from './sections.module.css'

const PEDIDOS = [
  { id: '#12548', cliente: 'María González',  monto: 46000,  items: 2, estado: 'Entregado',  fecha: '31 May 2024' },
  { id: '#12547', cliente: 'Laura Martínez',  monto: 83000,  items: 3, estado: 'Enviado',    fecha: '31 May 2024' },
  { id: '#12546', cliente: 'Andrea Ruiz',     monto: 39000,  items: 1, estado: 'Procesando', fecha: '30 May 2024' },
  { id: '#12545', cliente: 'Sofía Pérez',     monto: 104000, items: 4, estado: 'Entregado',  fecha: '30 May 2024' },
  { id: '#12544', cliente: 'Valentina López', monto: 67000,  items: 2, estado: 'Enviado',    fecha: '29 May 2024' },
  { id: '#12543', cliente: 'Daniela Torres',  monto: 31000,  items: 1, estado: 'Cancelado',  fecha: '29 May 2024' },
  { id: '#12542', cliente: 'Camila Herrera',  monto: 128000, items: 5, estado: 'Entregado',  fecha: '28 May 2024' },
  { id: '#12541', cliente: 'Isabella Mora',   monto: 55000,  items: 2, estado: 'Procesando', fecha: '28 May 2024' },
  { id: '#12540', cliente: 'Mariana Castro',  monto: 89000,  items: 3, estado: 'Entregado',  fecha: '27 May 2024' },
  { id: '#12539', cliente: 'Natalia Vargas',  monto: 42000,  items: 2, estado: 'Enviado',    fecha: '27 May 2024' },
]

const ESTADO_CLASS = { Entregado: 'badgeGreen', Enviado: 'badgeBlue', Procesando: 'badgeOrange', Cancelado: 'badgeRed' }

export default function Pedidos() {
  const [buscar, setBuscar] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const estados = ['Todos', 'Procesando', 'Enviado', 'Entregado', 'Cancelado']

  const filtrados = PEDIDOS.filter(p => {
    const matchBuscar = p.cliente.toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar)
    const matchFiltro = filtro === 'Todos' || p.estado === filtro
    return matchBuscar && matchFiltro
  })

  return (
    <div className={styles.section}>
      <div className={styles.tableHeader}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Buscar por cliente o ID..." value={buscar} onChange={e => setBuscar(e.target.value)} />
        </div>
        <div className={styles.filterTabs}>
          {estados.map(e => (
            <button key={e} className={`${styles.filterTab} ${filtro === e ? styles.filterTabActive : ''}`} onClick={() => setFiltro(e)}>{e}</button>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <ShoppingBag size={15} className={styles.cardIconGreen} />
          <h2 className={styles.cardTitle}>Lista de Pedidos</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Cliente</th>
              <th className={styles.th}>Monto</th>
              <th className={styles.th}>Ítems</th>
              <th className={styles.th}>Estado</th>
              <th className={styles.th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id} className={styles.tableRow}>
                <td className={styles.tdBold}>{p.id}</td>
                <td className={styles.tdNormal}>{p.cliente}</td>
                <td className={styles.tdNormal}>${p.monto.toLocaleString()}</td>
                <td className={styles.tdMuted}>{p.items}</td>
                <td><span className={`${styles.badge} ${styles[ESTADO_CLASS[p.estado]]}`}>{p.estado}</span></td>
                <td className={styles.tdMuted}>{p.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
