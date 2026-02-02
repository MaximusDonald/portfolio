import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, GraduationCap, Award, Edit, Trash2, Calendar, MapPin, ExternalLink } from 'lucide-react'
import { AdminLayout } from '@/layouts/AdminLayout'
import { diplomasAPI, certificationsAPI } from '@/api'
import { Button, Card, Spinner, Badge } from '@/components/ui'

export function EducationList() {
    const [activeTab, setActiveTab] = useState('diplomas') // 'diplomas' | 'certifications'

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Éducation & Certifications</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez votre parcours académique et vos certifications</p>
                </div>
                <Link to={activeTab === 'diplomas' ? "/admin/education/diplomas/new" : "/admin/education/certifications/new"}>
                    <Button>
                        <Plus className="h-5 w-5 mr-2" />
                        {activeTab === 'diplomas' ? 'Nouveau Diplôme' : 'Nouvelle Certification'}
                    </Button>
                </Link>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={`pb-4 px-6 font-medium text-sm transition-colors ${activeTab === 'diplomas'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('diplomas')}
                >
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Diplômes
                    </div>
                </button>
                <button
                    className={`pb-4 px-6 font-medium text-sm transition-colors ${activeTab === 'certifications'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('certifications')}
                >
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certifications
                    </div>
                </button>
            </div>

            {activeTab === 'diplomas' ? <DiplomasTab /> : <CertificationsTab />}
        </AdminLayout>
    )
}

function DiplomasTab() {
    const [diplomas, setDiplomas] = useState([])
    const [loading, setLoading] = useState(true)

    const formatMonth = (value) => {
        if (!value) return ''
        if (typeof value !== 'string') return String(value)
        const m = value.match(/^(\d{4})-(\d{2})$/)
        if (!m) return value
        return `${m[2]}/${m[1]}`
    }

    useEffect(() => {
        fetchDiplomas()
    }, [])

    const fetchDiplomas = async () => {
        try {
            setLoading(true)
            const data = await diplomasAPI.getAll()
            setDiplomas(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePublish = async (diploma) => {
        try {
            setDiplomas(diplomas.map(d => d.id === diploma.id ? { ...d, is_published: !d.is_published } : d))
            await diplomasAPI.togglePublish(diploma.id)
        } catch (err) {
            console.error(err)
            fetchDiplomas()
        }
    }

    const getPublishBadge = (isPublished) => {
        if (isPublished) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Publié</span>
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Brouillon</span>
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce diplôme ?')) return
        try {
            await diplomasAPI.delete(id)
            setDiplomas(diplomas.filter(d => d.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>

    if (diplomas.length === 0) return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg dashed border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Aucun diplôme enregistré</p>
        </div>
    )

    return (
        <div className="space-y-4">
            {diplomas.map(diploma => (
                <Card key={diploma.id} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{diploma.title}</h3>
                            <Badge variant="secondary">{diploma.level}</Badge>
                            <button
                                onClick={() => handleTogglePublish(diploma)}
                                className="ml-2 hover:opacity-90 transition-opacity"
                                title={diploma.is_published ? 'Passer en brouillon' : 'Publier'}
                            >
                                {getPublishBadge(diploma.is_published)}
                            </button>
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">{diploma.institution}</div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatMonth(diploma.start_date)}{diploma.end_date ? ` - ${formatMonth(diploma.end_date)}` : ''}
                            </span>
                            {diploma.honors && (
                                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded text-xs">
                                    Mention: {diploma.honors}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={`/admin/education/diplomas/${diploma.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(diploma.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}

function CertificationsTab() {
    const [certifications, setCertifications] = useState([])
    const [loading, setLoading] = useState(true)

    const formatDate = (value) => {
        if (!value) return ''
        return value
    }

    useEffect(() => {
        fetchCertifications()
    }, [])

    const fetchCertifications = async () => {
        try {
            setLoading(true)
            const data = await certificationsAPI.getAll()
            setCertifications(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePublish = async (cert) => {
        try {
            setCertifications(certifications.map(c => c.id === cert.id ? { ...c, is_published: !c.is_published } : c))
            await certificationsAPI.togglePublish(cert.id)
        } catch (err) {
            console.error(err)
            fetchCertifications()
        }
    }

    const getPublishBadge = (isPublished) => {
        if (isPublished) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Publié</span>
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Brouillon</span>
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette certification ?')) return
        try {
            await certificationsAPI.delete(id)
            setCertifications(certifications.filter(c => c.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>

    if (certifications.length === 0) return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg dashed border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">Aucune certification enregistrée</p>
        </div>
    )

    return (
        <div className="space-y-4">
            {certifications.map(cert => (
                <Card key={cert.id} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{cert.name}</h3>
                            <button
                                onClick={() => handleTogglePublish(cert)}
                                className="ml-2 hover:opacity-90 transition-opacity"
                                title={cert.is_published ? 'Passer en brouillon' : 'Publier'}
                            >
                                {getPublishBadge(cert.is_published)}
                            </button>
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">{cert.organization}</div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(cert.issue_date)}
                                {cert.expiration_date && ` → ${formatDate(cert.expiration_date)}`}
                            </span>
                            <Badge variant="outline" className="text-xs">{cert.status}</Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={`/admin/education/certifications/${cert.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}
