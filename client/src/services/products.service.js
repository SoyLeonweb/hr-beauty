import api from './api'

export const productsService = {
  getAll:    (params) => api.get('/products', { params }),
  getById:   (id)     => api.get(`/products/${id}`),
  getBySlug: (slug)   => api.get(`/products/slug/${slug}`),
  getFeatured:()      => api.get('/products/featured'),
}
