import apiClient, { unwrapListResponse } from '../client'

/**
 * Endpoints pour les expériences professionnelles
 */
export const experiencesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/professional/experiences/')
    return unwrapListResponse(response.data)
  },
  getById: async (id) => {
    const response = await apiClient.get(`/professional/experiences/${id}/`)
    return response.data
  },
  create: async (data) => {
    const response = await apiClient.post('/professional/experiences/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await apiClient.patch(`/professional/experiences/${id}/`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/professional/experiences/${id}/`)
    return response.data
  },
  getPublic: async (userId, params = {}) => {
    const response = await apiClient.get('/professional/experiences/public/', {
      params: { user_id: userId, ...params }
    })
    return unwrapListResponse(response.data)
  },
  reorder: async (experiences) => {
    const response = await apiClient.post('/professional/experiences/reorder/', { experiences })
    return response.data
  },
  /**
   * Basculer le statut "publié"
   * POST /api/professional/experiences/{id}/toggle_publish/
   */
  togglePublish: async (id) => {
    const response = await apiClient.post(`/professional/experiences/${id}/toggle_publish/`)
    return response.data
  },
}

/**
 * Endpoints pour les formations
 */
export const trainingsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/professional/trainings/')
    return unwrapListResponse(response.data)
  },
  getById: async (id) => {
    const response = await apiClient.get(`/professional/trainings/${id}/`)
    return response.data
  },
  create: async (data) => {
    const response = await apiClient.post('/professional/trainings/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await apiClient.patch(`/professional/trainings/${id}/`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/professional/trainings/${id}/`)
    return response.data
  },
  getPublic: async (userId, params = {}) => {
    const response = await apiClient.get('/professional/trainings/public/', {
      params: { user_id: userId, ...params }
    })
    return unwrapListResponse(response.data)
  },
  reorder: async (trainings) => {
    const response = await apiClient.post('/professional/trainings/reorder/', { trainings })
    return response.data
  },
  /**
   * Basculer le statut "publié"
   * POST /api/professional/trainings/{id}/toggle_publish/
   */
  togglePublish: async (id) => {
    const response = await apiClient.post(`/professional/trainings/${id}/toggle_publish/`)
    return response.data
  },
}