import { Mail, MapPin, Phone, Github, Linkedin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'

/**
 * Section Contact
 */
export function ContactSection({ profile }) {
  if (!profile) return null

  const contactMethods = []

  // Email
  if (profile.show_email && profile.display_email) {
    contactMethods.push({
      icon: Mail,
      label: 'Email',
      value: profile.display_email,
      href: `mailto:${profile.display_email}`,
    })
  }

  // Téléphone
  if (profile.show_phone && profile.phone) {
    contactMethods.push({
      icon: Phone,
      label: 'Téléphone',
      value: profile.phone,
      href: `tel:${profile.phone}`,
    })
  }

  // Localisation
  if (profile.show_location && profile.location) {
    contactMethods.push({
      icon: MapPin,
      label: 'Localisation',
      value: profile.location,
      href: null,
    })
  }

  const socialLinks = []

  if (profile.github_url) {
    socialLinks.push({
      icon: Github,
      label: 'GitHub',
      href: profile.github_url,
    })
  }

  if (profile.linkedin_url) {
    socialLinks.push({
      icon: Linkedin,
      label: 'LinkedIn',
      href: profile.linkedin_url,
    })
  }

  if (profile.website_url) {
    socialLinks.push({
      icon: ExternalLink,
      label: 'Site Web',
      href: profile.website_url,
    })
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-800">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Me Contacter
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Vous avez un projet en tête ? N'hésitez pas à me contacter !
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Coordonnées */}
            {contactMethods.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Coordonnées
                  </h3>
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => {
                      const Icon = method.icon
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                            <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {method.label}
                            </p>
                            {method.href ? (
                              <a
                                href={method.href}
                                className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                {method.value}
                              </a>
                            ) : (
                              <p className="text-gray-900 dark:text-white">
                                {method.value}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Réseaux sociaux */}
            {socialLinks.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Réseaux Sociaux
                  </h3>
                  <div className="space-y-4">
                    {socialLinks.map((link, index) => {
                      const Icon = link.icon
                      return (
                        <a
                          key={index}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                            <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                          </div>
                          <span className="flex-1 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {link.label}
                          </span>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                        </a>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Disponibilité */}
          {profile.availability && profile.availability !== 'non_disponible' && (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
              <p className="text-green-800 dark:text-green-300 font-medium">
                ✓ {profile.availability.replace('disponible_', 'Disponible pour ').replace('_', ' ')}
              </p>
              {profile.availability_date && (
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  À partir du {new Date(profile.availability_date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}