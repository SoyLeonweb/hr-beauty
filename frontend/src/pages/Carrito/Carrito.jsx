import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import CartItem from '../../components/cart/CartItem'
import CartSummary from '../../components/cart/CartSummary'
import styles from './Carrito.module.css'

const ShoppingBagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export default function Carrito() {
  const { items, clearCart, count } = useCart()

  const isEmpty = items.length === 0

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Inicio</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Carrito</span>
        </nav>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>
            Mi Carrito
            {count > 0 && <span className={styles.countBadge}>{count}</span>}
          </h1>
          {!isEmpty && (
            <button className={styles.clearBtn} onClick={clearCart}>
              <TrashIcon /> Vaciar carrito
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        /* ── Empty state ── */
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><ShoppingBagIcon /></div>
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyDesc}>
            Aún no has añadido ningún producto. Explora nuestra colección y encuentra lo que necesitas.
          </p>
          <Link to="/catalogo" className={styles.emptyBtn}>Ir al catálogo</Link>
          <div className={styles.emptyLinks}>
            <Link to="/catalogo?categoria=mas-vendidos" className={styles.emptyLink}>Más vendidos</Link>
            <span>·</span>
            <Link to="/catalogo?categoria=novedades" className={styles.emptyLink}>Novedades</Link>
            <span>·</span>
            <Link to="/catalogo?categoria=skincare" className={styles.emptyLink}>Skincare</Link>
          </div>
        </div>
      ) : (
        /* ── Cart layout ── */
        <div className={styles.layout}>

          {/* Items list */}
          <div className={styles.itemsCol}>
            <div className={styles.itemsHeader}>
              <span>Producto</span>
              <span className={styles.colQty}>Cantidad</span>
              <span className={styles.colTotal}>Total</span>
              <span />
            </div>
            <div className={styles.itemsList}>
              {items.map(item => <CartItem key={item.id} item={item} />)}
            </div>
            <div className={styles.continueRow}>
              <Link to="/catalogo" className={styles.continueLink}>
                ← Seguir comprando
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summaryCol}>
            <CartSummary />
          </div>

        </div>
      )}
    </div>
  )
}
