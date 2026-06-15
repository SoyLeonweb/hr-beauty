import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard'
import styles from './Catalogo.module.css'

// ── Icons ─────────────────────────────────────────────────────────────────────
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)
const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
)
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
    <line x1="1" x2="7" y1="14" y2="14" /><line x1="9" x2="15" y1="8" y2="8" /><line x1="17" x2="23" y1="16" y2="16" />
  </svg>
)

// ── Mock products ──────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  // Maquillaje
  { id: 1,  slug: 'base-liquida-nude-glow',      category: 'maquillaje',       name: 'Base Líquida Nude Glow',              price: 129000, rating: 4.8, reviewCount: 143, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 2,  slug: 'labial-velvet-matte-rose',    category: 'maquillaje',       name: 'Labial Velvet Matte Rose',            price: 89000,  rating: 4.7, reviewCount: 210, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 3,  slug: 'polvo-maquillaje-traslucido', category: 'maquillaje',       name: 'Polvo Translúcido Setting Powder',    price: 99000,  rating: 4.5, reviewCount: 87,  badge: null,                                          image: null },
  { id: 4,  slug: 'mascara-volumen-extremo',     category: 'maquillaje',       name: 'Máscara de Pestañas Volumen Extremo', price: 79000,  rating: 4.6, reviewCount: 198, badge: { type: 'oferta',     label: '-20%'        }, image: null },
  { id: 5,  slug: 'rubor-peachy-blush',          category: 'maquillaje',       name: 'Rubor Peachy Blush',                  price: 85000,  rating: 4.4, reviewCount: 64,  badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  { id: 6,  slug: 'sombras-naked-nude',          category: 'maquillaje',       name: 'Paleta Sombras Naked Nude',           price: 189000, rating: 4.9, reviewCount: 312, badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 7,  slug: 'labial-gloss-coral',          category: 'maquillaje',       name: 'Lip Gloss Coral Kiss',                price: 65000,  rating: 4.3, reviewCount: 45,  badge: null,                                          image: null },
  { id: 8,  slug: 'delineador-precision',        category: 'maquillaje',       name: 'Delineador Precision Liner',          price: 72000,  rating: 4.5, reviewCount: 89,  badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  // Skincare
  { id: 9,  slug: 'serum-hyaluronic-glow',       category: 'skincare',         name: 'Sérum Hidratante Hyaluronic Glow',    price: 189000, rating: 4.9, reviewCount: 128, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 10, slug: 'vitamina-c-radiance',         category: 'skincare',         name: 'Vitamina C Radiance Boost',           price: 199000, rating: 4.8, reviewCount: 94,  badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  { id: 11, slug: 'crema-reparadora-night',      category: 'skincare',         name: 'Crema Reparadora Night Renewal',      price: 229000, rating: 4.7, reviewCount: 76,  badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 12, slug: 'limpiador-espuma-suave',      category: 'skincare',         name: 'Limpiador en Espuma Suave',           price: 89000,  rating: 4.5, reviewCount: 102, badge: null,                                          image: null },
  { id: 13, slug: 'tonico-hidratante-rosa',      category: 'skincare',         name: 'Tónico Hidratante Rosa',              price: 109000, rating: 4.6, reviewCount: 57,  badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 14, slug: 'mascarilla-arcilla-purif',    category: 'skincare',         name: 'Mascarilla de Arcilla Purificante',   price: 75000,  rating: 4.4, reviewCount: 83,  badge: null,                                          image: null },
  // Protección Solar
  { id: 15, slug: 'protector-solar-spf50',       category: 'proteccion-solar', name: 'Protector Solar SPF50 Daily Shield',  price: 139000, rating: 4.6, reviewCount: 67,  badge: { type: 'oferta',     label: '-15%'        }, image: null },
  { id: 16, slug: 'bb-cream-spf30',              category: 'proteccion-solar', name: 'BB Cream Hidratante SPF30',           price: 119000, rating: 4.7, reviewCount: 91,  badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 17, slug: 'spray-solar-invisible',       category: 'proteccion-solar', name: 'Spray Solar Invisible SPF50+',        price: 105000, rating: 4.5, reviewCount: 48,  badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  // Tratamientos
  { id: 18, slug: 'ampolla-retinol-night',       category: 'tratamientos',     name: 'Ampolla Retinol Night Repair',        price: 159000, rating: 4.8, reviewCount: 112, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 19, slug: 'peeling-acido-glicolico',     category: 'tratamientos',     name: 'Peeling Ácido Glicólico 10%',        price: 145000, rating: 4.6, reviewCount: 69,  badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 20, slug: 'contorno-ojos-peptidos',      category: 'tratamientos',     name: 'Contorno de Ojos con Péptidos',       price: 179000, rating: 4.7, reviewCount: 54,  badge: null,                                          image: null },
]

const CATEGORIES = [
  { slug: '',                label: 'Todos los productos', color: '#FF6FAE' },
  { slug: 'maquillaje',      label: 'Maquillaje',          color: '#FCE4EC' },
  { slug: 'skincare',        label: 'Skincare',            color: '#F3E5F5' },
  { slug: 'proteccion-solar', label: 'Protección Solar',   color: '#FFF3E0' },
  { slug: 'tratamientos',    label: 'Tratamientos',        color: '#E8F5E9' },
  { slug: 'mas-vendidos',    label: 'Más Vendidos',        color: '#FCE4EC' },
  { slug: 'novedades',       label: 'Novedades',           color: '#E3F2FD' },
]

const CATEGORY_META = {
  '':                { title: 'Todos los Productos',   desc: 'Explora toda nuestra colección de belleza.',               bg: 'linear-gradient(135deg, #FCE4EC 0%, #F3E5F5 100%)' },
  'maquillaje':      { title: 'Maquillaje',            desc: 'Bases, labiales, máscaras y todo para realzar tu belleza.', bg: 'linear-gradient(135deg, #FCE4EC 0%, #FFF8E1 100%)' },
  'skincare':        { title: 'Skincare',              desc: 'Rutinas completas para una piel saludable y radiante.',    bg: 'linear-gradient(135deg, #F3E5F5 0%, #E8F5E9 100%)' },
  'proteccion-solar':{ title: 'Protección Solar',      desc: 'Protege tu piel cada día con nuestros mejores SPF.',       bg: 'linear-gradient(135deg, #FFF3E0 0%, #FCE4EC 100%)' },
  'tratamientos':    { title: 'Tratamientos',          desc: 'Soluciones avanzadas para el cuidado facial intensivo.',   bg: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)' },
  'mas-vendidos':    { title: 'Más Vendidos',          desc: 'Los favoritos de nuestra comunidad HR Beauty.',            bg: 'linear-gradient(135deg, #FF6FAE22 0%, #FCE4EC 100%)' },
  'novedades':       { title: 'Novedades',             desc: 'Lo último en llegar a HR Beauty.',                         bg: 'linear-gradient(135deg, #E3F2FD 0%, #FCE4EC 100%)' },
}

const SORT_OPTIONS = [
  { value: 'relevancia',  label: 'Relevancia'      },
  { value: 'precio-asc',  label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'rating',      label: 'Mejor valorados'  },
  { value: 'novedad',     label: 'Más recientes'    },
]

const PRICE_RANGES = [
  { label: 'Hasta $80.000',           min: 0,      max: 80000  },
  { label: '$80.000 – $130.000',      min: 80000,  max: 130000 },
  { label: '$130.000 – $200.000',     min: 130000, max: 200000 },
  { label: 'Más de $200.000',         min: 200000, max: Infinity },
]

// ── Component ──────────────────────────────────────────────────────────────────
export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('categoria') || ''

  const [sortBy, setSortBy]           = useState('relevancia')
  const [priceRange, setPriceRange]   = useState(null)   // index into PRICE_RANGES
  const [minRating, setMinRating]     = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sortOpen, setSortOpen]       = useState(false)

  // Reset filters when category changes
  useEffect(() => {
    setPriceRange(null)
    setMinRating(0)
    setSortBy('relevancia')
  }, [activeCategory])

  const setCategory = (slug) => {
    if (slug) setSearchParams({ categoria: slug })
    else setSearchParams({})
  }

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS]

    // Category filter
    if (activeCategory === 'mas-vendidos') {
      list = list.filter(p => p.badge?.type === 'bestseller')
    } else if (activeCategory === 'novedades') {
      list = list.filter(p => p.badge?.type === 'nuevo' || p.badge?.type === 'novedad')
    } else if (activeCategory) {
      list = list.filter(p => p.category === activeCategory)
    }

    // Price filter
    if (priceRange !== null) {
      const { min, max } = PRICE_RANGES[priceRange]
      list = list.filter(p => p.price >= min && p.price <= max)
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating)
    }

    // Sort
    switch (sortBy) {
      case 'precio-asc':  list.sort((a, b) => a.price - b.price);   break
      case 'precio-desc': list.sort((a, b) => b.price - a.price);   break
      case 'rating':      list.sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return list
  }, [activeCategory, priceRange, minRating, sortBy])

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META['']
  const activeLabel = CATEGORIES.find(c => c.slug === activeCategory)?.label || 'Todos'

  const activeFilterCount = (priceRange !== null ? 1 : 0) + (minRating > 0 ? 1 : 0)
  const clearFilters = () => { setPriceRange(null); setMinRating(0) }

  return (
    <div className={styles.page}>

      {/* ── Category hero banner ── */}
      <section className={styles.heroBanner} style={{ background: meta.bg }}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>Inicio</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link to="/catalogo" className={styles.breadcrumbLink}>Catálogo</Link>
          {activeCategory && (
            <>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbCurrent}>{meta.title}</span>
            </>
          )}
        </nav>
        <h1 className={styles.heroTitle}>{meta.title}</h1>
        <p className={styles.heroDesc}>{meta.desc}</p>
        <span className={styles.heroCount}>{filtered.length} productos</span>
      </section>

      {/* ── Category chips ── */}
      <div className={styles.categoryStrip}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            className={`${styles.catChip} ${activeCategory === cat.slug ? styles.catChipActive : ''}`}
            onClick={() => setCategory(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className={styles.layout}>

        {/* ── Sidebar filters ── */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>

          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitle}>
              <SlidersIcon />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button className={styles.clearBtn} onClick={clearFilters}>Limpiar</button>
            )}
          </div>

          {/* Price range */}
          <FilterSection title="Precio">
            {PRICE_RANGES.map((range, i) => (
              <label key={i} className={styles.filterOption}>
                <input
                  type="radio"
                  name="priceRange"
                  className={styles.filterRadio}
                  checked={priceRange === i}
                  onChange={() => setPriceRange(priceRange === i ? null : i)}
                  onClick={() => priceRange === i && setPriceRange(null)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Valoración mínima">
            {[4.5, 4.0, 3.5].map(r => (
              <label key={r} className={styles.filterOption}>
                <input
                  type="radio"
                  name="rating"
                  className={styles.filterRadio}
                  checked={minRating === r}
                  onChange={() => setMinRating(minRating === r ? 0 : r)}
                  onClick={() => minRating === r && setMinRating(0)}
                />
                <span className={styles.ratingLabel}>
                  {'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))}
                  <span> {r}+</span>
                </span>
              </label>
            ))}
          </FilterSection>

        </aside>

        {/* ── Product area ── */}
        <main className={styles.main}>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button
              className={styles.filterToggle}
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Mostrar/ocultar filtros"
            >
              <SlidersIcon />
              {sidebarOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
            </button>

            {/* Active filter chips */}
            <div className={styles.activeFilters}>
              {priceRange !== null && (
                <span className={styles.activeChip}>
                  {PRICE_RANGES[priceRange].label}
                  <button onClick={() => setPriceRange(null)} className={styles.chipRemove}><XIcon /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className={styles.activeChip}>
                  ★ {minRating}+
                  <button onClick={() => setMinRating(0)} className={styles.chipRemove}><XIcon /></button>
                </span>
              )}
            </div>

            <span className={styles.resultCount}>{filtered.length} resultados</span>

            {/* Sort dropdown */}
            <div className={styles.sortWrapper}>
              <button className={styles.sortBtn} onClick={() => setSortOpen(v => !v)}>
                {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
                {sortOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
              {sortOpen && (
                <ul className={styles.sortMenu}>
                  {SORT_OPTIONS.map(opt => (
                    <li key={opt.value}>
                      <button
                        className={`${styles.sortOption} ${sortBy === opt.value ? styles.sortOptionActive : ''}`}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>Sin resultados</h3>
              <p>No encontramos productos con esos filtros. Intenta ajustarlos.</p>
              <button className={styles.emptyBtn} onClick={clearFilters}>Quitar filtros</button>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

// ── FilterSection helper ───────────────────────────────────────────────────────
function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className={styles.filterSection}>
      <button className={styles.filterSectionBtn} onClick={() => setOpen(v => !v)}>
        <span>{title}</span>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {open && <div className={styles.filterSectionBody}>{children}</div>}
    </div>
  )
}
