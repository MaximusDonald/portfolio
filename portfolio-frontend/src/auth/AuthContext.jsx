import { createContext, useState, useEffect, useCallback } from 'react'
import { authAPI, clearTokens, isAuthenticated as checkAuth } from '@/api'

/**
 * Context pour l'authentification
 */
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
})

/**
 * Provider pour l'authentification
 * Gère l'état global de l'utilisateur connecté
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Vérifier si l'utilisateur est authentifié au montage
   */
  useEffect(() => {
    const initAuth = async () => {
      const hasToken = checkAuth()
      
      if (hasToken) {
        try {
          // Vérifier le token et récupérer l'utilisateur
          const data = await authAPI.verifyToken()
          setUser(data.user)
        } catch (error) {
          console.error('Token invalide:', error)
          clearTokens()
          setUser(null)
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  /**
   * Connexion
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true)
      
      // Appel API login (les tokens sont sauvegardés automatiquement dans authAPI.login)
      const response = await authAPI.login(email, password)
      
      // Extraire l'utilisateur de la réponse
      // Backend retourne: { user: {...}, tokens: {...}, message: "..." }
      setUser(response.user)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          'Identifiants incorrects'
      
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Inscription
   * @param {Object} userData - { email, password, password_confirm, first_name, last_name }
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true)
      
      // Appel API register
      const response = await authAPI.register(userData)
      
      // Backend retourne: { user: {...}, tokens: {...}, message: "..." }
      setUser(response.user)
      
      return { success: true }
    } catch (error) {
      // Gérer les erreurs de validation
      const errorData = error.response?.data
      
      if (errorData && typeof errorData === 'object') {
        // Erreurs de champs spécifiques
        const fieldErrors = errorData.field_errors || {}
        const firstError = Object.values(fieldErrors)[0]?.[0] || 
                          errorData.detail || 
                          errorData.error ||
                          'Erreur lors de l\'inscription'
        
        return { success: false, error: firstError, fieldErrors }
      }
      
      return { success: false, error: 'Erreur lors de l\'inscription' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setUser(null)
    }
  }, [])

  /**
   * Rafraîchir les données de l'utilisateur
   */
  const refreshUser = useCallback(async () => {
    try {
      const data = await authAPI.getProfile()
      setUser(data)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error)
    }
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}