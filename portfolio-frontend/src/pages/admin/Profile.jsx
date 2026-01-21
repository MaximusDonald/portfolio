import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Eye } from 'lucide-react'
import { profileAPI } from '@/api'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PhotoUpload } from '@/components/admin/PhotoUpload'
import { ProfileForm } from '@/components/admin/ProfileForm'
import { FullScreenSpinner, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

/**
 * Page de gestion du profil utilisateur
 */
export function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  // Charger le profil au montage
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await profileAPI.getMyProfile()
      setProfile(data)
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err)
      setError('Impossible de charger le profil')
    } finally {
      setLoading(false)
    }
  }

  // Sauvegarde du formulaire
  const handleSave = async (formData) => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage('')

      const updatedProfile = await profileAPI.updateMyProfile(formData)
      setProfile(updatedProfile)
      
      setSuccessMessage('Profil mis à jour avec succès !')
      
      // Masquer le message après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  // Upload de photo
  const handlePhotoUpload = async (file) => {
    try {
      setUploading(true)
      setError(null)
      setSuccessMessage('')

      const response = await profileAPI.uploadPhoto(file)
      
      // Recharger le profil pour avoir la nouvelle URL
      await fetchProfile()
      
      setSuccessMessage('Photo mise à jour avec succès !')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err)
      setError(err.response?.data?.error || 'Erreur lors de l\'upload de la photo')
    } finally {
      setUploading(false)
    }
  }

  // Suppression de photo
  const handlePhotoDelete = async () => {
    if (!confirm('Supprimer votre photo de profil ?')) return

    try {
      setUploading(true)
      setError(null)
      setSuccessMessage('')

      await profileAPI.deletePhoto()
      
      // Recharger le profil
      await fetchProfile()
      
      setSuccessMessage('Photo supprimée avec succès !')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      setError(err.response?.data?.error || 'Erreur lors de la suppression')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <FullScreenSpinner message="Chargement du profil..." />
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez vos informations personnelles et votre visibilité publique
        </p>
      </div>

      {/* Messages de feedback */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-300">
            {successMessage}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Stats du profil */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Complétion */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {profile?.is_profile_complete ? (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Statut du profil
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile?.is_profile_complete ? 'Complet' : 'Incomplet'}
                </p>
              </div>
            </div>

            {/* Vues */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vues du profil
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile?.profile_views || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo de profil */}
      <Card>
        <CardHeader>
          <CardTitle>Photo de Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            currentPhoto={profile?.photo}
            onUpload={handlePhotoUpload}
            onDelete={handlePhotoDelete}
            uploading={uploading}
          />
        </CardContent>
      </Card>

      {/* Formulaire d'édition */}
      <ProfileForm
        profile={profile}
        onSave={handleSave}
        saving={saving}
      />
    </AdminLayout>
  )
}