import { useState, useMemo, useEffect, useRef } from 'react'
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

// ── Productos reales HR Beauty ─────────────────────────────────────────────────
// Precios 1-22 confirmados; 23-67 estimados según línea de producto
const ALL_PRODUCTS = [
  // ── Contorno de Ojos – Bioaqua ──
  { id: 'BIO-CON-001', slug: 'bio-con-001', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno de Arroz Bioaqua',                 price: 14000, rating: 4.7, reviewCount: 38, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-CON-002', slug: 'bio-con-002', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno Vitamina C Bioaqua',               price: 14000, rating: 4.8, reviewCount: 52, badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  { id: 'BIO-CON-003', slug: 'bio-con-003', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno de Rosas Bioaqua',                 price: 14000, rating: 4.6, reviewCount: 29, badge: null,                                          image: null },
  { id: 'BIO-CON-004', slug: 'bio-con-004', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno Ácido Hialurónico Azul Bioaqua',   price: 14000, rating: 4.9, reviewCount: 61, badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 'BIO-CON-005', slug: 'bio-con-005', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno Aloe Vera Bioaqua',                price: 12000, rating: 4.5, reviewCount: 24, badge: null,                                          image: null },
  { id: 'BIO-CON-006', slug: 'bio-con-006', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno Nicotinamida Bioaqua',             price: 12000, rating: 4.6, reviewCount: 33, badge: null,                                          image: null },
  { id: 'BIO-CON-007', slug: 'bio-con-007', marca: 'Bioaqua', category: 'skincare', tipo: 'Contorno de Ojos', name: 'Contorno Retinol Bioaqua',                  price: 12000, rating: 4.7, reviewCount: 41, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  // ── Jabón Facial – Bioaqua ──
  { id: 'BIO-JAB-001', slug: 'bio-jab-001', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Aguacate Bioaqua',              price: 12000, rating: 4.5, reviewCount: 47, badge: null,                                          image: null },
  { id: 'BIO-JAB-002', slug: 'bio-jab-002', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Ácido Salicílico Bioaqua',      price: 13000, rating: 4.6, reviewCount: 58, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-JAB-003', slug: 'bio-jab-003', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial de Rosas Bioaqua',              price: 3500,  rating: 4.3, reviewCount: 72, badge: null,                                          image: null },
  { id: 'BIO-JAB-004', slug: 'bio-jab-004', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Ácido Hialurónico Azul Bioaqua',price: 3500,  rating: 4.4, reviewCount: 65, badge: null,                                          image: null },
  { id: 'BIO-JAB-005', slug: 'bio-jab-005', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Retinol Bioaqua',               price: 3500,  rating: 4.5, reviewCount: 89, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 'BIO-JAB-006', slug: 'bio-jab-006', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Vitamina C Bioaqua',            price: 3500,  rating: 4.6, reviewCount: 94, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-JAB-007', slug: 'bio-jab-007', marca: 'Bioaqua', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Nicotinamida Bioaqua',          price: 3500,  rating: 4.4, reviewCount: 77, badge: null,                                          image: null },
  // ── Jabón Facial – Rubiskin ──
  { id: 'RUB-JAB-001', slug: 'rub-jab-001', marca: 'Rubiskin', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial de Arroz Rubiskin',            price: 3500,  rating: 4.5, reviewCount: 56, badge: null,                                          image: null },
  { id: 'RUB-JAB-002', slug: 'rub-jab-002', marca: 'Rubiskin', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Centella Rubiskin',            price: 3500,  rating: 4.6, reviewCount: 48, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 'RUB-JAB-003', slug: 'rub-jab-003', marca: 'Rubiskin', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Sandía Rubiskin',              price: 2000,  rating: 4.3, reviewCount: 31, badge: null,                                          image: null },
  { id: 'RUB-JAB-004', slug: 'rub-jab-004', marca: 'Rubiskin', category: 'skincare', tipo: 'Jabón Facial', name: 'Jabón Facial Tea Tree Rubiskin',            price: 2000,  rating: 4.4, reviewCount: 39, badge: null,                                          image: null },
  // ── Crema Facial – Bioaqua ──
  { id: 'BIO-CRE-001', slug: 'bio-cre-001', marca: 'Bioaqua', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial de Arroz Bioaqua',              price: 2000,  rating: 4.4, reviewCount: 43, badge: null,                                          image: null },
  { id: 'BIO-CRE-002', slug: 'bio-cre-002', marca: 'Bioaqua', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial Vitamina C Bioaqua',            price: 14000, rating: 4.7, reviewCount: 67, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-CRE-003', slug: 'bio-cre-003', marca: 'Bioaqua', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial Nicotinamida Bioaqua',          price: 10000, rating: 4.6, reviewCount: 55, badge: null,                                          image: null },
  { id: 'BIO-CRE-004', slug: 'bio-cre-004', marca: 'Bioaqua', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial Aloe Vera Bioaqua',             price: 17000, rating: 4.8, reviewCount: 82, badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 'BIO-CRE-005', slug: 'bio-cre-005', marca: 'Bioaqua', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial de Fresas Bioaqua',             price: 12000, rating: 4.5, reviewCount: 36, badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  // ── Crema Facial – Rubiskin ──
  { id: 'RUB-CF-001',  slug: 'rub-cf-001',  marca: 'Rubiskin', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial Tea Tree 30G Rubiskin',        price: 15000, rating: 4.6, reviewCount: 44, badge: null,                                          image: null },
  { id: 'RUB-CF-002',  slug: 'rub-cf-002',  marca: 'Rubiskin', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial Sandía 30G Rubiskin',          price: 15000, rating: 4.5, reviewCount: 38, badge: null,                                          image: null },
  { id: 'RUB-CF-003',  slug: 'rub-cf-003',  marca: 'Rubiskin', category: 'skincare', tipo: 'Crema Facial', name: 'Crema Facial de Arroz Rubiskin',            price: 14000, rating: 4.7, reviewCount: 51, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  // ── Sérum Facial – Bioaqua ──
  { id: 'BIO-SR-001',  slug: 'bio-sr-001',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Centella Bioaqua',              price: 18000, rating: 4.8, reviewCount: 93, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-SR-002',  slug: 'bio-sr-002',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Vitamina C 100ML Bioaqua',      price: 22000, rating: 4.9, reviewCount: 118,badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 'BIO-SR-003',  slug: 'bio-sr-003',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial de Arroz Bioaqua',              price: 16000, rating: 4.6, reviewCount: 74, badge: null,                                          image: null },
  { id: 'BIO-SR-004',  slug: 'bio-sr-004',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Ácido Salicílico 35ML Bioaqua', price: 18000, rating: 4.7, reviewCount: 61, badge: null,                                          image: null },
  { id: 'BIO-SR-005',  slug: 'bio-sr-005',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Arroz y Ácido Hialurónico Bioaqua',    price: 20000, rating: 4.8, reviewCount: 87, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 'BIO-SR-006',  slug: 'bio-sr-006',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial de Oro Bioaqua',                price: 25000, rating: 4.9, reviewCount: 102,badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 'BIO-SR-007',  slug: 'bio-sr-007',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Ácido Hialurónico Bioaqua',     price: 18000, rating: 4.7, reviewCount: 79, badge: null,                                          image: null },
  { id: 'BIO-SR-008',  slug: 'bio-sr-008',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Reparador Bioaqua',             price: 20000, rating: 4.8, reviewCount: 66, badge: null,                                          image: null },
  { id: 'BIO-SR-009',  slug: 'bio-sr-009',  marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Anti-Acné Bioaqua',                    price: 16000, rating: 4.6, reviewCount: 55, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 'BIO-SR-0010', slug: 'bio-sr-0010', marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Aloe Vera Bioaqua',                    price: 15000, rating: 4.5, reviewCount: 42, badge: null,                                          image: null },
  { id: 'BIO-SR-0011', slug: 'bio-sr-0011', marca: 'Bioaqua', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Aguacate Bioaqua',                     price: 15000, rating: 4.5, reviewCount: 38, badge: null,                                          image: null },
  // ── Sérum Facial – Rubyskin ──
  { id: 'RUB-SR-001',  slug: 'rub-sr-001',  marca: 'Rubyskin', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Sandía Rubyskin',              price: 17000, rating: 4.6, reviewCount: 49, badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  { id: 'RUB-SR-002',  slug: 'rub-sr-002',  marca: 'Rubyskin', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial de Arroz Rubyskin',            price: 16000, rating: 4.5, reviewCount: 57, badge: null,                                          image: null },
  { id: 'RUB-SR-003',  slug: 'rub-sr-003',  marca: 'Rubyskin', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Centella Rubyskin',            price: 17000, rating: 4.7, reviewCount: 63, badge: null,                                          image: null },
  { id: 'RUB-SR-004',  slug: 'rub-sr-004',  marca: 'Rubyskin', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Tea Tree 30ML Rubyskin',       price: 15000, rating: 4.5, reviewCount: 44, badge: null,                                          image: null },
  { id: 'RUB-SR-005',  slug: 'rub-sr-005',  marca: 'Rubyskin', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Facial Antiedad Rubyskin',            price: 22000, rating: 4.8, reviewCount: 71, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'RUB-SR-006',  slug: 'rub-sr-006',  marca: 'Rubyskin', category: 'skincare', tipo: 'Sérum Facial', name: 'Sérum Centella Reparador Rubyskin',         price: 18000, rating: 4.7, reviewCount: 53, badge: null,                                          image: null },
  // ── Tarro de Ojeras – Bioaqua ──
  { id: 'BIO-COL-001', slug: 'bio-col-001', marca: 'Bioaqua', category: 'skincare', tipo: 'Tarro de Ojeras', name: 'Colágeno Ojeras Retinol Bioaqua',         price: 14000, rating: 4.7, reviewCount: 45, badge: null,                                          image: null },
  { id: 'BIO-COL-002', slug: 'bio-col-002', marca: 'Bioaqua', category: 'skincare', tipo: 'Tarro de Ojeras', name: 'Colágeno Ojeras Durazno Bioaqua',         price: 14000, rating: 4.6, reviewCount: 38, badge: null,                                          image: null },
  { id: 'BIO-COL-003', slug: 'bio-col-003', marca: 'Bioaqua', category: 'skincare', tipo: 'Tarro de Ojeras', name: 'Colágeno Ojeras Centella Bioaqua',        price: 14000, rating: 4.8, reviewCount: 52, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-COL-004', slug: 'bio-col-004', marca: 'Bioaqua', category: 'skincare', tipo: 'Tarro de Ojeras', name: 'Colágeno Ojeras de Arroz Bioaqua',        price: 14000, rating: 4.6, reviewCount: 41, badge: null,                                          image: null },
  { id: 'BIO-COL-005', slug: 'bio-col-005', marca: 'Bioaqua', category: 'skincare', tipo: 'Tarro de Ojeras', name: 'Colágeno Ojeras Nicotinamida Bioaqua',    price: 14000, rating: 4.7, reviewCount: 34, badge: null,                                          image: null },
  { id: 'BIO-COL-006', slug: 'bio-col-006', marca: 'Bioaqua', category: 'skincare', tipo: 'Tarro de Ojeras', name: 'Colágeno Ojeras Ácido Hialurónico Bioaqua',price:14000, rating: 4.8, reviewCount: 47, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  // ── Protector Solar – Bioaqua ──
  { id: 'BIO-PS-001',  slug: 'bio-ps-001',  marca: 'Bioaqua', category: 'proteccion-solar', tipo: 'Protector Solar', name: 'Protector Solar Retinol Bioaqua',            price: 24000, rating: 4.8, reviewCount: 76, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-PS-002',  slug: 'bio-ps-002',  marca: 'Bioaqua', category: 'proteccion-solar', tipo: 'Protector Solar', name: 'Protector Solar Nicotinamida Bioaqua',        price: 24000, rating: 4.7, reviewCount: 58, badge: null,                                          image: null },
  { id: 'BIO-PS-003',  slug: 'bio-ps-003',  marca: 'Bioaqua', category: 'proteccion-solar', tipo: 'Protector Solar', name: 'Protector Solar Ácido Hialurónico Bioaqua',   price: 24000, rating: 4.9, reviewCount: 91, badge: { type: 'premium',    label: 'Premium'     }, image: null },
  { id: 'BIO-PS-004',  slug: 'bio-ps-004',  marca: 'Bioaqua', category: 'proteccion-solar', tipo: 'Protector Solar', name: 'Protector Solar Vitamina C Bioaqua',          price: 24000, rating: 4.8, reviewCount: 83, badge: null,                                          image: null },
  { id: 'BIO-PS-005',  slug: 'bio-ps-005',  marca: 'Bioaqua', category: 'proteccion-solar', tipo: 'Protector Solar', name: 'Protector Solar Centella Bioaqua',            price: 24000, rating: 4.7, reviewCount: 62, badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  // ── Mascarilla Facial – Bioaqua ──
  { id: 'BIO-MAS-001', slug: 'bio-mas-001', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla Velo Azul Ácido Hialurónico Bioaqua', price: 8000, rating: 4.6, reviewCount: 84, badge: null,                                          image: null },
  { id: 'BIO-MAS-002', slug: 'bio-mas-002', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla de Arroz Bioaqua',                    price: 8000, rating: 4.5, reviewCount: 67, badge: null,                                          image: null },
  { id: 'BIO-MAS-003', slug: 'bio-mas-003', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla Anti-Acné Bioaqua',                   price: 8000, rating: 4.7, reviewCount: 95, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'BIO-MAS-004', slug: 'bio-mas-004', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla Ácido Salicílico Bioaqua',            price: 8000, rating: 4.6, reviewCount: 73, badge: null,                                          image: null },
  { id: 'BIO-MAS-005', slug: 'bio-mas-005', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla Retinol Bioaqua',                     price: 8000, rating: 4.7, reviewCount: 88, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
  { id: 'BIO-MAS-006', slug: 'bio-mas-006', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla Niacinamida Bioaqua',                 price: 8000, rating: 4.6, reviewCount: 61, badge: null,                                          image: null },
  { id: 'BIO-MAS-007', slug: 'bio-mas-007', marca: 'Bioaqua', category: 'skincare', tipo: 'Mascarilla Facial', name: 'Mascarilla Velo de Rosas Bioaqua',               price: 8000, rating: 4.8, reviewCount: 104,badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  // ── Parche de Labios – Bioaqua ──
  { id: 'BIO-PL-001',  slug: 'bio-pl-001',  marca: 'Bioaqua', category: 'skincare', tipo: 'Parche de Labios', name: 'Parche de Labios Retinol Bioaqua',              price: 10000, rating: 4.5, reviewCount: 33, badge: null,                                          image: null },
  { id: 'BIO-PL-002',  slug: 'bio-pl-002',  marca: 'Bioaqua', category: 'skincare', tipo: 'Parche de Labios', name: 'Parche de Labios Vitamina C Bioaqua',           price: 10000, rating: 4.6, reviewCount: 27, badge: { type: 'nuevo',      label: 'Nuevo'       }, image: null },
  { id: 'BIO-PL-003',  slug: 'bio-pl-003',  marca: 'Bioaqua', category: 'skincare', tipo: 'Parche de Labios', name: 'Parche de Labios Ácido Hialurónico Bioaqua',    price: 10000, rating: 4.7, reviewCount: 41, badge: null,                                          image: null },
  // ── Polvo Compacto – Maquillaje ──
  { id: 'PC-001',       slug: 'pc-001',       marca: 'Uschas',  category: 'maquillaje', tipo: 'Polvo Compacto', name: 'Polvo Compacto Uschas',                        price: 25000, rating: 4.6, reviewCount: 59, badge: { type: 'bestseller', label: 'Más Vendido' }, image: null },
  { id: 'PC-002',       slug: 'pc-002',       marca: 'Engol',   category: 'maquillaje', tipo: 'Polvo Compacto', name: 'Polvo Compacto Engol',                         price: 22000, rating: 4.5, reviewCount: 44, badge: null,                                          image: null },
  { id: 'PC-003',       slug: 'pc-003',       marca: 'Alissha', category: 'maquillaje', tipo: 'Polvo Compacto', name: 'Polvo Compacto Alissha',                       price: 23000, rating: 4.7, reviewCount: 37, badge: { type: 'novedad',    label: 'Novedad'     }, image: null },
]

const TIPOS_BY_CATEGORY = {
  '':                 ['Contorno de Ojos','Jabón Facial','Crema Facial','Sérum Facial','Tarro de Ojeras','Protector Solar','Mascarilla Facial','Parche de Labios','Polvo Compacto'],
  'maquillaje':       ['Polvo Compacto'],
  'skincare':         ['Contorno de Ojos','Jabón Facial','Crema Facial','Sérum Facial','Tarro de Ojeras','Mascarilla Facial','Parche de Labios'],
  'proteccion-solar': ['Protector Solar'],
  'tratamientos':     [],
  'mas-vendidos':     ['Contorno de Ojos','Sérum Facial','Crema Facial','Mascarilla Facial','Polvo Compacto'],
  'novedades':        ['Jabón Facial','Sérum Facial','Mascarilla Facial','Contorno de Ojos','Parche de Labios'],
}

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
  { label: 'Hasta $5.000',            min: 0,     max: 5000   },
  { label: '$5.000 – $15.000',        min: 5000,  max: 15000  },
  { label: '$15.000 – $25.000',       min: 15000, max: 25000  },
  { label: 'Más de $25.000',          min: 25000, max: Infinity },
]

// ── Component ──────────────────────────────────────────────────────────────────
export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('categoria') || ''

  const [sortBy, setSortBy]               = useState('relevancia')
  const [priceRange, setPriceRange]       = useState(null)
  const [minRating, setMinRating]         = useState(0)
  const [selectedTipos, setSelectedTipos] = useState([])
  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [sortOpen, setSortOpen]           = useState(false)
  const sidebarRef                        = useRef(null)

  // Reset filters when category changes
  useEffect(() => {
    setPriceRange(null)
    setMinRating(0)
    setSelectedTipos([])
    setSortBy('relevancia')
  }, [activeCategory])

  // Sidebar max-height dinámico: ocupa exactamente el espacio restante en pantalla
  useEffect(() => {
    const recalc = () => {
      const el = sidebarRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      el.style.maxHeight = `${window.innerHeight - Math.max(top, 0)}px`
    }
    recalc()
    window.addEventListener('scroll', recalc, { passive: true })
    window.addEventListener('resize', recalc, { passive: true })
    return () => {
      window.removeEventListener('scroll', recalc)
      window.removeEventListener('resize', recalc)
    }
  }, [sidebarOpen])

  const toggleTipo = (tipo) =>
    setSelectedTipos(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )

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

    // Tipo filter
    if (selectedTipos.length > 0) {
      list = list.filter(p => selectedTipos.includes(p.tipo))
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
  }, [activeCategory, selectedTipos, priceRange, minRating, sortBy])

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META['']
  const activeLabel = CATEGORIES.find(c => c.slug === activeCategory)?.label || 'Todos'

  const activeFilterCount = (priceRange !== null ? 1 : 0) + (minRating > 0 ? 1 : 0) + selectedTipos.length
  const clearFilters = () => { setPriceRange(null); setMinRating(0); setSelectedTipos([]) }

  const availableTipos = TIPOS_BY_CATEGORY[activeCategory] ?? TIPOS_BY_CATEGORY['']

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
        <aside ref={sidebarRef} className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>

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

          {/* Tipo */}
          <FilterSection title="Tipo">
            {availableTipos.map(tipo => (
              <label key={tipo} className={styles.filterOption}>
                <input
                  type="checkbox"
                  className={styles.filterCheckbox}
                  checked={selectedTipos.includes(tipo)}
                  onChange={() => toggleTipo(tipo)}
                />
                <span>{tipo}</span>
              </label>
            ))}
          </FilterSection>

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
              {selectedTipos.map(tipo => (
                <span key={tipo} className={styles.activeChip}>
                  {tipo}
                  <button onClick={() => toggleTipo(tipo)} className={styles.chipRemove}><XIcon /></button>
                </span>
              ))}
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
