import apiClient, { saveTokens, clearTokens } from '../client'

/**
 * Endpoints d'authentification
 */
export const authAPI = {
  /**
   * Connexion utilisateur
   * POST /api/auth/login/
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
    })
    
    // Sauvegarder les tokens
    const { access, refresh } = response.data.tokens
    saveTokens(access, refresh)
    
    return response.data
  },

  /**
   * Inscription utilisateur
   * POST /api/auth/register/
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register/', userData)
    
    // Sauvegarder les tokens automatiquement après inscription
    const { access, refresh } = response.data.tokens
    saveTokens(access, refresh)
    
    return response.data
  },

  /**
   * Déconnexion
   * POST /api/auth/logout/
   */
  logout: async () => {
    const refreshToken = localStorage.getItem('portfolio_refresh_token')
    
    try {
      await apiClient.post('/auth/logout/', {
        refresh: refreshToken,
      })
    } finally {
      // Toujours nettoyer les tokens localement
      clearTokens()
    }
  },

  /**
   * Refresh du token
   * POST /api/auth/refresh/
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh/', {
      refresh: refreshToken,
    })
    
    return response.data
  },

  /**
   * Vérifier la validité du token
   * GET /api/auth/verify/
   */
  verifyToken: async () => {
    const response = await apiClient.get('/auth/verify/')
    return response.data
  },

  /**
   * Récupérer le profil utilisateur connecté
   * GET /api/auth/profile/
   */
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile/')
    return response.data
  },

  /**
   * Mettre à jour le profil utilisateur
   * PATCH /api/auth/profile/
   */
  updateProfile: async (data) => {
    const response = await apiClient.patch('/auth/profile/', data)
    return response.data
  },

  /**
   * Changer le mot de passe
   * POST /api/auth/change-password/
   */
  changePassword: async (oldPassword, newPassword, newPasswordConfirm) => {
    const response = await apiClient.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    })
    return response.data
  },
}