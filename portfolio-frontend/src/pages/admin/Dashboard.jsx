import { 
  FolderKanban, 
  Award, 
  GraduationCap, 
  Briefcase,
  Eye,
  RefreshCw
} from 'lucide-react'
import { useState } from 'react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { StatCard } from '@/components/admin/StatCard'
import { ProfileCompletionWidget } from '@/components/admin/ProfileCompletionWidget'
import { AdminLayout } from '@/layouts/AdminLayout'
import { QuickActions } from '@/components/admin/QuickActions'
import { PortfolioPreviewDialog } from '@/components/admin/PortfolioPreviewDialog'
import { Button, Alert } from '@/components/ui'  // Assure-toi d'avoir Alert

/**
 * Page Dashboard - Vue d'ensemble de l'espace admin
 */
export function Dashboard() {
  const { stats, loading, error, partialErrors, refresh } = useDashboardStats()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const hasPartialErrors = Object.keys(partialErrors).length > 0

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>

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
      </div>

      <PortfolioPreviewDialog isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />

      {/* Erreurs globales + partielles */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          {error}
        </Alert>
      )}
      {hasPartialErrors && (
        <Alert variant="warning" className="mt-4">
          Erreurs partielles : {Object.values(partialErrors).join(', ')}
        </Alert>
      )}

      {/* Grille principale : Stats + Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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

          {/* Répartition des compétences par catégorie */}
          {!loading && Object.keys(stats.skills.byCategory).length > 0 ? (
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
          ) : !loading && stats.skills.total === 0 ? (
            <Alert variant="info">
              Aucune compétence ajoutée. Commencez par en ajouter pour voir la répartition !
            </Alert>
          ) : null}
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