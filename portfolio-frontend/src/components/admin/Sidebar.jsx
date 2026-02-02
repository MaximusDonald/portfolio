import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  GraduationCap, 
  Briefcase, 
  BookOpen,
  User,
  Settings,
  X,
  Link2
} from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Sidebar de navigation pour l'espace admin
 * 
 * @param {boolean} isOpen - État d'ouverture (mobile)
 * @param {Function} onClose - Callback de fermeture (mobile)
 */
export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Mon Profil',
      href: '/admin/profile',
      icon: User,
    },
    {
      name: 'Projets',
      href: '/admin/projects',
      icon: FolderKanban,
    },
    {
      name: 'Compétences',
      href: '/admin/skills',
      icon: Award,
    },
    {
      name: 'Education',
      href: '/admin/education',
      icon: GraduationCap,
    },
    {
      name: 'Professionel',
      href: '/admin/professional',
      icon: Briefcase,
    },
    {
      name: 'Liens Recruteur',
      href: '/admin/recruiter-access',
      icon: Link2,
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Admin
              </span>
            </Link>

            {/* Bouton fermer (mobile uniquement) */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <span>← Retour au portfolio public</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}