import { Card, CardContent } from '@/components/ui'
import { cn } from '@/utils/cn'

/**
 * Carte de statistique avec icône
 * 
 * @param {string} title - Titre de la stat
 * @param {number|string} value - Valeur principale
 * @param {string} subtitle - Texte secondaire (optionnel)
 * @param {React.Component} icon - Icône Lucide React
 * @param {string} color - Couleur du thème (blue|green|purple|orange|red)
 * @param {boolean} loading - État de chargement
 */
export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  loading = false 
}) {
  const colorVariants = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      icon: 'text-orange-600 dark:text-orange-400',
      text: 'text-orange-600 dark:text-orange-400',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400',
    },
  }

  const colors = colorVariants[color] || colorVariants.blue

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {value}
            </p>
            {subtitle && (
              <p className={cn('text-sm font-medium', colors.text)}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Icône */}
          {Icon && (
            <div className={cn('p-3 rounded-lg', colors.bg)}>
              <Icon className={cn('h-6 w-6', colors.icon)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}