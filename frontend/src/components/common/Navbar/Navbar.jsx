import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { useAuth } from '../../../context/AuthContext'
import styles from './Navbar.module.css'


export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">HR Beauty</Link>
      </div>

      <div className={styles.navLinks}>
        <Link to="/" className={styles.colorUnico}>Inicio</Link>
        <Link to="/catalogo?categoria=maquillaje">Maquillaje</Link>
        <Link to="/catalogo?categoria=skincare">Skincare</Link>
        <Link to="/catalogo?categoria=mas-vendidos">Más Vendidos</Link>
        <Link to="/catalogo?categoria=novedades">Novedades</Link>
        <Link to="/contacto">Contacto</Link>
      </div>

      <div className={styles.navAction}>
        <input placeholder="Buscar" />
        <Link to="/favoritos">Favoritos</Link>
        <Link to="/carrito">Carrito ({count})</Link>
        <button onClick={() => navigate('/catalogo')}>COMPRAR AHORA </button>
      </div>

      <div className={styles.logIn}>
      {user ? <div><span>{user.name}</span>
      <button onClick={logout}>Salir</button>
      </div> :


       <div>
        <Link to="/login">Iniciar sesión</Link>
        <Link to="/registro">Registrarse</Link>
        </div>}

      </div>
    </nav>
  )
}
