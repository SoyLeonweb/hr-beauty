import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { useAuth } from '../../../context/AuthContext'
import styles from './Navbar.module.css'
import logo from '../../../assets/images/Logo/logofinal.png'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
)

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <Link to="/"><img src={logo} alt="HR Beauty" /></Link>
      </div>

      <div className={styles.navLinks}>
        <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Inicio</NavLink>
        <Link to="/catalogo?categoria=maquillaje" className={styles.navLink}>Maquillaje</Link>
        <Link to="/catalogo?categoria=skincare" className={styles.navLink}>Skincare</Link>
        <Link to="/catalogo?categoria=mas-vendidos" className={styles.navLink}>Más Vendidos</Link>
        <Link to="/catalogo?categoria=novedades" className={styles.navLink}>Novedades</Link>
        <Link to="/contacto" className={styles.navLink}>Contacto</Link>
      </div>

      <div className={styles.navActions}>
        <Link to="/buscar" className={styles.iconLink} aria-label="Buscar">
          <SearchIcon />
        </Link>
        <Link to="/favoritos" className={styles.iconLink} aria-label="Favoritos">
          <HeartIcon />
        </Link>
        {user ? (
          <button className={styles.iconButton} onClick={logout} aria-label="Cerrar sesión">
            <UserIcon />
          </button>
        ) : (
          <Link to="/login" className={styles.iconLink} aria-label="Mi cuenta">
            <UserIcon />
          </Link>
        )}
        <Link to="/carrito" className={styles.iconLink} aria-label="Carrito">
          <span className={styles.cartWrapper}>
            <CartIcon />
            {count > 0 && <span className={styles.cartBadge}>{count}</span>}
          </span>
        </Link>
        <button className={styles.ctaButton} onClick={() => navigate('/catalogo')}>Comprar Ahora</button>
      </div>
    </nav>
  )
}
