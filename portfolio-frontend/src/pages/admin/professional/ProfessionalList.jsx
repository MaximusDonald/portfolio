import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Briefcase, BookOpen, Edit, Trash2, Calendar, MapPin, Building } from 'lucide-react'
import { AdminLayout } from '@/layouts/AdminLayout'
import { experiencesAPI, trainingsAPI } from '@/api'
import { Button, Card, Spinner, Badge } from '@/components/ui'

export function ProfessionalList() {
    const [activeTab, setActiveTab] = useState('experiences') // 'experiences' | 'trainings'

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parcours Professionnel</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez vos expériences et formations complémentaires</p>
                </div>
                <Link to={activeTab === 'experiences' ? "/admin/professional/experiences/new" : "/admin/professional/trainings/new"}>
                    <Button>
                        <Plus className="h-5 w-5 mr-2" />
                        {activeTab === 'experiences' ? 'Nouvelle Expérience' : 'Nouvelle Formation'}
                    </Button>
                </Link>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={`pb-4 px-6 font-medium text-sm transition-colors ${activeTab === 'experiences'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('experiences')}
                >
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Expériences
                    </div>
                </button>
                <button
                    className={`pb-4 px-6 font-medium text-sm transition-colors ${activeTab === 'trainings'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('trainings')}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Formations
                    </div>
                </button>
            </div>

            {activeTab === 'experiences' ? <ExperiencesTab /> : <TrainingsTab />}
        </AdminLayout>
    )
}

function ExperiencesTab() {
    const [experiences, setExperiences] = useState([])
    const [loading, setLoading] = useState(true)

    const formatMonth = (value) => {
        if (!value) return ''
        if (typeof value !== 'string') return String(value)
        const m = value.match(/^(\d{4})-(\d{2})$/)
        if (!m) return value
        return `${m[2]}/${m[1]}`
    }

    useEffect(() => {
        fetchExperiences()
    }, [])

    const fetchExperiences = async () => {
        try {
            setLoading(true)
            const data = await experiencesAPI.getAll()
            setExperiences(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePublish = async (exp) => {
        try {
            setExperiences(experiences.map(e => e.id === exp.id ? { ...e, is_published: !e.is_published } : e))
            await experiencesAPI.togglePublish(exp.id)
        } catch (err) {
            console.error(err)
            fetchExperiences()
        }
    }

    const getPublishBadge = (isPublished) => {
        if (isPublished) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Publié</span>
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Brouillon</span>
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette expérience ?')) return
        try {
            await experiencesAPI.delete(id)
            setExperiences(experiences.filter(e => e.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>

    if (experiences.length === 0) return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg dashed border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Aucune expérience enregistrée</p>
        </div>
    )

    return (
        <div className="space-y-4">
            {experiences.map(exp => (
                <Card key={exp.id} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{exp.position}</h3>
                            <Badge variant="secondary">{exp.experience_type}</Badge>
                            <button
                                onClick={() => handleTogglePublish(exp)}
                                className="ml-2 hover:opacity-90 transition-opacity"
                                title={exp.is_published ? 'Passer en brouillon' : 'Publier'}
                            >
                                {getPublishBadge(exp.is_published)}
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">{exp.company}</span>
                            {exp.location && (
                                <span className="text-gray-400 text-sm flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {exp.location}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatMonth(exp.start_date)} - {exp.is_current ? 'Actuellement' : formatMonth(exp.end_date)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={`/admin/professional/experiences/${exp.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}

function TrainingsTab() {
    const [trainings, setTrainings] = useState([])
    const [loading, setLoading] = useState(true)

    const formatMonth = (value) => {
        if (!value) return ''
        if (typeof value !== 'string') return String(value)
        const m = value.match(/^(\d{4})-(\d{2})$/)
        if (!m) return value
        return `${m[2]}/${m[1]}`
    }

    useEffect(() => {
        fetchTrainings()
    }, [])

    const fetchTrainings = async () => {
        try {
            setLoading(true)
            const data = await trainingsAPI.getAll()
            setTrainings(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePublish = async (training) => {
        try {
            setTrainings(trainings.map(t => t.id === training.id ? { ...t, is_published: !t.is_published } : t))
            await trainingsAPI.togglePublish(training.id)
        } catch (err) {
            console.error(err)
            fetchTrainings()
        }
    }

    const getPublishBadge = (isPublished) => {
        if (isPublished) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Publié</span>
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Brouillon</span>
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette formation ?')) return
        try {
            await trainingsAPI.delete(id)
            setTrainings(trainings.filter(t => t.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>

    if (trainings.length === 0) return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg dashed border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Aucune formation enregistrée</p>
        </div>
    )

    return (
        <div className="space-y-4">
            {trainings.map(training => (
                <Card key={training.id} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{training.title}</h3>
                            <button
                                onClick={() => handleTogglePublish(training)}
                                className="ml-2 hover:opacity-90 transition-opacity"
                                title={training.is_published ? 'Passer en brouillon' : 'Publier'}
                            >
                                {getPublishBadge(training.is_published)}
                            </button>
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">{training.organization}</div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {training.is_ongoing ? `${formatMonth(training.start_date)} - En cours` : `${formatMonth(training.start_date)} - ${formatMonth(training.end_date)}`}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs uppercase">
                                {training.training_type}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={`/admin/professional/trainings/${training.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(training.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}
