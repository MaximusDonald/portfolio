import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Save } from 'lucide-react'
import { ProofManager } from '@/components/admin/proofs/ProofManager'

export function DiplomaForm({ diploma, onSave, saving = false, errors: initialErrors = {} }) {
    const [formData, setFormData] = useState({
        title: '',
        institution: '',
        level: 'Master',
        field: '',
        start_date: '',
        end_date: '',
        honors: '',
        grade: '',
        description: '',
        visibility: 'Public',
        is_published: true,
        display_order: 0
    })

    const [validationErrors, setValidationErrors] = useState({})
    const errors = { ...validationErrors, ...initialErrors }

    useEffect(() => {
        if (diploma) {
            setFormData({
                title: diploma.title || '',
                institution: diploma.institution || '',
                level: diploma.level || 'Master',
                field: diploma.field || '',
                start_date: diploma.start_date || '',
                end_date: diploma.end_date || '',
                honors: diploma.honors || '',
                grade: diploma.grade || '',
                description: diploma.description || '',
                visibility: diploma.visibility || 'Public',
                is_published: diploma.is_published ?? true,
                display_order: diploma.display_order || 0
            })
        }
    }, [diploma])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErr = { ...prev }
                delete newErr[name]
                return newErr
            })
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.title.trim()) newErrors.title = 'Requis'
        if (!formData.institution.trim()) newErrors.institution = 'Requis'
        if (!formData.start_date.match(/^\d{4}-\d{2}$/)) newErrors.start_date = 'Format YYYY-MM'
        if (!formData.end_date.match(/^\d{4}-\d{2}$/)) newErrors.end_date = 'Format YYYY-MM'

        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSave(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Informations du diplôme</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input label="Intitulé *" name="title" value={formData.title} onChange={handleChange} required error={errors.title} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Établissement *" name="institution" value={formData.institution} onChange={handleChange} required error={errors.institution} />
                                <Input label="Domaine d'étude" name="field" value={formData.field} onChange={handleChange} placeholder="Ex: Informatique" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Niveau</label>
                                    <select name="level" value={formData.level} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                                        <option value="BTS">BTS</option>
                                        <option value="DUT">DUT</option>
                                        <option value="Licence">Licence</option>
                                        <option value="Licence_Pro">Licence Pro</option>
                                        <option value="Master">Master</option>
                                        <option value="Master_Pro">Master Pro</option>
                                        <option value="Ingenieur">Ingénieur</option>
                                        <option value="Doctorat">Doctorat</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Visibilité</label>
                                    <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                                        <option value="Public">Public</option>
                                        <option value="Recruteur">Recruteur uniquement</option>
                                        <option value="Prive">Privé</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Début (AAAA-MM) *" type="month" name="start_date" value={formData.start_date} onChange={handleChange} placeholder="2020-09" required error={errors.start_date} />
                                <Input label="Fin (AAAA-MM) *" type="month" name="end_date" value={formData.end_date} onChange={handleChange} placeholder="2022-06" required error={errors.end_date} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Mention" name="honors" value={formData.honors} onChange={handleChange} placeholder="Ex: Très Bien" />
                                <Input label="Note / Moyenne" name="grade" value={formData.grade} onChange={handleChange} placeholder="Ex: 16/20" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                            </div>

                            <label className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Publié
                                </span>
                            </label>

                            <Button type="submit" isLoading={saving}>Enregistrer</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Preuves / Documents */}
                    <Card>
                        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
                        <CardContent>
                            {diploma && diploma.id ? (
                                <ProofManager contentType="diploma" objectId={diploma.id} />
                            ) : (
                                <p className="text-sm text-gray-500">Enregistrez d'abord le diplôme pour ajouter des documents (relevés de notes, copie du diplôme...).</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
