import { Link } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { useAuth } from '../../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>HR Beauty</Link>
      <div className={styles.links}>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito ({count})</Link>
        {user ? <button onClick={logout}>Salir</button> : <Link to="/login">Entrar</Link>}
      </div>
    </nav>
  )
}
