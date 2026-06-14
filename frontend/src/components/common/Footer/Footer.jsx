import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const LINKS = {
  Tienda:    [
    { label: 'Maquillaje',   href: '/catalogo?categoria=maquillaje' },
    { label: 'Skincare',     href: '/catalogo?categoria=skincare' },
    { label: 'Más Vendidos', href: '/catalogo?categoria=mas-vendidos' },
    { label: 'Novedades',    href: '/catalogo?categoria=novedades' },
  ],
  Ayuda: [
    { label: 'Contacto',     href: '/contacto' },
    { label: 'Devoluciones', href: '/devoluciones' },
    { label: 'Envíos',       href: '/envios' },
    { label: 'FAQ',          href: '/faq' },
  ],
  Cuenta: [
    { label: 'Iniciar sesión', href: '/login' },
    { label: 'Registrarse',    href: '/registro' },
    { label: 'Mis pedidos',    href: '/pedidos' },
    { label: 'Favoritos',      href: '/favoritos' },
  ],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>

        <div className={styles.brand}>
          <span className={styles.logo}>HR Beauty</span>
          <p className={styles.tagline}>Belleza que cuida de ti.</p>
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.social}>IG</a>
            <a href="https://tiktok.com"    target="_blank" rel="noreferrer" className={styles.social}>TK</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className={styles.social}>PT</a>
          </div>
        </div>

        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group} className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>{group}</h4>
            <ul className={styles.linkList}>
              {items.map(item => (
                <li key={item.label}>
                  <Link to={item.href} className={styles.link}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} HR Beauty. Todos los derechos reservados.</p>
        <div className={styles.legal}>
          <Link to="/privacidad" className={styles.link}>Privacidad</Link>
          <Link to="/terminos"   className={styles.link}>Términos</Link>
        </div>
      </div>
    </footer>
  )
}
