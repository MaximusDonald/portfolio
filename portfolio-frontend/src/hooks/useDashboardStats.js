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

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Appels parallèles pour optimiser les performances
      const [
        profileData,
        projectsData,
        skillsData,
        diplomasData,
        experiencesData,
      ] = await Promise.all([
        profileAPI.checkCompleteness().catch(() => ({ is_complete: false, profile_views: 0 })),
        projectsAPI.getAll().catch(() => []),
        skillsAPI.getStatistics().catch(() => ({ total: 0, primary: 0, by_category: {} })),
        diplomasAPI.getAll().catch(() => []),
        experiencesAPI.getAll().catch(() => []),
      ])

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
      console.error('Erreur lors du chargement des statistiques:', err)
      setError('Impossible de charger les statistiques')
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
    refresh: fetchStats,
  }
}