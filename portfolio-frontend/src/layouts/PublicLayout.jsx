import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

/**
 * Header du site public
 */
function PublicHeader() {
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/#about', label: 'À propos' },
    { path: '/#projects', label: 'Projets' },
    { path: '/#skills', label: 'Compétences' },
    { path: '/#contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Nom */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || location.hash === link.path.split('#')[1]
              return (
                <a
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Footer du site public
 */
function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 : À propos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Portfolio
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Portfolio professionnel développé avec React et Django.
            </p>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/#about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  À propos
                </a>
              </li>
              <li>
                <a href="/#projects" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Projets
                </a>
              </li>
              <li>
                <a href="/#skills" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Compétences
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Réseaux sociaux */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Me suivre
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Portfolio. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * Layout complet pour les pages publiques
 */
export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}