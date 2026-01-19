import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { FullScreenSpinner } from '@/components/ui'

/**
 * Composant pour protéger les routes nécessitant une authentification
 * Redirige vers /login si non authentifié
 * 
 * @example
 * <Route 
 *   path="/admin" 
 *   element={
 *     <ProtectedRoute>
 *       <AdminDashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Afficher un loader pendant la vérification de l'auth
  if (isLoading) {
    return <FullScreenSpinner message="Vérification..." />
  }

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    // Sauvegarder l'URL demandée pour rediriger après login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si authentifié, afficher le contenu
  return children
}