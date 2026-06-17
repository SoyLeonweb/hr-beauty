import { useCart } from '../../../context/CartContext'
import styles from './CartItem.module.css'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
)
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const { id, name, price, qty, image, category } = item

  const lineTotal = price * qty

  return (
    <div className={styles.item}>
      {/* Imagen */}
      <div className={styles.imageWrapper}>
        {image
          ? <img src={image} alt={name} className={styles.image} />
          : <div className={styles.imagePlaceholder} />
        }
      </div>

      {/* Info */}
      <div className={styles.info}>
        {category && <span className={styles.category}>{category}</span>}
        <p className={styles.name}>{name}</p>
        <span className={styles.unitPrice}>${price.toLocaleString('es-CO')} / unidad</span>
      </div>

      {/* Qty control */}
      <div className={styles.qtyControl}>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQty(id, qty - 1)}
          aria-label="Reducir cantidad"
        >
          <MinusIcon />
        </button>
        <span className={styles.qty}>{qty}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQty(id, qty + 1)}
          aria-label="Aumentar cantidad"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Line total */}
      <span className={styles.lineTotal}>${lineTotal.toLocaleString('es-CO')}</span>

      {/* Remove */}
      <button
        className={styles.removeBtn}
        onClick={() => removeItem(id)}
        aria-label="Eliminar producto"
      >
        <TrashIcon />
      </button>
    </div>
  )
}
