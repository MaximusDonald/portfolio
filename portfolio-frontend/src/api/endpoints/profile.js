import apiClient, { createFormDataClient } from '../client'

/**
 * Endpoints pour la gestion du profil portfolio
 */
export const profileAPI = {
  /**
   * Récupérer mon profil (authentifié)
   * GET /api/profile/me/
   */
  getMyProfile: async () => {
    const response = await apiClient.get('/profile/me/')
    return response.data
  },
  getDefault: async () => {
    const response = await apiClient.get('/profile/public/default/')
    return response.data
  },

  /**
   * Mettre à jour mon profil
   * PATCH /api/profile/me/
   */
  updateMyProfile: async (data) => {
    // Note: Le backend gère maintenant la conversion des chaîne vides ("") en null
    // pour les champs qui le nécessitent (dates, etc) via to_internal_value
    const response = await apiClient.patch('/profile/me/', data)
    return response.data
  },

  exportPortfolio: async () => {
    const response = await apiClient.get('/profile/export/')
    return response.data
  },

  importPortfolio: async (payload, options = {}) => {
    const mode = options?.mode
    const url = mode ? `/profile/import/?mode=${encodeURIComponent(mode)}` : '/profile/import/'
    const response = await apiClient.post(url, payload)
    return response.data
  },

  /**
   * Upload d'une photo de profil
   * POST /api/profile/upload-photo/
   */
  uploadPhoto: async (file) => {
    const formData = new FormData()
    formData.append('photo', file)

    const formDataClient = createFormDataClient()
    const response = await formDataClient.post('/profile/upload-photo/', formData)
    return response.data
  },

  /**
   * Supprimer la photo de profil
   * DELETE /api/profile/delete-photo/
   */
  deletePhoto: async () => {
    const response = await apiClient.delete('/profile/delete-photo/')
    return response.data
  },

  /**
   * Vérifier la complétude du profil
   * GET /api/profile/check-completeness/
   */
  checkCompleteness: async () => {
    const response = await apiClient.get('/profile/check-completeness/')
    return response.data
  },

  /**
   * Récupérer un profil public par user_id
   * GET /api/profile/public/{user_id}/
   */
  getPublicProfile: async (userId, params = {}) => {
    const response = await apiClient.get(`/profile/public/${userId}/`, { params })
    return response.data
  },
  getPublicBySlug: async (slug, params = {}) => {
    const res = await apiClient.get(`/profile/public/slug/${slug}/`, {
      params: { expand: 'projects,skills,diplomas,experiences', ...params } // optionnel
    })
    return res.data
  },
}