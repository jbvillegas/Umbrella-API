import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = Cookies.get('auth_token')
    if (token) {
      // In production, validate token with API
      setUser({
        id: '1',
        name: 'Demo User',
        email: 'demo@umbrella-api.com',
        tier: 'free'
      })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Demo authentication
    if (email === 'demo@umbrella-api.com' && password === 'demo123') {
      const userData = {
        id: '1',
        name: 'Demo User',
        email: 'demo@umbrella-api.com',
        tier: 'free'
      }
      setUser(userData)
      Cookies.set('auth_token', 'demo_token', { expires: 7 })
      return userData
    }
    throw new Error('Invalid credentials')
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('auth_token')
  }

  const signup = async (name, email, password) => {
    // Demo signup
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      tier: 'free'
    }
    setUser(userData)
    Cookies.set('auth_token', 'demo_token', { expires: 7 })
    return userData
  }

  const value = {
    user,
    login,
    logout,
    signup,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
