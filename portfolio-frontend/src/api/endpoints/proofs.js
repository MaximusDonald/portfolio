import apiClient, { createFormDataClient } from '../client'

/**
 * Endpoints pour la gestion des preuves (fichiers)
 */
export const proofsAPI = {
  /**
   * Lister toutes mes preuves
   * GET /api/proofs/
   */
  getAll: async () => {
    const response = await apiClient.get('/proofs/')
    return response.data
  },

  /**
   * Récupérer une preuve par ID
   * GET /api/proofs/{id}/
   */
  getById: async (id) => {
    const response = await apiClient.get(`/proofs/${id}/`)
    return response.data
  },

  /**
   * Upload d'une nouvelle preuve
   * POST /api/proofs/
   */
  create: async (data) => {
    const formData = new FormData()
    
    // Ajouter tous les champs au FormData
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    const formDataClient = createFormDataClient()
    const response = await formDataClient.post('/proofs/', formData)
    return response.data
  },

  /**
   * Mettre à jour une preuve
   * PATCH /api/proofs/{id}/
   */
  update: async (id, data) => {
    const response = await apiClient.patch(`/proofs/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer une preuve
   * DELETE /api/proofs/{id}/
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/proofs/${id}/`)
    return response.data
  },

  /**
   * Récupérer les preuves d'un objet spécifique
   * GET /api/proofs/for_object/?content_type={type}&object_id={id}
   */
  getForObject: async (contentType, objectId) => {
    const response = await apiClient.get('/proofs/for_object/', {
      params: {
        content_type: contentType,
        object_id: objectId
      }
    })
    return response.data
  },

  /**
   * Réorganiser l'ordre des preuves
   * POST /api/proofs/reorder/
   */
  reorder: async (proofs) => {
    const response = await apiClient.post('/proofs/reorder/', {
      proofs
    })
    return response.data
  },
}