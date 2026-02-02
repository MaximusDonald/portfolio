import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Save } from 'lucide-react'
import { ProofManager } from '@/components/admin/proofs/ProofManager'

export function CertificationForm({ certification, onSave, saving = false, errors: initialErrors = {} }) {
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        platform: '',
        issue_date: '',
        expiration_date: '',
        does_not_expire: false,
        credential_id: '',
        credential_url: '',
        description: '',
        skills_acquired: '',
        visibility: 'Public',
        is_published: true,
        display_order: 0
    })

    const [validationErrors, setValidationErrors] = useState({})
    const errors = { ...validationErrors, ...initialErrors }

    useEffect(() => {
        if (certification) {
            setFormData({
                name: certification.name || '',
                organization: certification.organization || '',
                platform: certification.platform || '',
                issue_date: certification.issue_date || '',
                expiration_date: certification.expiration_date || '',
                does_not_expire: certification.does_not_expire || false,
                credential_id: certification.credential_id || '',
                credential_url: certification.credential_url || '',
                description: certification.description || '',
                skills_acquired: certification.skills_acquired || '',
                visibility: certification.visibility || 'Public',
                is_published: certification.is_published ?? true,
                display_order: certification.display_order || 0
            })
        }
    }, [certification])

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
        if (!formData.name.trim()) newErrors.name = 'Requis'
        if (!formData.organization.trim()) newErrors.organization = 'Requis'
        if (!formData.issue_date) newErrors.issue_date = 'Requis'

        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            if (formData.does_not_expire) {
                formData.expiration_date = null   // ou delete formData.expiration_date
            }
            console.log('Submitting form data:', formData)
            onSave(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Informations de la certification</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input label="Nom de la certification *" name="name" value={formData.name} onChange={handleChange} required error={errors.name} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Organisme *" name="organization" value={formData.organization} onChange={handleChange} required error={errors.organization} />
                                <Input label="Plateforme (ex: Coursera)" name="platform" value={formData.platform} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Date d'obtention *" type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} required error={errors.issue_date} />

                                <div>
                                    <Input
                                        label="Date d'expiration"
                                        type="date"
                                        name="expiration_date"
                                        value={formData.expiration_date || ''}
                                        onChange={handleChange}
                                        disabled={formData.does_not_expire}
                                        error={errors.expiration_date}
                                    />
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="does_not_expire"
                                            name="does_not_expire"
                                            checked={formData.does_not_expire}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="does_not_expire" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            N'expire pas
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="ID Vérification (Credential ID)" name="credential_id" value={formData.credential_id} onChange={handleChange} />
                                <Input label="URL Vérification" name="credential_url" value={formData.credential_url} onChange={handleChange} placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Visibilité</label>
                                <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                                    <option value="Public">Public</option>
                                    <option value="Recruteur">Recruteur uniquement</option>
                                    <option value="Prive">Privé</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Compétences acquises</label>
                                <textarea
                                    name="skills_acquired"
                                    rows={3}
                                    value={formData.skills_acquired}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    placeholder="Liste des compétences (ex: React, Node.js, AWS)..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                            </div>

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
                        <CardHeader><CardTitle>Certificat (PDF/Image)</CardTitle></CardHeader>
                        <CardContent>
                            {certification && certification.id ? (
                                <ProofManager contentType="certification" objectId={certification.id} />
                            ) : (
                                <p className="text-sm text-gray-500">Enregistrez d'abord la certification pour ajouter le certificat officiel.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
