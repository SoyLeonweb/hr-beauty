import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import styles from './CartSummary.module.css'

const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
)
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
    <rect x="9" y="11" width="14" height="10" rx="2" />
    <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
  </svg>
)
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export default function CartSummary() {
  const navigate = useNavigate()
  const {
    subtotal, discount, iva, shipping, shippingFree, total,
    couponCode, setCouponCode, appliedCoupon, applyCoupon, removeCoupon, couponError,
    SHIPPING_THRESHOLD, SHIPPING_COST, IVA_RATE, items,
  } = useCart()

  const [inputCode, setInputCode] = useState('')

  const handleApplyCoupon = () => {
    applyCoupon(inputCode)
    setInputCode('')
  }

  const remaining = SHIPPING_THRESHOLD - subtotal
  const freeShippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Resumen del pedido</h2>

      {/* Free shipping progress */}
      {!shippingFree && subtotal > 0 && (
        <div className={styles.shippingProgress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${freeShippingProgress}%` }} />
          </div>
          <p className={styles.progressText}>
            <TruckIcon />
            Te faltan <strong>${remaining.toLocaleString('es-CO')}</strong> para envío gratis
          </p>
        </div>
      )}
      {shippingFree && subtotal > 0 && (
        <div className={styles.shippingFreeAlert}>
          <TruckIcon />
          <span>¡Tienes envío gratis!</span>
        </div>
      )}

      {/* Coupon input */}
      <div className={styles.couponSection}>
        {appliedCoupon ? (
          <div className={styles.appliedCoupon}>
            <TagIcon />
            <span>{appliedCoupon.code} — {appliedCoupon.label}</span>
            <button className={styles.removeCoupon} onClick={removeCoupon}><XIcon /></button>
          </div>
        ) : (
          <>
            <label className={styles.couponLabel}>Código de descuento</label>
            <div className={styles.couponRow}>
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                placeholder="Ej. HRBEAUTY10"
                className={styles.couponInput}
              />
              <button
                className={styles.couponBtn}
                onClick={handleApplyCoupon}
                disabled={!inputCode.trim()}
              >
                Aplicar
              </button>
            </div>
            {couponError && <p className={styles.couponError}>{couponError}</p>}
          </>
        )}
      </div>

      {/* Totals */}
      <div className={styles.totals}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-CO')}</span>
        </div>

        {discount > 0 && (
          <div className={`${styles.row} ${styles.rowDiscount}`}>
            <span>Descuento ({appliedCoupon.value}%)</span>
            <span>−${discount.toLocaleString('es-CO')}</span>
          </div>
        )}

        <div className={styles.row}>
          <span>IVA ({Math.round(IVA_RATE * 100)}%)</span>
          <span>${iva.toLocaleString('es-CO')}</span>
        </div>

        <div className={styles.row}>
          <span>Envío</span>
          {shippingFree
            ? <span className={styles.freeTag}>Gratis</span>
            : <span>${SHIPPING_COST.toLocaleString('es-CO')}</span>
          }
        </div>

        <div className={`${styles.row} ${styles.rowTotal}`}>
          <span>Total</span>
          <span>${total.toLocaleString('es-CO')}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        className={styles.checkoutBtn}
        onClick={() => navigate('/checkout')}
        disabled={items.length === 0}
      >
        Proceder al pago
      </button>

      <p className={styles.secure}>
        <LockIcon /> Pago 100% seguro y encriptado
      </p>

      {/* Accepted payments */}
      <div className={styles.payments}>
        {['Visa', 'MC', 'PSE', 'Nequi', 'Daviplata'].map(m => (
          <span key={m} className={styles.paymentChip}>{m}</span>
        ))}
      </div>
    </div>
  )
}
