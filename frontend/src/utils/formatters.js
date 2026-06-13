export const formatPrice = (amount, currency = 'EUR') =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount)

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))

export const slugify = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
