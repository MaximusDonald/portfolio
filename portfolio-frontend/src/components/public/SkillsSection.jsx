import { Badge } from '@/components/ui'

/**
 * Affichage d'une compétence
 */
function SkillItem({ skill }) {
  const levelColors = {
    'Debutant': 'info',
    'Intermediaire': 'default',
    'Avance': 'warning',
    'Expert': 'success',
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {skill.name}
        </h4>
        {skill.years_of_experience && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {skill.years_of_experience} {skill.years_of_experience > 1 ? 'ans' : 'an'} d'expérience
          </p>
        )}
      </div>
      <Badge variant={levelColors[skill.level] || 'default'}>
        {skill.level.replace('Intermediaire', 'Intermédiaire')}
      </Badge>
    </div>
  )
}

/**
 * Section Compétences groupées par catégorie
 */
export function SkillsSection({ skillsGrouped, isLoading }) {
  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Compétences
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="space-y-2">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!skillsGrouped || skillsGrouped.length === 0) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Compétences
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Aucune compétence publique pour le moment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compétences
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technologies, frameworks et outils que je maîtrise
          </p>
        </div>

        {/* Grille par catégorie */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsGrouped.map((group) => (
            <div key={group.category}>
              {/* Titre de la catégorie */}
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {group.category_display}
                </h3>
                <Badge variant="default">{group.count}</Badge>
              </div>

              {/* Liste des compétences */}
              <div className="space-y-2">
                {group.skills.map((skill) => (
                  <SkillItem key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}