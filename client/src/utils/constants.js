export const ROUTES = {
  HOME:     '/',
  CATALOGO: '/catalogo',
  PRODUCTO: '/producto/:id',
  CARRITO:  '/carrito',
  CHECKOUT: '/checkout',
  LOGIN:    '/login',
  DASHBOARD:'/dashboard',
}

export const CATEGORIES = ['Hidratación', 'Maquillaje', 'Cuidado Solar', 'Limpieza', 'Sérum', 'Contorno de Ojos']

export const SORT_OPTIONS = [
  { value: 'newest',    label: 'Más nuevos' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc',label: 'Precio: mayor a menor' },
  { value: 'rating',    label: 'Mejor valorados' },
]
