// pages/admin/SkillsList.jsx (ou où se trouve le composant)
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Star, AlertCircle } from 'lucide-react'
import { skillsAPI } from '@/api'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Button, Card, CardContent, Badge, Spinner, Alert } from '@/components/ui'

export function SkillsList() {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            setLoading(true)
            const data = await skillsAPI.getAll()
            setSkills(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Erreur chargement compétences:', err)
            setSkills([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette compétence ?')) return
        try {
            await skillsAPI.delete(id)
            setSkills(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            console.error('Erreur suppression:', err)
            alert('Impossible de supprimer la compétence. Réessayez.')
        }
    }

    const filteredSkills = useMemo(() => {
        if (!search.trim()) return skills
        const term = search.toLowerCase()
        return skills.filter(s =>
            s.name.toLowerCase().includes(term) ||
            (s.description || '').toLowerCase().includes(term)
        )
    }, [skills, search])

    const groupedSkills = useMemo(() => {
        const groups = {}
        filteredSkills.forEach(skill => {
            const cat = skill.category || 'Autre'
            if (!groups[cat]) groups[cat] = []
            groups[cat].push(skill)
        })
        return groups
    }, [filteredSkills])

    const categoryLabels = {
        'Langage': 'Langages de programmation',
        'Framework': 'Frameworks & Librairies',
        'Outil': 'Outils & Environnements',
        'Soft_Skill': 'Compétences transversales',
        'Autre': 'Autres compétences'
    }

    const levelLabels = {
        'Debutant': 'Débutant',
        'Intermediaire': 'Intermédiaire',
        'Avance': 'Avancé',
        'Expert': 'Expert'
    }

    const levelColors = {
        'Debutant': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        'Intermediaire': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
        'Avance': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
        'Expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
    }

    const getLevelBadge = (level) => {
        const label = levelLabels[level] || level
        const color = levelColors[level] || 'bg-gray-100 text-gray-800'
        return (
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                {label}
            </span>
        )
    }

    const isEmpty = !loading && Object.keys(groupedSkills).length === 0

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes compétences</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1.5">
                        Gérez vos compétences techniques et comportementales
                    </p>
                </div>
                <Link to="/admin/skills/new">
                    <Button variant="primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une compétence
                    </Button>
                </Link>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une compétence..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : isEmpty ? (
                <Card className="bg-gray-50/50 dark:bg-gray-800/30 border-dashed border-2 border-gray-300 dark:border-gray-600">
                    <CardContent className="py-16 text-center">
                        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Aucune compétence enregistrée pour le moment
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Commencez par ajouter vos compétences techniques et soft skills pour enrichir votre portfolio.
                        </p>
                        <Link to="/admin/skills/new">
                            <Button variant="outline" size="lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter ma première compétence
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedSkills).map(([category, items]) => (
                        <Card key={category} className="overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {categoryLabels[category] || category}
                                </h3>
                                <Badge variant="secondary">{items.length}</Badge>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {items.map(skill => (
                                    <div
                                        key={skill.id}
                                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {skill.is_primary && (
                                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mt-1 flex-shrink-0" />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-lg">
                                                    {skill.name}
                                                </div>
                                                {skill.years_of_experience && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                                        {skill.years_of_experience} an{skill.years_of_experience > 1 ? 's' : ''} d'expérience
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 flex-wrap">
                                            {getLevelBadge(skill.level)}

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/skills/${skill.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(skill.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </AdminLayout>
    )
}