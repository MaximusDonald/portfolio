import { useState, useRef } from 'react'
import { Upload, X, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'

/**
 * Composant d'upload de photo de profil
 * Support : drag & drop, click to browse, preview, suppression
 * 
 * @param {string} currentPhoto - URL de la photo actuelle
 * @param {Function} onUpload - Callback(file) pour uploader
 * @param {Function} onDelete - Callback pour supprimer
 * @param {boolean} uploading - État de chargement
 */
export function PhotoUpload({ currentPhoto, onUpload, onDelete, uploading = false }) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  
  const photoUrl = currentPhoto ? `${currentPhoto}` : null

  // Validation du fichier
  const validateFile = (file) => {
    setError('')

    // Vérifier le type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Format non autorisé. Utilisez JPG, PNG ou WEBP.')
      return false
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('La photo ne doit pas dépasser 5 MB.')
      return false
    }

    return true
  }

  // Gestion de la sélection de fichier
  const handleFileSelect = (file) => {
    if (!file) return

    if (!validateFile(file)) {
      return
    }

    // Créer un preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Appeler le callback d'upload
    onUpload(file)
  }

  // Drag & Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Click to browse
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Suppression
  const handleDelete = () => {
    setPreview(null)
    setError('')
    onDelete()
  }

  // Afficher soit : preview temporaire, photo actuelle, ou placeholder
  const displayPhoto = preview || photoUrl

  return (
    <div className="space-y-4">
      {/* Zone de preview/upload */}
      <div className="flex flex-col items-center">
        {/* Photo actuelle ou placeholder */}
        <div className="relative">
          <div
            className={cn(
              'w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-200',
              displayPhoto 
                ? 'border-primary-600 dark:border-primary-400' 
                : 'border-gray-300 dark:border-gray-600'
            )}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400 dark:text-gray-600" />
              </div>
            )}
          </div>

          {/* Loader pendant upload */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {displayPhoto ? 'Changer' : 'Uploader'}
          </Button>

          {displayPhoto && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Zone drag & drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-600 dark:hover:border-primary-400'
        )}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-primary-600 dark:text-primary-400">
            Cliquez pour parcourir
          </span>{' '}
          ou glissez-déposez
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          JPG, PNG ou WEBP (max. 5MB)
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}