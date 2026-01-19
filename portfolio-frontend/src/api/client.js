import axios from 'axios'

/**
 * Configuration de base de l'API
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api'

/**
 * Instance Axios configurée pour l'API Django
 */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 secondes
})

/**
 * Récupérer le token d'accès depuis localStorage
 */
const getAccessToken = () => {
  return localStorage.getItem('portfolio_auth_token')
}

/**
 * Récupérer le refresh token depuis localStorage
 */
const getRefreshToken = () => {
  return localStorage.getItem('portfolio_refresh_token')
}

/**
 * Sauvegarder les tokens
 */
export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('portfolio_auth_token', accessToken)
  if (refreshToken) {
    localStorage.setItem('portfolio_refresh_token', refreshToken)
  }
}

/**
 * Supprimer les tokens (logout)
 */
export const clearTokens = () => {
  localStorage.removeItem('portfolio_auth_token')
  localStorage.removeItem('portfolio_refresh_token')
}

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  return !!getAccessToken()
}

/**
 * INTERCEPTEUR REQUEST
 * Ajoute automatiquement le token JWT à toutes les requêtes
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * INTERCEPTEUR RESPONSE
 * Gère le refresh automatique du token en cas d'expiration
 */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si l'erreur n'est pas 401 ou si c'est déjà une retry, rejeter
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Si la requête échouée est le refresh lui-même, logout
    if (originalRequest.url?.includes('/auth/refresh/')) {
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Marquer la requête comme retry
    originalRequest._retry = true

    // Si un refresh est déjà en cours, mettre en queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
        .catch(err => Promise.reject(err))
    }

    isRefreshing = true

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      // Tenter de refresh le token
      const response = await axios.post(
        `${API_BASE_URL}${API_PREFIX}/auth/refresh/`,
        { refresh: refreshToken }
      )

      const { access } = response.data
      saveTokens(access, refreshToken)

      // Mettre à jour le header de la requête originale
      originalRequest.headers.Authorization = `Bearer ${access}`

      // Résoudre toutes les requêtes en attente
      processQueue(null, access)

      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

/**
 * Helper pour les requêtes avec FormData (upload de fichiers)
 */
export const createFormDataClient = () => {
  const formDataClient = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // 30 secondes pour les uploads
  })

  // Ajouter le même intercepteur pour le token
  formDataClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  return formDataClient
}

export default apiClient