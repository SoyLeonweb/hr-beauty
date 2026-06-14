import { Link } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import styles from './ProductCard.module.css'

const badgeClass = {
  bestseller: styles.badgeBestseller,
  nuevo:      styles.badgeNuevo,
  novedad:    styles.badgeNovedad,
  oferta:     styles.badgeOferta,
  premium:    styles.badgePremium,
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { id, name, price, rating, reviewCount, badge, image, slug } = product

  return (
    <div className={styles.card}>
      <Link to={`/producto/${slug || id}`} className={styles.imageWrapper}>
        {image
          ? <img src={image} alt={name} className={styles.image} />
          : <div className={styles.imagePlaceholder} />
        }
      </Link>

      <div className={styles.content}>
        {badge && (
          <span className={`${styles.badge} ${badgeClass[badge.type] || styles.badgeBestseller}`}>
            {badge.label}
          </span>
        )}

        <Link to={`/producto/${slug || id}`} className={styles.name}>{name}</Link>

        <div className={styles.meta}>
          <span className={styles.price}>€{Number(price).toFixed(2).replace('.', ',')}</span>
          {rating && (
            <span className={styles.rating}>★ {rating} ({reviewCount})</span>
          )}
        </div>

        <button className={styles.addBtn} onClick={() => addItem(product)}>
          Añadir al Carrito
        </button>
      </div>
    </div>
  )
}
