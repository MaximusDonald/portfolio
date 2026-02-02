import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Star, GripVertical, ExternalLink } from 'lucide-react'
import { projectsAPI } from '@/api'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Button, Input, Card, CardContent, Badge, Spinner } from '@/components/ui'

/**
 * Page de liste des projets
 */
export function ProjectsList() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const data = await projectsAPI.getAll()

            setProjects(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Erreur chargement projets:', err)
            setProjects([])
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePublish = async (project) => {
        try {
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, is_published: !p.is_published } : p
            ))
            await projectsAPI.togglePublish(project.id)
        } catch (err) {
            console.error('Erreur toggle publish:', err)
            fetchProjects()
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return

        try {
            await projectsAPI.delete(id)
            setProjects(projects.filter(p => p.id !== id))
        } catch (err) {
            console.error('Erreur suppression:', err)
            alert('Erreur lors de la suppression')
        }
    }

    const handleToggleFeatured = async (project) => {
        try {
            // Optimistic update
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, is_featured: !p.is_featured } : p
            ))
            await projectsAPI.toggleFeatured(project.id)
        } catch (err) {
            console.error('Erreur toggle featured:', err)
            fetchProjects() // Revert on error
        }
    }

    // Filtrage
    const filteredProjects = useMemo(() => {
        if (!Array.isArray(projects)) return []

        return projects.filter(p => {
            const title = p.title || ''
            const techs = Array.isArray(p.technologies) ? p.technologies.join(' ') : (p.technologies || '')
            return title.toLowerCase().includes(search.toLowerCase()) ||
                techs.toLowerCase().includes(search.toLowerCase())
        })
    }, [projects, search])


    const getStatusBadge = (status) => {
        const styles = {
            'en_cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'termine': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'archive': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles['en_cours']}`}>
                {status === 'en_cours' ? 'En cours' : status === 'termine' ? 'Terminé' : 'Archivé'}
            </span>
        )
    }

    const getPublishBadge = (isPublished) => {
        if (isPublished) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Publié</span>
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Brouillon</span>
    }

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projets</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Gérez votre portfolio de projets
                    </p>
                </div>
                <Link to="/admin/projects/new">
                    <Button>
                        <Plus className="h-5 w-5 mr-2" />
                        Nouveau Projet
                    </Button>
                </Link>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un projet..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                    </div>
                </div>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center">
                            <Spinner className="mx-auto h-8 w-8 text-primary-600" />
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            Aucun projet trouvé
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-6 py-3 w-10"></th>
                                        <th className="px-6 py-3">Projet</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3">Publication</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3 text-center">En avant</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400">
                                                <GripVertical className="h-4 w-4 cursor-move" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {project.cover_image ? (
                                                        <img
                                                            src={project.cover_image}
                                                            alt={project.title}
                                                            className="h-10 w-16 object-cover rounded shadow-sm bg-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                                                            No img
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {project.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                            {project.short_description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(project.status)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleTogglePublish(project)}
                                                    className="hover:opacity-90 transition-opacity"
                                                    title={project.is_published ? 'Passer en brouillon' : 'Publier'}
                                                >
                                                    {getPublishBadge(project.is_published)}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="capitalize">{project.project_type?.replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleFeatured(project)}
                                                    className={`p-1 rounded-full transition-colors ${project.is_featured
                                                        ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
                                                        : 'text-gray-300 hover:text-yellow-400'
                                                        }`}
                                                >
                                                    <Star className={`h-5 w-5 ${project.is_featured ? 'fill-current' : ''}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {project.demo_url && (
                                                        <a
                                                            href={project.demo_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                                                            title="Voir la démo"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    <Link
                                                        to={`/admin/projects/${project.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    )
}
