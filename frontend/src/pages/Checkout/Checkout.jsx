import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './Checkout.module.css'

const COLOMBIAN_CITIES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Ibagué',
  'Cúcuta', 'Villavicencio', 'Armenia', 'Pasto', 'Montería', 'Otra ciudad',
]

const PAYMENT_METHODS = [
  { id: 'card',       label: 'Tarjeta de crédito / débito' },
  { id: 'pse',        label: 'PSE – Débito bancario'        },
  { id: 'nequi',      label: 'Nequi'                        },
  { id: 'daviplata',  label: 'Daviplata'                    },
  { id: 'contraentrega', label: 'Contra entrega'            },
]

const STEPS = ['Contacto', 'Envío', 'Pago', 'Confirmación']

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}

export default function Checkout() {
  const navigate  = useNavigate()
  const { items, subtotal, discount, iva, shipping, total, appliedCoupon, IVA_RATE, clearCart } = useCart()

  const [step, setStep]     = useState(0)
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)

  const [form, setForm] = useState({
    // Contact
    email: '', phone: '',
    // Shipping
    firstName: '', lastName: '', address: '', apartment: '', city: '', department: '', zip: '',
    // Payment
    paymentMethod: 'card',
    cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
  })

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validateStep = () => {
    const e = {}
    if (step === 0) {
      if (!form.email.includes('@')) e.email = 'Ingresa un correo válido'
      if (form.phone.length < 7)    e.phone = 'Ingresa un teléfono válido'
    }
    if (step === 1) {
      if (!form.firstName) e.firstName = 'Campo requerido'
      if (!form.lastName)  e.lastName  = 'Campo requerido'
      if (!form.address)   e.address   = 'Campo requerido'
      if (!form.city)      e.city      = 'Selecciona una ciudad'
    }
    if (step === 2 && form.paymentMethod === 'card') {
      if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Número de tarjeta inválido'
      if (!form.cardName)   e.cardName   = 'Campo requerido'
      if (!form.cardExpiry) e.cardExpiry = 'Campo requerido'
      if (form.cardCvv.length < 3) e.cardCvv = 'CVV inválido'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    if (step < 3) setStep(s => s + 1)
    if (step === 2) {
      // Simular pago
      setTimeout(() => {
        setPlaced(true)
        clearCart()
      }, 800)
    }
  }

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4)
    return v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v
  }

  if (items.length === 0 && !placed) {
    return (
      <div className={styles.emptyCheckout}>
        <p>No tienes productos en el carrito.</p>
        <Link to="/catalogo" className={styles.backBtn}>Ir al catálogo</Link>
      </div>
    )
  }

  if (placed) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.successTitle}>¡Pedido confirmado!</h2>
        <p className={styles.successDesc}>
          Gracias por tu compra, <strong>{form.firstName || 'clienta'}</strong>. Recibirás un correo
          de confirmación en <strong>{form.email}</strong> con los detalles de tu pedido.
        </p>
        <p className={styles.successSub}>Tiempo estimado de entrega: 1–3 días hábiles.</p>
        <Link to="/" className={styles.successBtn}>Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>Inicio</Link>
        <span>›</span>
        <Link to="/carrito" className={styles.breadcrumbLink}>Carrito</Link>
        <span>›</span>
        <span className={styles.breadcrumbCurrent}>Checkout</span>
      </nav>

      {/* Steps indicator */}
      <div className={styles.steps}>
        {STEPS.map((s, i) => (
          <div key={s} className={`${styles.stepItem} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
            <div className={styles.stepDot}>{i < step ? '✓' : i + 1}</div>
            <span className={styles.stepLabel}>{s}</span>
            {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
          </div>
        ))}
      </div>

      <div className={styles.layout}>

        {/* ── Form ── */}
        <div className={styles.formCol}>

          {/* Step 0: Contacto */}
          {step === 0 && (
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Información de contacto</h2>
              <div className={styles.formGrid}>
                <Field label="Correo electrónico *" error={errors.email}>
                  <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    type="email" value={form.email} onChange={set('email')} placeholder="tu@correo.com" />
                </Field>
                <Field label="Teléfono / WhatsApp *" error={errors.phone}>
                  <input className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    type="tel" value={form.phone} onChange={set('phone')} placeholder="+57 300 000 0000" />
                </Field>
              </div>
            </section>
          )}

          {/* Step 1: Envío */}
          {step === 1 && (
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Dirección de envío</h2>
              <div className={styles.formGrid}>
                <Field label="Nombre *" error={errors.firstName}>
                  <input className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    value={form.firstName} onChange={set('firstName')} placeholder="Ana" />
                </Field>
                <Field label="Apellido *" error={errors.lastName}>
                  <input className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    value={form.lastName} onChange={set('lastName')} placeholder="García" />
                </Field>
                <Field label="Dirección *" error={errors.address}>
                  <input className={`${styles.input} ${styles.fullWidth} ${errors.address ? styles.inputError : ''}`}
                    value={form.address} onChange={set('address')} placeholder="Calle 80 # 45-12" />
                </Field>
                <Field label="Apartamento / Piso (opcional)">
                  <input className={`${styles.input} ${styles.fullWidth}`}
                    value={form.apartment} onChange={set('apartment')} placeholder="Apto 302" />
                </Field>
                <Field label="Ciudad *" error={errors.city}>
                  <select className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                    value={form.city} onChange={set('city')}>
                    <option value="">Seleccionar ciudad</option>
                    {COLOMBIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Código postal">
                  <input className={styles.input}
                    value={form.zip} onChange={set('zip')} placeholder="110111" maxLength={6} />
                </Field>
              </div>
            </section>
          )}

          {/* Step 2: Pago */}
          {step === 2 && (
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Método de pago</h2>

              <div className={styles.paymentMethods}>
                {PAYMENT_METHODS.map(m => (
                  <label key={m.id} className={`${styles.paymentOption} ${form.paymentMethod === m.id ? styles.paymentOptionActive : ''}`}>
                    <input type="radio" name="paymentMethod" value={m.id}
                      checked={form.paymentMethod === m.id} onChange={set('paymentMethod')} className={styles.paymentRadio} />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              {form.paymentMethod === 'card' && (
                <div className={`${styles.formGrid} ${styles.cardForm}`}>
                  <Field label="Número de tarjeta *" error={errors.cardNumber}>
                    <input className={`${styles.input} ${styles.fullWidth} ${errors.cardNumber ? styles.inputError : ''}`}
                      value={form.cardNumber}
                      onChange={e => setForm(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                      placeholder="1234 5678 9012 3456" maxLength={19} />
                  </Field>
                  <Field label="Nombre en la tarjeta *" error={errors.cardName}>
                    <input className={`${styles.input} ${styles.fullWidth} ${errors.cardName ? styles.inputError : ''}`}
                      value={form.cardName} onChange={set('cardName')} placeholder="ANA GARCIA" style={{ textTransform: 'uppercase' }} />
                  </Field>
                  <Field label="Fecha de vencimiento *" error={errors.cardExpiry}>
                    <input className={`${styles.input} ${errors.cardExpiry ? styles.inputError : ''}`}
                      value={form.cardExpiry}
                      onChange={e => setForm(p => ({ ...p, cardExpiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/AA" maxLength={5} />
                  </Field>
                  <Field label="CVV *" error={errors.cardCvv}>
                    <input className={`${styles.input} ${errors.cardCvv ? styles.inputError : ''}`}
                      value={form.cardCvv}
                      onChange={e => setForm(p => ({ ...p, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="123" maxLength={4} type="password" />
                  </Field>
                </div>
              )}

              {['pse', 'nequi', 'daviplata'].includes(form.paymentMethod) && (
                <div className={styles.paymentInfo}>
                  Serás redirigido a la plataforma de pago al confirmar tu pedido.
                </div>
              )}

              {form.paymentMethod === 'contraentrega' && (
                <div className={styles.paymentInfo}>
                  Pagas en efectivo al recibir tu pedido. Solo disponible en ciudades principales.
                </div>
              )}
            </section>
          )}

          {/* Step 3: Confirmación */}
          {step === 3 && (
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Confirmar pedido</h2>
              <div className={styles.confirmGrid}>
                <div className={styles.confirmBlock}>
                  <h3 className={styles.confirmBlockTitle}>Contacto</h3>
                  <p>{form.email}</p>
                  <p>{form.phone}</p>
                </div>
                <div className={styles.confirmBlock}>
                  <h3 className={styles.confirmBlockTitle}>Envío a</h3>
                  <p>{form.firstName} {form.lastName}</p>
                  <p>{form.address}{form.apartment ? `, ${form.apartment}` : ''}</p>
                  <p>{form.city}</p>
                </div>
                <div className={styles.confirmBlock}>
                  <h3 className={styles.confirmBlockTitle}>Pago</h3>
                  <p>{PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label}</p>
                  {form.paymentMethod === 'card' && form.cardNumber && (
                    <p>···· ···· ···· {form.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                  )}
                </div>
                <div className={styles.confirmBlock}>
                  <h3 className={styles.confirmBlockTitle}>Productos ({items.length})</h3>
                  {items.map(i => (
                    <p key={i.id} className={styles.confirmItem}>
                      <span>{i.name}</span>
                      <span>×{i.qty}</span>
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Navigation buttons */}
          <div className={styles.navBtns}>
            {step > 0 && (
              <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                ← Volver
              </button>
            )}
            <button className={styles.nextBtn} onClick={next}>
              {step === 2 ? 'Confirmar pedido' : step === 3 ? 'Pagar ahora' : 'Continuar →'}
            </button>
          </div>
        </div>

        {/* ── Order mini-summary ── */}
        <aside className={styles.summaryCol}>
          <h3 className={styles.summaryTitle}>Tu pedido</h3>
          <div className={styles.summaryItems}>
            {items.map(i => (
              <div key={i.id} className={styles.summaryItem}>
                <div className={styles.summaryThumb}>
                  {i.image
                    ? <img src={i.image} alt={i.name} />
                    : <div className={styles.thumbPlaceholder} />
                  }
                  <span className={styles.summaryQtyBadge}>{i.qty}</span>
                </div>
                <span className={styles.summaryItemName}>{i.name}</span>
                <span className={styles.summaryItemPrice}>${(i.price * i.qty).toLocaleString('es-CO')}</span>
              </div>
            ))}
          </div>
          <div className={styles.summaryTotals}>
            <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toLocaleString('es-CO')}</span></div>
            {discount > 0 && (
              <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                <span>Descuento ({appliedCoupon?.value}%)</span>
                <span>−${discount.toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>IVA ({Math.round(IVA_RATE * 100)}%)</span>
              <span>${iva.toLocaleString('es-CO')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span>{shipping === 0 ? <span className={styles.freeTag}>Gratis</span> : `$${shipping.toLocaleString('es-CO')}`}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
