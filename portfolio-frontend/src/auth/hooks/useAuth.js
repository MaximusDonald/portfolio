import { useContext } from 'react'
import { AuthContext } from '../AuthContext'

/**
 * Hook pour accéder à l'authentification
 * 
 * @returns {Object} - { user, isAuthenticated, isLoading, login, register, logout, refreshUser }
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth()
 * 
 * if (isAuthenticated) {
 *   return <p>Bonjour {user.first_name}</p>
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider')
  }
  
  return context
}