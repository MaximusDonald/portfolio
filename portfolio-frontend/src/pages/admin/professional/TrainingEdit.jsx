import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { TrainingForm } from '@/components/admin/professional/TrainingForm'
import { trainingsAPI } from '@/api'
import { FullScreenSpinner, Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'

export function TrainingEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [training, setTraining] = useState(null)
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEditing) {
            fetchTraining()
        }
    }, [id])

    const fetchTraining = async () => {
        try {
            setLoading(true)
            const data = await trainingsAPI.getById(id)
            setTraining(data)
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
                await trainingsAPI.update(id, formData)
            } else {
                const res = await trainingsAPI.create(formData)
                savedId = res.id
            }

            if (!isEditing && savedId) {
                navigate(`/admin/professional/trainings/${savedId}/edit`, { replace: true })
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
                    {isEditing ? 'Modifier la formation' : 'Nouvelle formation'}
                </h1>
            </div>
            <TrainingForm training={training} onSave={handleSave} saving={saving} errors={errors} />
        </AdminLayout>
    )
}
