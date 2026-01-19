import apiClient from '../client'

/**
 * Endpoints pour les diplômes
 */
export const diplomasAPI = {
  getAll: async () => {
    const response = await apiClient.get('/education/diplomas/')
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`/education/diplomas/${id}/`)
    return response.data
  },

  create: async (data) => {
    const response = await apiClient.post('/education/diplomas/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await apiClient.patch(`/education/diplomas/${id}/`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/education/diplomas/${id}/`)
    return response.data
  },

  getPublic: async (userId) => {
    const response = await apiClient.get('/education/diplomas/public/', {
      params: { user_id: userId }
    })
    return response.data
  },

  reorder: async (diplomas) => {
    const response = await apiClient.post('/education/diplomas/reorder/', {
      diplomas
    })
    return response.data
  },
}

/**
 * Endpoints pour les certifications
 */
export const certificationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/education/certifications/')
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`/education/certifications/${id}/`)
    return response.data
  },

  create: async (data) => {
    const response = await apiClient.post('/education/certifications/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await apiClient.patch(`/education/certifications/${id}/`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/education/certifications/${id}/`)
    return response.data
  },

  getPublic: async (userId) => {
    const response = await apiClient.get('/education/certifications/public/', {
      params: { user_id: userId }
    })
    return response.data
  },

  reorder: async (certifications) => {
    const response = await apiClient.post('/education/certifications/reorder/', {
      certifications
    })
    return response.data
  },
}