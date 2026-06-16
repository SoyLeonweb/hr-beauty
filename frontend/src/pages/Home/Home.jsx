import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import styles from './Home.module.css'
import heroImg from '@assets/images/hero/imagen-skincare-1.png'
import imgMaquillaje from '@assets/images/categories/producto-maquillaje-polvo.png'
import imgSkincare from '@assets/images/categories/producto-skincare.png'

// ── SVG Icons (Why LUMINA) ────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
)

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
    <rect x="9" y="11" width="14" height="10" rx="2" />
    <circle cx="12" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
  </svg>
)

const HeadphonesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
  </svg>
)

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const MinusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
)

// ── Data ──────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'Sérum Hidratante Hyaluronic Glow',  price: 39, rating: 4.9, reviewCount: 128, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null, slug: 'serum-hidratante' },
  { id: 2, name: 'Vitamina C Radiance Boost',          price: 42, rating: 4.8, reviewCount: 94,  badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null, slug: 'vitamina-c' },
  { id: 3, name: 'Protector Solar SPF50 Daily Shield', price: 29, rating: 4.0, reviewCount: 67,  badge: { type: 'oferta',     label: '-15%'        }, image: null, slug: 'protector-solar' },
  { id: 4, name: 'Crema Reparadora Night Renewal',     price: 48, rating: 4.0, reviewCount: 76,  badge: { type: 'premium',    label: 'Premium'     }, image: null, slug: 'crema-reparadora' },
  { id: 5, name: 'Labial Velvet Matte Rose',           price: 19, rating: 4.7, reviewCount: 210, badge: { type: 'novedad',    label: 'Novedad'     }, image: null, slug: 'labial-rose' },
]

const CATEGORIES = [
  { name: 'Maquillaje',       desc: 'Bases, labiales, máscaras y más.',            href: '/catalogo?categoria=maquillaje',       bg: '#FCE4EC', img: imgMaquillaje },
  { name: 'Skincare',         desc: 'Rutinas completas para todo tipo de piel.',    href: '/catalogo?categoria=skincare',         bg: '#F3E5F5', img: imgSkincare  },
  { name: 'Protección Solar', desc: 'Protección diaria para una piel cuidada.',     href: '/catalogo?categoria=proteccion-solar', bg: '#FFF3E0', img: null         },
  { name: 'Tratamientos',     desc: 'Soluciones avanzadas para el cuidado facial.', href: '/catalogo?categoria=tratamientos',     bg: '#E8F5E9', img: null         },
]

const STATS = [
  { value: '+10.000', label: 'Clientes Felices' },
  { value: '+50.000', label: 'Productos Vendidos' },
  { value: '4.9/5',   label: 'Valoración Promedio' },
  { value: '98%',     label: 'Recompra de Clientes' },
]

const WHY_LUMINA = [
  { Icon: LeafIcon,       title: 'Ingredientes de Calidad',    desc: 'Fórmulas respaldadas por investigación dermatológica de alta calidad.' },
  { Icon: ShieldIcon,     title: 'Cruelty Free',               desc: 'Nunca realizamos pruebas en animales. 100% ético y sostenible.' },
  { Icon: TruckIcon,      title: 'Envíos Rápidos',             desc: 'Entrega segura directamente a tu hogar en 24-48 horas.' },
  { Icon: HeadphonesIcon, title: 'Atención Personalizada',     desc: 'Nuestro equipo te ayuda a encontrar los productos perfectos.' },
]

const TESTIMONIALS = [
  {
    quote: 'Mi piel mejoró muchísimo desde que uso LÚMINA. La calidad de sus productos es increíble.',
    name: 'María G.',
    verified: 'Compra verificada',
    stars: 5,
  },
  {
    quote: 'Entrega rápida y el empaquetado impecable. El sérum hyaluronic es mi favorito. Volveré.',
    name: 'Laura M.',
    verified: 'Compra verificada',
    stars: 5,
  },
  {
    quote: 'Finalmente encontré productos efectivos para mi rutina diaria. Los recomiendo a todas.',
    name: 'Andrea R.',
    verified: 'Compra verificada',
    stars: 5,
  },
]

const IG_POSTS = [
  { id: 1, bg: '#FCE4EC' },
  { id: 2, bg: '#F8BBD0' },
  { id: 3, bg: '#FFF8E1' },
  { id: 4, bg: '#E8F5E9' },
  { id: 5, bg: '#FFF3E0' },
  { id: 6, bg: '#FF6FAE' },
  { id: 7, bg: '#F3E5F5' },
  { id: 8, bg: '#FCE4EC' },
]

const FAQ_ITEMS = [
  {
    q: '¿Los productos son originales?',
    a: 'Sí, todos nuestros productos son 100% auténticos y provienen directamente de los fabricantes oficiales. Garantizamos la autenticidad de cada artículo.',
  },
  {
    q: '¿Realizan envíos a toda España?',
    a: 'Sí, realizamos envíos a toda España peninsular, islas Baleares y Canarias. Las tarifas y plazos varían según la zona.',
  },
  {
    q: '¿Puedo devolver un producto?',
    a: 'Aceptamos devoluciones en los 30 días siguientes a la compra. El producto debe estar sin abrir y en su embalaje original.',
  },
  {
    q: '¿Son aptos para piel sensible?',
    a: 'La mayoría de nuestros productos están formulados para todo tipo de piel, incluida la sensible. Revisa la descripción de cada producto para más detalle.',
  },
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Los pedidos se entregan en 24-48 horas en España peninsular. Para islas el plazo es de 3-5 días hábiles.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <div className={styles.page}>

      {/* ── S2 Hero ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroPill}>Nueva Colección 2024</span>

          <div className={styles.heroTitleArea}>
            <h1 className={styles.heroTitle}>
              Descubre tu<br />mejor versión
            </h1>
            <span className={styles.heroDecoText} aria-hidden="true">cada día</span>
          </div>

          <p className={styles.heroSubtitle}>
            Productos de maquillaje y cuidado facial seleccionados para una piel saludable, luminosa y llena de confianza.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/catalogo" className={styles.btnPrimary}>Comprar Ahora</Link>
            <Link to="/catalogo?categoria=novedades" className={styles.btnSecondary}>Ver Colecciones</Link>
          </div>

          <div className={styles.heroTrust}>
            <span className={styles.trustItem}>Envíos a todo el país</span>
            <span className={styles.trustItem}>Productos originales</span>
            <span className={styles.trustItem}>Más de 10.000 clientes</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img src={heroImg} alt="Skincare HR Beauty" className={styles.heroImage} />
          <div className={styles.heroFloatCard}>
            <span className={styles.heroFloatName}>Sérum Hyaluronic</span>
            <span className={styles.heroFloatPrice}>€39,00</span>
          </div>
        </div>
      </section>

      {/* ── S3 Stats ─────────────────────────────────────────── */}
      <section className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── S4 Categorías ────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Categorías Destacadas</h2>
          <Link to="/catalogo" className={styles.sectionLink}>Ver todas las categorías →</Link>
        </div>
        <div className={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className={styles.categoryCard}
              style={{ backgroundColor: cat.bg }}
            >
              {cat.img
                ? <img src={cat.img} alt={cat.name} className={styles.categoryImage} />
                : <div className={styles.categoryImage} />
              }
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                <p className={styles.categoryDesc}>{cat.desc}</p>
                <span className={styles.categoryLink}>Explorar →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── S5 Best Sellers ──────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Productos Más Vendidos</h2>
          <Link to="/catalogo?categoria=mas-vendidos" className={styles.sectionLink}>Ver todos los productos →</Link>
        </div>
        <div className={styles.productsGrid}>
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── S6 Promo Banner ──────────────────────────────────── */}
      <section className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <span className={styles.promoPill}>Oferta Exclusiva</span>
          <h2 className={styles.promoTitle}>
            Obtén un 20% de descuento en tu primera compra
          </h2>
          <p className={styles.promoSubtitle}>
            Suscríbete y obtén acceso exclusivo a Promociones y lanzamientos.
          </p>
          <Link to="/catalogo" className={styles.promoBtn}>Quiero mi descuento</Link>
        </div>
        <div className={styles.promoVisual}>
          <div className={styles.promoCircle} />
        </div>
      </section>

      {/* ── S7 Why LÚMINA ────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionCenter}>
          <h2 className={styles.sectionTitle}>¿Por qué elegir LÚMINA?</h2>
          <p className={styles.sectionSubtitle}>Comprometidos con tu belleza y bienestar en cada producto.</p>
        </div>
        <div className={styles.whyGrid}>
          {WHY_LUMINA.map(({ Icon, title, desc }) => (
            <div key={title} className={styles.whyCard}>
              <div className={styles.whyIconWrapper}>
                <Icon />
              </div>
              <h3 className={styles.whyTitle}>{title}</h3>
              <p className={styles.whyDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── S8 Testimonials ──────────────────────────────────── */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionCenter}>
          <h2 className={styles.sectionTitle}>Lo que dicen nuestras clientas</h2>
          <p className={styles.sectionSubtitle}>Más de 10.000 clientes satisfechas confían en LÚMINA.</p>
        </div>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <span className={styles.quoteIcon}>&ldquo;</span>
              <p className={styles.testimonialText}>{t.quote}</p>
              <div className={styles.testimonialStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={styles.star}>
                    <StarIcon filled={i < t.stars} />
                  </span>
                ))}
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} />
                <div>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.authorVerified}>{t.verified}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── S9 Instagram ─────────────────────────────────────── */}
      <section className={styles.instagramSection}>
        <div className={styles.sectionCenter}>
          <h2 className={styles.sectionTitle}>Síguenos en Instagram</h2>
          <a
            href="https://instagram.com/lumina.beauty"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramHandle}
          >
            @lumina.beauty
          </a>
        </div>
        <div className={styles.instagramGrid}>
          {IG_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/lumina.beauty"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igPost}
              style={{ backgroundColor: post.bg }}
            />
          ))}
        </div>
      </section>

      {/* ── S10 FAQ ──────────────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={styles.faqLeft}>
          <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
          <p className={styles.sectionSubtitle}>
            Todo lo que necesitas saber sobre LÚMINA y nuestros productos.
          </p>
        </div>
        <div className={styles.faqRight}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFaq(i)}
                aria-expanded={openFaq === i}
              >
                <span>{item.q}</span>
                <span className={styles.faqIcon}>
                  {openFaq === i ? <MinusIcon /> : <PlusIcon />}
                </span>
              </button>
              {openFaq === i && (
                <div className={styles.faqAnswer}>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── S11 Newsletter ───────────────────────────────────── */}
      <section className={styles.newsletter}>
        <h2 className={styles.newsletterTitle}>Únete a nuestra comunidad</h2>
        <p className={styles.newsletterSubtitle}>
          Recibe novedades, ofertas exclusivas y consejos de belleza directamente en tu correo.
        </p>
        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="tu@correo.com"
            className={styles.newsletterInput}
          />
          <button type="submit" className={styles.btnPrimary}>Suscribirme</button>
        </form>
      </section>

    </div>
  )
}
