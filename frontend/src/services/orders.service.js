import api from './api'

export const ordersService = {
  create:  (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/me'),
  getById: (id)   => api.get(`/orders/${id}`),
}
