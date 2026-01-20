import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * Section Hero - Présentation principale
 * Affiche le profil, la photo, le titre professionnel et les CTA
 */
export function HeroSection({ profile }) {
  if (!profile) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="animate-pulse space-y-4">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  const displayName = profile.user_full_name || 'Portfolio'
  const photoUrl = profile.photo ? `${import.meta.env.VITE_MEDIA_BASE_URL}${profile.photo}` : null

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Décoration de fond */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container-custom relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contenu texte */}
          <div className="space-y-6">
            {/* Badge de disponibilité */}
            {profile.availability && profile.availability !== 'non_disponible' && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {profile.availability.replace('disponible_', 'Disponible pour ').replace('_', ' ')}
              </div>
            )}

            {/* Titre principal */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {displayName}
              </h1>
              {profile.professional_title && (
                <p className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-medium">
                  {profile.professional_title}
                </p>
              )}
            </div>

            {/* Tagline */}
            {profile.tagline && (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profile.tagline}
              </p>
            )}

            {/* Bio courte */}
            {profile.bio && (
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {profile.bio.substring(0, 200)}
                {profile.bio.length > 200 && '...'}
              </p>
            )}

            {/* Localisation */}
            {profile.location && profile.show_location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location}
              </p>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Me contacter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Voir mes projets
              </Button>
            </div>

            {/* Liens sociaux */}
            <div className="flex gap-4 pt-4">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profile.show_email && profile.display_email && (
                <a
                  href={`mailto:${profile.display_email}`}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Photo de profil */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              {/* Décoration de fond */}
              <div className="absolute inset-0 bg-primary-600 dark:bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
              
              {/* Photo */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-2xl">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}