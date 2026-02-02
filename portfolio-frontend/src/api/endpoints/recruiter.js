import apiClient, { unwrapListResponse } from '../client'

/**
 * Endpoints pour les liens recruteurs
 * API Backend: /api/recruiter-access/
 */
export const recruiterAPI = {
  /**
   * Récupérer tous les liens recruteurs
   */
  getAll: async () => {
    const response = await apiClient.get('/recruiter-access/')
    return unwrapListResponse(response.data)
  },

  /**
   * Récupérer uniquement les liens actifs
   */
  getActive: async () => {
    const response = await apiClient.get('/recruiter-access/active/')
    return unwrapListResponse(response.data)
  },

  /**
   * Récupérer un lien par son ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/recruiter-access/${id}/`)
    return response.data
  },

  /**
   * Créer un nouveau lien recruteur
   * @param {Object} data - { name, description?, duration_hours }
   */
  create: async (data) => {
    const response = await apiClient.post('/recruiter-access/', data)
    return response.data
  },

  /**
   * Mettre à jour un lien recruteur
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/recruiter-access/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer un lien recruteur
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/recruiter-access/${id}/`)
    return response.data
  },

  /**
   * Révoquer un lien (le désactiver)
   */
  revoke: async (id) => {
    const response = await apiClient.post(`/recruiter-access/${id}/revoke/`)
    return response.data
  },

  /**
   * Réactiver un lien révoqué (si non expiré)
   */
  activate: async (id) => {
    const response = await apiClient.post(`/recruiter-access/${id}/activate/`)
    return response.data
  },

  /**
   * Récupérer les statistiques des liens
   */
  statistics: async () => {
    const response = await apiClient.get('/recruiter-access/statistics/')
    return response.data
  },

  /**
   * Valider un token recruteur (endpoint public)
   */
  validateToken: async (token) => {
    const response = await apiClient.post('/recruiter-access/validate/', { token })
    return response.data
  }
}