import { useState, useCallback } from 'react'

/**
 * Hook générique pour les appels API
 * Gère automatiquement loading, error et data
 * 
 * @param {Function} apiFunction - Fonction API à appeler
 * @returns {Object} - { data, loading, error, execute, reset }
 * 
 * @example
 * const { data, loading, error, execute } = useApi(projectsAPI.getAll)
 * 
 * useEffect(() => {
 *   execute()
 * }, [])
 */
export function useApi(apiFunction) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true)
        setError(null)
        
        const result = await apiFunction(...args)
        setData(result)
        
        return { success: true, data: result }
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 
                            err.response?.data?.error || 
                            err.message || 
                            'Une erreur est survenue'
        
        setError(errorMessage)
        
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}