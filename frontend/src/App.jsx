import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
