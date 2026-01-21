import { Link } from 'react-router-dom'
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

/**
 * Widget d'indication de complétion du profil
 * 
 * @param {Object} completionData - { isComplete, views }
 * @param {boolean} loading - État de chargement
 */
export function ProfileCompletionWidget({ completionData, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complétion du Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isComplete = completionData?.isComplete ?? false
  const views = completionData?.views ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          )}
          Complétion du Profil
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Statut */}
        {isComplete ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              ✓ Votre profil est complet et visible publiquement
            </p>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-2">
              ⚠ Profil incomplet
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-400">
              Complétez au moins 2 champs parmi : titre professionnel, bio, localisation
            </p>
          </div>
        )}

        {/* Vues du profil */}
        <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Vues du profil public
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {views}
          </span>
        </div>

        {/* Action */}
        <Link
          to="/admin/profile"
          className="flex items-center justify-between w-full px-4 py-3 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors group"
        >
          <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
            {isComplete ? 'Modifier mon profil' : 'Compléter mon profil'}
          </span>
          <ArrowRight className="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  )
}