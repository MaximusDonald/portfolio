import apiClient, { unwrapListResponse } from '../client'

/**
 * Endpoints pour la gestion des compétences
 */
export const skillsAPI = {
  /**
   * Lister toutes les compétences
   */
  getAll: async () => {
    const response = await apiClient.get('/skills/')
    return unwrapListResponse(response.data)
  },

  /**
   * Récupérer une compétence par ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/skills/${id}/`)
    return response.data
  },

  /**
   * Créer une compétence
   */
  create: async (data) => {
    const response = await apiClient.post('/skills/', data)
    return response.data
  },

  /**
   * Mettre à jour une compétence
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/skills/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer une compétence
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/skills/${id}/`)
    return response.data
  },

  /**
   * Réorganiser les compétences
   */
  reorder: async (skills) => {
    const response = await apiClient.post('/skills/reorder/', { skills })
    return response.data
  },

  /**
   * Récupérer les compétences publiques d'un utilisateur
   * GET /api/skills/public/?user_id={userId}
   */
  getPublic: async (userId) => {
    const response = await apiClient.get('/skills/public/', {
      params: { user_id: userId }
    })
    return unwrapListResponse(response.data)
  },

  /**
   * Obtenir les compétences groupées par catégorie (Public)
   */
  getGrouped: async (userId, params = {}) => {
    const response = await apiClient.get('/skills/grouped/', {
      params: { user_id: userId, ...params }
    })
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get('/skills/statistics/')
    return response.data
  }
}