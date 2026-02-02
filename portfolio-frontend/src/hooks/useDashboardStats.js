import { useState, useEffect } from 'react'
import { 
  profileAPI, 
  projectsAPI, 
  skillsAPI, 
  diplomasAPI, 
  experiencesAPI 
} from '@/api'

/**
 * Hook pour récupérer toutes les statistiques du dashboard
 * 
 * @returns {Object} { stats, loading, error, refresh }
 */
export function useDashboardStats() {
  const [stats, setStats] = useState({
    profileCompletion: null,
    projects: { total: 0, featured: 0 },
    skills: { total: 0, primary: 0, byCategory: {} },
    diplomas: { total: 0 },
    experiences: { total: 0, current: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [partialErrors, setPartialErrors] = useState({})  // ← Nouveau : erreurs par API

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      setPartialErrors({})

      // Utiliser allSettled pour gérer erreurs partielles
      const results = await Promise.allSettled([
        profileAPI.checkCompleteness(),
        projectsAPI.getAll(),
        skillsAPI.getStatistics(),
        diplomasAPI.getAll(),
        experiencesAPI.getAll(),
      ])

      // Traiter chaque résultat
      const [profileRes, projectsRes, skillsRes, diplomasRes, experiencesRes] = results

      const getValueOrDefault = (name, res, defaultValue) => {
        if (res.status === 'fulfilled') return res.value
        console.error('Erreur partielle:', res.reason)
        setPartialErrors(prev => ({
          ...prev,
          [name]: res.reason?.message || 'Erreur inconnue'
        }))
        return defaultValue
      }

      const profileData = getValueOrDefault('profile', profileRes, { is_complete: false, profile_views: 0 })
      const projectsData = getValueOrDefault('projects', projectsRes, [])
      const skillsData = getValueOrDefault('skills', skillsRes, { total: 0, primary: 0, by_category: {} })
      const diplomasData = getValueOrDefault('diplomas', diplomasRes, [])
      const experiencesData = getValueOrDefault('experiences', experiencesRes, [])

      setStats({
        profileCompletion: {
          isComplete: profileData.is_complete,
          views: profileData.profile_views,
        },
        projects: {
          total: projectsData.length,
          featured: projectsData.filter(p => p.is_featured).length,
        },
        skills: {
          total: skillsData.total || 0,
          primary: skillsData.primary || 0,
          byCategory: skillsData.by_category || {},
        },
        diplomas: {
          total: diplomasData.length,
        },
        experiences: {
          total: experiencesData.length,
          current: experiencesData.filter(e => e.is_current).length,
        },
      })
    } catch (err) {
      console.error('Erreur globale lors du chargement des statistiques:', err)
      setError('Impossible de charger les statistiques. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    partialErrors,  // ← Exposer pour affichage ciblé si besoin
    refresh: fetchStats,
  }
}