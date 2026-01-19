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

  /**
   * Mettre à jour mon profil
   * PATCH /api/profile/me/
   */
  updateMyProfile: async (data) => {
    const response = await apiClient.patch('/profile/me/', data)
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
  getPublicProfile: async (userId) => {
    const response = await apiClient.get(`/profile/public/${userId}/`)
    return response.data
  },
}