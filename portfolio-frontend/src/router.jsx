import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'

// Pages auth
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'

// Pages publiques
import { Home } from './pages/public/Home'

// Pages admin (placeholder)
function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interface d'administration (à développer dans les prochaines étapes)
        </p>
      </div>
    </div>
  )
}

/**
 * Configuration des routes de l'application
 */
export const router = createBrowserRouter([
  // ========== ROUTES PUBLIQUES ==========
  {
    path: '/',
    element: <Home />,
  },
  
  // ========== ROUTES D'AUTHENTIFICATION ==========
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

  // ========== ROUTES PROTÉGÉES (ADMIN) ==========
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Navigate to="/admin/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  // ========== 404 ==========
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Page non trouvée</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    ),
  },
])