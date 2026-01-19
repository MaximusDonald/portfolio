import apiClient from '../client'

/**
 * Endpoints pour la gestion des liens recruteur
 */
export const recruiterAPI = {
  /**
   * Lister tous mes liens recruteur
   * GET /api/recruiter-access/
   */
  getAll: async () => {
    const response = await apiClient.get('/recruiter-access/')
    return response.data
  },

  /**
   * Récupérer un lien par ID
   * GET /api/recruiter-access/{id}/
   */
  getById: async (id) => {
    const response = await apiClient.get(`/recruiter-access/${id}/`)
    return response.data
  },

  /**
   * Créer un nouveau lien recruteur
   * POST /api/recruiter-access/
   */
  create: async (data) => {
    const response = await apiClient.post('/recruiter-access/', data)
    return response.data
  },

  /**
   * Mettre à jour un lien
   * PATCH /api/recruiter-access/{id}/
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/recruiter-access/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer un lien
   * DELETE /api/recruiter-access/{id}/
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/recruiter-access/${id}/`)
    return response.data
  },

  /**
   * Révoquer un lien (le désactiver)
   * POST /api/recruiter-access/{id}/revoke/
   */
  revoke: async (id) => {
    const response = await apiClient.post(`/recruiter-access/${id}/revoke/`)
    return response.data
  },

  /**
   * Réactiver un lien
   * POST /api/recruiter-access/{id}/activate/
   */
  activate: async (id) => {
    const response = await apiClient.post(`/recruiter-access/${id}/activate/`)
    return response.data
  },

  /**
   * Valider un token recruteur (endpoint public)
   * POST /api/recruiter-access/validate/
   */
  validateToken: async (token) => {
    const response = await apiClient.post('/recruiter-access/validate/', {
      token
    })
    return response.data
  },

  /**
   * Récupérer uniquement les liens actifs
   * GET /api/recruiter-access/active/
   */
  getActive: async () => {
    const response = await apiClient.get('/recruiter-access/active/')
    return response.data
  },

  /**
   * Récupérer les statistiques des liens
   * GET /api/recruiter-access/statistics/
   */
  getStatistics: async () => {
    const response = await apiClient.get('/recruiter-access/statistics/')
    return response.data
  },
}