import { useState } from 'react'
import { ExternalLink, Github, Video, FileText } from 'lucide-react'
import { Card, CardContent, Badge } from '@/components/ui'

/**
 * Card d'un projet
 */
function ProjectCard({ project }) {
  const coverUrl = project.cover_image 
    ? `${import.meta.env.VITE_MEDIA_BASE_URL}${project.cover_image}` 
    : null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image de couverture */}
      {coverUrl && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={coverUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h3>
            {project.is_featured && (
              <Badge variant="warning" className="mb-2">
                ⭐ Projet mis en avant
              </Badge>
            )}
          </div>
        </div>

        {/* Description courte */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.short_description}
        </p>

        {/* Technologies */}
        {project.technologies_list && project.technologies_list.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies_list.slice(0, 5).map((tech, index) => (
              <Badge key={index} variant="default">
                {tech}
              </Badge>
            ))}
            {project.technologies_list.length > 5 && (
              <Badge variant="default">
                +{project.technologies_list.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Période */}
        {project.duration_display && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            📅 {project.duration_display}
          </p>
        )}

        {/* Liens */}
        <div className="flex flex-wrap gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <ExternalLink className="h-4 w-4" />
              Démo
            </a>
          )}
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Video className="h-4 w-4" />
              Vidéo
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Section Projets publics
 */
export function ProjectsSection({ projects, isLoading }) {
  const [filter, setFilter] = useState('all') // all | featured

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Mes Projets
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
                <div className="bg-gray-100 dark:bg-gray-800 h-40 rounded-b-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mes Projets
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Aucun projet public pour le moment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const filteredProjects = filter === 'featured' 
    ? projects.filter(p => p.is_featured) 
    : projects

  const featuredCount = projects.filter(p => p.is_featured).length

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-800">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mes Projets
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez une sélection de mes réalisations professionnelles et personnelles
          </p>
        </div>

        {/* Filtres */}
        {featuredCount > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tous ({projects.length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'featured'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              ⭐ Mis en avant ({featuredCount})
            </button>
          </div>
        )}

        {/* Grille de projets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Message si filtre vide */}
        {filteredProjects.length === 0 && filter === 'featured' && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Aucun projet mis en avant.
          </p>
        )}
      </div>
    </section>
  )
}