import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { CertificationForm } from '@/components/admin/education/CertificationForm'
import { certificationsAPI } from '@/api'
import { FullScreenSpinner, Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'

export function CertificationEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [certification, setCertification] = useState(null)
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEditing) {
            fetchCertification()
        }
    }, [id])

    const fetchCertification = async () => {
        try {
            setLoading(true)
            const data = await certificationsAPI.getById(id)
            setCertification(data)
        } catch (err) {
            console.error(err)
            navigate('/admin/education')
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
                await certificationsAPI.update(id, formData)
            } else {
                const res = await certificationsAPI.create(formData)
                savedId = res.id
            }

            // Si c'est une création, on redirige pour permettre l'upload de preuves
            if (!isEditing && savedId) {
                navigate(`/admin/education/certifications/${savedId}/edit`, { replace: true })
            } else {
                navigate('/admin/education')
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
                <Button variant="ghost" onClick={() => navigate('/admin/education')} className="mb-4 pl-0">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Modifier la certification' : 'Nouvelle certification'}
                </h1>
            </div>
            <CertificationForm certification={certification} onSave={handleSave} saving={saving} errors={errors} />
        </AdminLayout>
    )
}
