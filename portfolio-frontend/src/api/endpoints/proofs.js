import apiClient, { createFormDataClient, unwrapListResponse } from '../client'

/**
 * Endpoints pour la gestion des preuves (fichiers attachés)
 */
export const proofsAPI = {
  /**
   * Lister toutes les preuves (rarement utilisé directement)
   */
  getAll: async () => {
    const response = await apiClient.get('/proofs/')
    return unwrapListResponse(response.data)
  },

  /**
   * Récupérer les preuves d'un objet spécifique
   * @param {string} contentType - 'project', 'diploma', 'certification', etc.
   * @param {string} objectId - ID de l'objet parent
   */
  getByObject: async (contentType, objectId) => {
    const response = await apiClient.get('/proofs/for_object/', {
      params: {
        content_type: contentType,
        object_id: objectId
      }
    })
    return unwrapListResponse(response.data)
  },

  /**
   * Créer/Uploader une nouvelle preuve
   */
  create: async (data) => {
    const formData = new FormData()

    // Ajout des champs au FormData
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
   */
  update: async (id, data) => {
    // Si un nouveau fichier est fourni
    if (data.file instanceof File) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })
      const formDataClient = createFormDataClient()
      const response = await formDataClient.patch(`/proofs/${id}/`, formData)
      return response.data
    }

    // Sinon JSON simple
    const response = await apiClient.patch(`/proofs/${id}/`, data)
    return response.data
  },

  /**
   * Supprimer une preuve
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/proofs/${id}/`)
    return response.data
  },

  /**
   * Réorganiser l'ordre des preuves
   * @param {Array} proofs - Liste des objets [{id, display_order}, ...]
   */
  reorder: async (proofs) => {
    const response = await apiClient.post('/proofs/reorder/', {
      proofs
    })
    return response.data
  }
}