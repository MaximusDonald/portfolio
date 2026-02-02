import { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { X, Link, Calendar, FileText, Sparkles } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'  // Assume importé

export function RecruiterLinkDialog({ isOpen, onClose, onSave, saving = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_hours: 72
  })
  const [errors, setErrors] = useState({})  // ← Nouveau : pour erreurs DRF

  // Reset form + errors quand opening
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        duration_hours: 72
      })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const newErr = { ...prev }; delete newErr[name]; return newErr })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    onSave(formData, setErrors)  // ← Passe setErrors pour gérer dans parent
  }

  // Fermer sur clic overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Fermer sur Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const durationOptions = [
    { value: 24, label: '24 heures', sublabel: '1 jour' },
    { value: 48, label: '48 heures', sublabel: '2 jours' },
    { value: 72, label: '72 heures', sublabel: '3 jours' },
    { value: 168, label: '1 semaine', sublabel: '7 jours' },
    { value: 720, label: '1 mois', sublabel: '30 jours' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-200/50 dark:border-gray-700/50">
        {/* Header avec gradient */}
        <div className="relative p-6 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-lg shadow-primary-500/25">
              <Link className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Nouveau lien recruteur
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Partagez votre portfolio en toute sécurité
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Erreurs globales */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              {errors.non_field_errors?.join(', ') || 'Erreur de validation.'}
              {Object.entries(errors).map(([key, val]) => key !== 'non_field_errors' && `${key}: ${Array.isArray(val) ? val.join(', ') : val}`).filter(Boolean).join(', ')}
            </Alert>
          )}

          {/* Nom du lien */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Sparkles className="h-4 w-4 text-primary-500" />
              Nom du lien <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Candidature Google, Entretien Capgemini..."
              required
              autoFocus
              className="transition-all focus:ring-2 focus:ring-primary-500/20"
              error={errors.name?.join(', ')}
            />
            <p className="text-xs text-gray-400">
              Donnez un nom descriptif pour identifier ce lien
            </p>
          </div>

          {/* Durée de validité */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-primary-500" />
              Durée de validité
            </label>
            <div className="grid grid-cols-5 gap-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, duration_hours: option.value }))}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${formData.duration_hours === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md shadow-primary-500/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <span className={`block text-sm font-semibold ${formData.duration_hours === option.value
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {option.sublabel}
                  </span>
                </button>
              ))}
            </div>
            {errors.duration_hours && <p className="text-xs text-red-500 mt-1">{errors.duration_hours.join(', ')}</p>}
          </div>

          {/* Note / Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4 text-primary-500" />
              Note interne <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Ajoutez des notes pour vous souvenir du contexte..."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none text-gray-700 dark:text-gray-300 placeholder:text-gray-400"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.join(', ')}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={saving}
              className="px-5"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={saving}
              disabled={saving || !formData.name.trim()}
              className="px-6 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-lg shadow-primary-500/25"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Générer le lien
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}