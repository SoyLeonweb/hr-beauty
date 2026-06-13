import { Routes, Route } from 'react-router-dom'
import Layout from '@components/common/Layout'
import Home from '@pages/Home'
import Catalogo from '@pages/Catalogo'
import Producto from '@pages/Producto'
import Carrito from '@pages/Carrito'
import Checkout from '@pages/Checkout'
import Login from '@pages/Login'
import Dashboard from '@pages/Dashboard'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  )
}
