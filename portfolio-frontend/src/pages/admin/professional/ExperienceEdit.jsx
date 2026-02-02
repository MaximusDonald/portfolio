import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ExperienceForm } from '@/components/admin/professional/ExperienceForm'
import { experiencesAPI } from '@/api'
import { FullScreenSpinner, Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'

export function ExperienceEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [experience, setExperience] = useState(null)
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEditing) {
            fetchExperience()
        }
    }, [id])

    const fetchExperience = async () => {
        try {
            setLoading(true)
            const data = await experiencesAPI.getById(id)
            setExperience(data)
        } catch (err) {
            console.error(err)
            navigate('/admin/professional')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (formData) => {
        try {
            setSaving(true)
            setErrors({})
            let savedId = id

            if (isEditing) {
                await experiencesAPI.update(id, formData)
            } else {
                const res = await experiencesAPI.create(formData)
                savedId = res.id
            }

            if (!isEditing && savedId) {
                navigate(`/admin/professional/experiences/${savedId}/edit`, { replace: true })
            } else {
                navigate('/admin/professional')
            }
        } catch (err) {
            console.error(err)
            if (err.response?.data) setErrors(err.response.data)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <FullScreenSpinner />

    return (
        <AdminLayout>
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/admin/professional')} className="mb-4 pl-0">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
                </h1>
            </div>
            <ExperienceForm experience={experience} onSave={handleSave} saving={saving} errors={errors} />
        </AdminLayout>
    )
}
