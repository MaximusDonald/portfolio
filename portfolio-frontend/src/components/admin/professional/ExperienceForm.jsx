import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ProofManager } from '@/components/admin/proofs/ProofManager'

export function ExperienceForm({ experience, onSave, saving = false, errors: initialErrors = {} }) {
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        company_url: '',
        location: '',
        experience_type: 'Emploi',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        missions: '',
        achievements: '',
        technologies: '',
        visibility: 'Public',
        is_published: true,
        display_order: 0
    })

    const [validationErrors, setValidationErrors] = useState({})
    const errors = { ...validationErrors, ...initialErrors }

    useEffect(() => {
        if (experience) {
            setFormData({
                position: experience.position || '',
                company: experience.company || '',
                company_url: experience.company_url || '',
                location: experience.location || '',
                experience_type: experience.experience_type || 'Emploi',
                start_date: experience.start_date || '',
                end_date: experience.end_date || '',
                is_current: experience.is_current || false,
                description: experience.description || '',
                missions: experience.missions || '',
                achievements: experience.achievements || '',
                technologies: experience.technologies || '',
                visibility: experience.visibility || 'Public',
                is_published: experience.is_published ?? true,
                display_order: experience.display_order || 0
            })
        }
    }, [experience])

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
        if (!formData.position.trim()) newErrors.position = 'Requis'
        if (!formData.company.trim()) newErrors.company = 'Requis'
        if (!formData.start_date) newErrors.start_date = 'Requis'
        if (!formData.description.trim()) newErrors.description = 'Requis'
        if (!formData.missions.trim()) newErrors.missions = 'Requis'

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
                            <Input label="Poste occupé *" name="position" value={formData.position} onChange={handleChange} required error={errors.position} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Entreprise *" name="company" value={formData.company} onChange={handleChange} required error={errors.company} />
                                <Input label="Site Web (URL)" name="company_url" value={formData.company_url} onChange={handleChange} placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Localisation" name="location" value={formData.location} onChange={handleChange} placeholder="Paris, France" />
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type de contrat</label>
                                    <select name="experience_type" value={formData.experience_type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                                        <option value="Stage">Stage</option>
                                        <option value="Emploi">Emploi (CDI/CDD)</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Alternance">Alternance</option>
                                        <option value="Benevolat">Bénévolat</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Début (AAAA-MM) *" type="month" name="start_date" value={formData.start_date} onChange={handleChange} placeholder="2021-03" required error={errors.start_date} />

                                <div>
                                    <Input
                                        label="Fin (AAAA-MM)"
                                        type="month"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        placeholder="2023-09"
                                        disabled={formData.is_current}
                                    />
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_current"
                                            name="is_current"
                                            checked={formData.is_current}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_current" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Poste actuel
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description du poste *</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Missions principales *</label>
                                <textarea
                                    name="missions"
                                    rows={5}
                                    value={formData.missions}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    placeholder="- Mission 1..."
                                    required
                                />
                                {errors.missions && <p className="text-red-500 text-sm mt-1">{errors.missions}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Réalisations / Résultats</label>
                                <textarea
                                    name="achievements"
                                    rows={3}
                                    value={formData.achievements}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    placeholder="Ex: Augmentation du trafic de 20%..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Stack Technique</label>
                                <textarea
                                    name="technologies"
                                    rows={2}
                                    value={formData.technologies}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    placeholder="React, Python, Docker..."
                                />
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
                    {/* Preuves */}
                    <Card>
                        <CardHeader><CardTitle>Preuves & Documents</CardTitle></CardHeader>
                        <CardContent>
                            {experience && experience.id ? (
                                <ProofManager contentType="experience" objectId={experience.id} />
                            ) : (
                                <p className="text-sm text-gray-500">Enregistrez d'abord l'expérience pour ajouter des documents.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
