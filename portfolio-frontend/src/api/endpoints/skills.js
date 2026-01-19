import apiClient from '../client'

/**
 * Endpoints pour la gestion des compétences
 */
export const skillsAPI = {
  /**
   * Lister toutes mes compétences
   * GET /api/skills/
   */
  getAll: async () => {
    const response = await apiClient.get('/skills/')
    return response.data
  },

  /**
   * Récupérer une compétence par ID
   * GET /api/skills/{id}/
   */
  getById: async (id) => {
    const response = await apiClient.get(`/skills/${id}/`)
    return response.data
  },

  /**
   * Créer une nouvelle compétence
   * POST /api/skills/
   */
  create: async (data) => {
    const response = await apiClient.post('/skills/', data)
    return response.data
  },

  /**
   * Mettre à jour une compétence
   * PATCH /api/skills/{id}/
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/skills/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer une compétence
   * DELETE /api/skills/{id}/
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/skills/${id}/`)
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
    return response.data
  },

  /**
   * Récupérer les compétences groupées par catégorie
   * GET /api/skills/grouped/?user_id={userId}
   */
  getGrouped: async (userId) => {
    const response = await apiClient.get('/skills/grouped/', {
      params: { user_id: userId }
    })
    return response.data
  },

  /**
   * Récupérer uniquement les compétences principales
   * GET /api/skills/primary/?user_id={userId}
   */
  getPrimary: async (userId) => {
    const response = await apiClient.get('/skills/primary/', {
      params: { user_id: userId }
    })
    return response.data
  },

  /**
   * Réorganiser l'ordre des compétences
   * POST /api/skills/reorder/
   */
  reorder: async (skills) => {
    const response = await apiClient.post('/skills/reorder/', {
      skills
    })
    return response.data
  },

  /**
   * Basculer le statut "compétence principale"
   * POST /api/skills/{id}/toggle_primary/
   */
  togglePrimary: async (id) => {
    const response = await apiClient.post(`/skills/${id}/toggle_primary/`)
    return response.data
  },

  /**
   * Récupérer les statistiques des compétences
   * GET /api/skills/statistics/
   */
  getStatistics: async () => {
    const response = await apiClient.get('/skills/statistics/')
    return response.data
  },
}