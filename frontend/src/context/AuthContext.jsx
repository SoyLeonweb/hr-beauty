import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('hr_token')
    if (token) authService.me().then(setUser).catch(() => {}).finally(() => setLoading(false))
    else setLoading(false)
  }, [])

  const login  = async (email, password) => { const u = await authService.login(email, password); setUser(u); return u }
  const logout = ()  => { localStorage.removeItem('hr_token'); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
