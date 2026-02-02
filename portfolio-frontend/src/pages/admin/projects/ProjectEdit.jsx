import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProjectForm } from '@/components/admin/projects/ProjectForm'
import { projectsAPI } from '@/api'
import { FullScreenSpinner, Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'

export function ProjectEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEditing) {
            fetchProject()
        }
    }, [id])

    const fetchProject = async () => {
        try {
            setLoading(true)
            const data = await projectsAPI.getById(id)
            setProject(data)
        } catch (err) {
            console.error('Erreur chargement projet:', err)
            navigate('/admin/projects')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (formData) => {
        try {
            setSaving(true)
            setErrors({})

            if (isEditing) {
                await projectsAPI.update(id, formData)
            } else {
                await projectsAPI.create(formData)
            }

            navigate('/admin/projects')
        } catch (err) {
            console.error('Erreur sauvegarde:', err)
            if (err.response?.status === 400 && err.response?.data) {
                setErrors(err.response.data)
            } else {
                alert('Erreur lors de la sauvegarde')
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <FullScreenSpinner />

    return (
        <AdminLayout>
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/admin/projects')}
                    className="mb-4 pl-0 hover:bg-transparent hover:text-primary-600"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la liste
                </Button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Modifier le projet' : 'Nouveau projet'}
                </h1>
            </div>

            <ProjectForm
                project={project}
                onSave={handleSave}
                saving={saving}
                errors={errors}
            />
        </AdminLayout>
    )
}
