import { 
  FolderKanban, 
  Award, 
  GraduationCap, 
  Briefcase,
  Eye,
  RefreshCw
} from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { StatCard } from '@/components/admin/StatCard'
import { ProfileCompletionWidget } from '@/components/admin/ProfileCompletionWidget'
import { AdminLayout } from '@/layouts/AdminLayout'
import { QuickActions } from '@/components/admin/QuickActions'
import { Button } from '@/components/ui'

/**
 * Page Dashboard - Vue d'ensemble de l'espace admin
 */
export function Dashboard() {
  const { stats, loading, error, refresh } = useDashboardStats()

  return (
    <AdminLayout>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bienvenue sur votre espace d'administration
            </p>
          </div>

          {/* Bouton Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Message d'erreur global */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

      {/* Grille principale : Stats + Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : Stats (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats en cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Projets"
              value={stats.projects.total}
              subtitle={`${stats.projects.featured} mis en avant`}
              icon={FolderKanban}
              color="blue"
              loading={loading}
            />

            <StatCard
              title="Compétences"
              value={stats.skills.total}
              subtitle={`${stats.skills.primary} principales`}
              icon={Award}
              color="green"
              loading={loading}
            />

            <StatCard
              title="Diplômes"
              value={stats.diplomas.total}
              icon={GraduationCap}
              color="purple"
              loading={loading}
            />

            <StatCard
              title="Expériences"
              value={stats.experiences.total}
              subtitle={stats.experiences.current > 0 ? `${stats.experiences.current} en cours` : undefined}
              icon={Briefcase}
              color="orange"
              loading={loading}
            />
          </div>

          {/* Actions Rapides */}
          <QuickActions />

          {/* Répartition des compétences par catégorie (si données disponibles) */}
          {!loading && Object.keys(stats.skills.byCategory).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Répartition des Compétences
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.skills.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(count / stats.skills.total) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite : Widgets (1/3) */}
        <div className="space-y-6">
          {/* Widget Complétion Profil */}
          <ProfileCompletionWidget
            completionData={stats.profileCompletion}
            loading={loading}
          />

          {/* Stats supplémentaires */}
          {!loading && stats.profileCompletion && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visibilité
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.profileCompletion.views} vues
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Nombre de fois où votre profil public a été consulté
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}