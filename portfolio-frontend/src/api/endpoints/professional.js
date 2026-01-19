import apiClient from '../client'

/**
 * Endpoints pour les expériences professionnelles
 */
export const experiencesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/professional/experiences/')
    return response.data
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

  getPublic: async (userId) => {
    const response = await apiClient.get('/professional/experiences/public/', {
      params: { user_id: userId }
    })
    return response.data
  },

  reorder: async (experiences) => {
    const response = await apiClient.post('/professional/experiences/reorder/', {
      experiences
    })
    return response.data
  },
}

/**
 * Endpoints pour les formations complémentaires
 */
export const trainingsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/professional/trainings/')
    return response.data
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

  getPublic: async (userId) => {
    const response = await apiClient.get('/professional/trainings/public/', {
      params: { user_id: userId }
    })
    return response.data
  },

  reorder: async (trainings) => {
    const response = await apiClient.post('/professional/trainings/reorder/', {
      trainings
    })
    return response.data
  },
}