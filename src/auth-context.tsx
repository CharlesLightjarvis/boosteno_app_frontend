// auth-context.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import { checkAuth } from './auth-service'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    role: null,
  })

  useEffect(() => {
    const loadAuthStatus = async () => {
      const status = await checkAuth()
      setAuthStatus(status)
    }

    loadAuthStatus()
  }, []) // On mount, check auth status

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
