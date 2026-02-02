// src/api/education.js
import apiClient, { unwrapListResponse } from '../client'

export const diplomasAPI = {
  getAll: async () => {
    const response = await apiClient.get('/education/diplomas/')
    return unwrapListResponse(response.data)
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
    await apiClient.delete(`/education/diplomas/${id}/`)
    // pas besoin de return data ici
  },

  getPublic: async (userId, params = {}) => {
    const response = await apiClient.get('/education/diplomas/public/', {
      params: { user_id: userId, ...params }
    })
    return unwrapListResponse(response.data)
  },

  reorder: async (diplomas) => {
    const response = await apiClient.post('/education/diplomas/reorder/', { diplomas })
    return response.data
  },

  /**
   * Basculer le statut "publié"
   * POST /api/education/diplomas/{id}/toggle_publish/
   */
  togglePublish: async (id) => {
    const response = await apiClient.post(`/education/diplomas/${id}/toggle_publish/`)
    return response.data
  },
}

export const certificationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/education/certifications/')
    return unwrapListResponse(response.data)
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
    await apiClient.delete(`/education/certifications/${id}/`)
    // pas besoin de return data ici
  },

  getPublic: async (userId, params = {}) => {
    const response = await apiClient.get('/education/certifications/public/', {
      params: { user_id: userId, ...params }
    })
    return unwrapListResponse(response.data)
  },

  reorder: async (certifications) => {
    const response = await apiClient.post('/education/certifications/reorder/', { certifications })
    return response.data
  },

  /**
   * Basculer le statut "publié"
   * POST /api/education/certifications/{id}/toggle_publish/
   */
  togglePublish: async (id) => {
    const response = await apiClient.post(`/education/certifications/${id}/toggle_publish/`)
    return response.data
  },
}