import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { SkillForm } from '@/components/admin/skills/SkillForm'
import { skillsAPI } from '@/api'
import { FullScreenSpinner, Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'

export function SkillEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [skill, setSkill] = useState(null)
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEditing) {
            fetchSkill()
        }
    }, [id])

    const fetchSkill = async () => {
        try {
            setLoading(true)
            const data = await skillsAPI.getById(id)
            setSkill(data)
        } catch (err) {
            console.error('Erreur chargement compétence:', err)
            navigate('/admin/skills')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (formData) => {
        try {
            setSaving(true)
            setErrors({})

            if (isEditing) {
                await skillsAPI.update(id, formData)
            } else {
                await skillsAPI.create(formData)
            }

            navigate('/admin/skills')
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
                    onClick={() => navigate('/admin/skills')}
                    className="mb-4 pl-0 hover:bg-transparent hover:text-primary-600"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la liste
                </Button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Modifier la compétence' : 'Nouvelle compétence'}
                </h1>
            </div>

            <div className="max-w-2xl">
                <SkillForm
                    skill={skill}
                    onSave={handleSave}
                    saving={saving}
                    errors={errors}
                />
            </div>
        </AdminLayout>
    )
}
