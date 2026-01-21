import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Save } from 'lucide-react'

/**
 * Formulaire d'édition du profil
 * 
 * @param {Object} profile - Profil actuel
 * @param {Function} onSave - Callback(formData) pour sauvegarder
 * @param {boolean} saving - État de sauvegarde
 */
export function ProfileForm({ profile, onSave, saving = false }) {
  const [formData, setFormData] = useState({
    professional_title: '',
    bio: '',
    tagline: '',
    professional_email: '',
    phone: '',
    location: '',
    website_url: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    availability: 'non_disponible',
    availability_date: '',
    show_email: true,
    show_phone: false,
    show_location: true,
  })

  // Initialiser le formulaire avec les données du profil
  useEffect(() => {
    if (profile) {
      setFormData({
        professional_title: profile.professional_title || '',
        bio: profile.bio || '',
        tagline: profile.tagline || '',
        professional_email: profile.professional_email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        availability: profile.availability || 'non_disponible',
        availability_date: profile.availability_date || '',
        show_email: profile.show_email ?? true,
        show_phone: profile.show_phone ?? false,
        show_location: profile.show_location ?? true,
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Titre professionnel"
            name="professional_title"
            value={formData.professional_title}
            onChange={handleChange}
            placeholder="Ex: Développeur Full-Stack"
            helperText="Affiché en haut de votre profil public"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Biographie
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Présentez-vous en quelques lignes..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Décrivez votre parcours, vos compétences et vos objectifs
            </p>
          </div>

          <Input
            label="Phrase d'accroche"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Ex: Passionné par le développement web..."
            maxLength={150}
            helperText={`${formData.tagline.length}/150 caractères`}
          />
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Email professionnel"
            name="professional_email"
            type="email"
            value={formData.professional_email}
            onChange={handleChange}
            placeholder="contact@example.com"
            helperText="Peut être différent de votre email de connexion"
          />

          <Input
            label="Téléphone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+33 6 12 34 56 78"
          />

          <Input
            label="Localisation"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ex: Paris, France"
          />
        </CardContent>
      </Card>

      {/* Liens externes */}
      <Card>
        <CardHeader>
          <CardTitle>Liens Externes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Site web personnel"
            name="website_url"
            type="url"
            value={formData.website_url}
            onChange={handleChange}
            placeholder="https://exemple.com"
          />

          <Input
            label="GitHub"
            name="github_url"
            type="url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />

          <Input
            label="LinkedIn"
            name="linkedin_url"
            type="url"
            value={formData.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />

          <Input
            label="Twitter / X"
            name="twitter_url"
            type="url"
            value={formData.twitter_url}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
          />
        </CardContent>
      </Card>

      {/* Disponibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="non_disponible">Non disponible actuellement</option>
              <option value="disponible_stage">Disponible pour un stage</option>
              <option value="disponible_emploi">Disponible pour un emploi</option>
              <option value="disponible_freelance">Disponible en freelance</option>
              <option value="disponible_projet">Disponible pour des projets</option>
            </select>
          </div>

          {formData.availability !== 'non_disponible' && (
            <Input
              label="Date de disponibilité"
              name="availability_date"
              type="date"
              value={formData.availability_date}
              onChange={handleChange}
              helperText="À partir de quand êtes-vous disponible ?"
            />
          )}
        </CardContent>
      </Card>

      {/* Paramètres de visibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Visibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="show_email"
              checked={formData.show_email}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Afficher mon email sur le profil public
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="show_phone"
              checked={formData.show_phone}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Afficher mon téléphone sur le profil public
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="show_location"
              checked={formData.show_location}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Afficher ma localisation sur le profil public
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={saving}
          disabled={saving}
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  )
}