import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ProofManager } from '@/components/admin/proofs/ProofManager'

export function TrainingForm({ training, onSave, saving = false, errors: initialErrors = {} }) {
    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        training_type: 'En_ligne',
        url: '',
        start_date: '',
        end_date: '',
        is_ongoing: false,
        duration_hours: '',
        description: '',
        skills_acquired: '',
        has_certificate: false,
        certificate_url: '',
        visibility: 'Public',
        is_published: true,
        display_order: 0
    })

    const [validationErrors, setValidationErrors] = useState({})
    const errors = { ...validationErrors, ...initialErrors }

    useEffect(() => {
        if (training) {
            setFormData({
                title: training.title || '',
                organization: training.organization || '',
                training_type: training.training_type || 'En_ligne',
                url: training.url || '',
                start_date: training.start_date || '',
                end_date: training.end_date || '',
                is_ongoing: training.is_ongoing || false,
                duration_hours: training.duration_hours || '',
                description: training.description || '',
                skills_acquired: training.skills_acquired || '',
                has_certificate: training.has_certificate || false,
                certificate_url: training.certificate_url || '',
                visibility: training.visibility || 'Public',
                is_published: training.is_published ?? true,
                display_order: training.display_order || 0
            })
        }
    }, [training])

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
        if (!formData.organization.trim()) newErrors.organization = 'Requis'
        if (!formData.start_date) newErrors.start_date = 'Requis'

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
                        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input label="Titre de la formation *" name="title" value={formData.title} onChange={handleChange} required error={errors.title} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Organisme *" name="organization" value={formData.organization} onChange={handleChange} required error={errors.organization} />
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select name="training_type" value={formData.training_type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                                        <option value="En_ligne">En ligne</option>
                                        <option value="Presentiel">Présentiel</option>
                                        <option value="Hybride">Hybride</option>
                                    </select>
                                </div>
                            </div>

                            <Input label="URL de la formation" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Début (AAAA-MM) *" type="month" name="start_date" value={formData.start_date} onChange={handleChange} placeholder="2022-01" required error={errors.start_date} />

                                <div>
                                    <Input
                                        label="Fin (AAAA-MM)"
                                        type="month"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        placeholder="2022-03"
                                        disabled={formData.is_ongoing}
                                    />
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_ongoing"
                                            name="is_ongoing"
                                            checked={formData.is_ongoing}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_ongoing" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Formation en cours
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Input label="Durée (heures)" type="number" name="duration_hours" value={formData.duration_hours} onChange={handleChange} />

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Compétences acquises</label>
                                <textarea name="skills_acquired" rows={2} value={formData.skills_acquired} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" placeholder="React, Agile..." />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="has_certificate"
                                    name="has_certificate"
                                    checked={formData.has_certificate}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                                />
                                <label htmlFor="has_certificate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Certificat obtenu
                                </label>
                            </div>

                            {formData.has_certificate && (
                                <Input label="URL du certificat" name="certificate_url" value={formData.certificate_url} onChange={handleChange} />
                            )}

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Publié
                                </label>
                            </div>

                            <Button type="submit" isLoading={saving}>Enregistrer</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Preuves */}
                    <Card>
                        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
                        <CardContent>
                            {training && training.id ? (
                                <ProofManager contentType="training" objectId={training.id} />
                            ) : (
                                <p className="text-sm text-gray-500">Enregistrez d'abord la formation pour ajouter des documents.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
