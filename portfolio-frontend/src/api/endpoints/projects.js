import apiClient, { createFormDataClient } from '../client'

/**
 * Endpoints pour la gestion des projets
 */
export const projectsAPI = {
  /**
   * Lister tous mes projets
   * GET /api/projects/
   */
  getAll: async () => {
    const response = await apiClient.get('/projects/')
    return response.data
  },

  /**
   * Récupérer un projet par ID
   * GET /api/projects/{id}/
   */
  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}/`)
    return response.data
  },

  /**
   * Créer un nouveau projet
   * POST /api/projects/
   */
  create: async (data) => {
    // Si une image de couverture est fournie, utiliser FormData
    if (data.cover_image instanceof File) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })

      const formDataClient = createFormDataClient()
      const response = await formDataClient.post('/projects/', formData)
      return response.data
    }

    const response = await apiClient.post('/projects/', data)
    return response.data
  },

  /**
   * Mettre à jour un projet
   * PATCH /api/projects/{id}/
   */
  update: async (id, data) => {
    // Si une image de couverture est fournie, utiliser FormData
    if (data.cover_image instanceof File) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })

      const formDataClient = createFormDataClient()
      const response = await formDataClient.patch(`/projects/${id}/`, formData)
      return response.data
    }

    const response = await apiClient.patch(`/projects/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer un projet
   * DELETE /api/projects/{id}/
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}/`)
    return response.data
  },

  /**
   * Récupérer les projets publics d'un utilisateur
   * GET /api/projects/public/?user_id={userId}
   */
  getPublic: async (userId) => {
    const response = await apiClient.get('/projects/public/', {
      params: { user_id: userId }
    })
    return response.data
  },

  /**
   * Récupérer les projets mis en avant
   * GET /api/projects/featured/?user_id={userId}
   */
  getFeatured: async (userId) => {
    const response = await apiClient.get('/projects/featured/', {
      params: { user_id: userId }
    })
    return response.data
  },

  /**
   * Réorganiser l'ordre des projets
   * POST /api/projects/reorder/
   */
  reorder: async (projects) => {
    const response = await apiClient.post('/projects/reorder/', {
      projects
    })
    return response.data
  },

  /**
   * Basculer le statut "mis en avant"
   * POST /api/projects/{id}/toggle_featured/
   */
  toggleFeatured: async (id) => {
    const response = await apiClient.post(`/projects/${id}/toggle_featured/`)
    return response.data
  },

  /**
   * Supprimer l'image de couverture
   * DELETE /api/projects/{id}/delete_cover/
   */
  deleteCover: async (id) => {
    const response = await apiClient.delete(`/projects/${id}/delete_cover/`)
    return response.data
  },
}