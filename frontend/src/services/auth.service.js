import api from './api'

export const authService = {
  login:    (email, password) => api.post('/auth/login', { email, password })
                                    .then(res => { localStorage.setItem('hr_token', res.token); return res.user }),
  register: (data)            => api.post('/auth/register', data),
  me:       ()                => api.get('/auth/me'),
  logout:   ()                => { localStorage.removeItem('hr_token') },
}
