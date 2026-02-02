// components/admin/skills/SkillForm.jsx
import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Save } from 'lucide-react'

export function SkillForm({ skill, onSave, saving = false, errors: initialErrors = {} }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Langage',
        level: 'Intermediaire',
        description: '',
        years_of_experience: '',
        is_primary: false,
        display_order: 0
    })

    const [validationErrors, setValidationErrors] = useState({})
    const errors = { ...validationErrors, ...initialErrors }

    useEffect(() => {
        if (skill) {
            setFormData({
                name: skill.name || '',
                category: skill.category || 'Langage',
                level: skill.level || 'Intermediaire',
                description: skill.description || '',
                years_of_experience: skill.years_of_experience || '',
                is_primary: skill.is_primary || false,
                display_order: skill.display_order || 0
            })
        }
    }, [skill])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErr = { ...prev }
                delete newErr[name]
                return newErr
            })
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Le nom est requis.'

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
            <Card>
                <CardHeader>
                    <CardTitle>Détails de la compétence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <Input
                        label="Nom *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: React.js, Gestion d'équipe"
                        required
                        error={errors.name}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Catégorie
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="Langage">Langage de programmation</option>
                                <option value="Framework">Framework / Librairie</option>
                                <option value="Outil">Outil / Environnement</option>
                                <option value="Soft_Skill">Compétence transversale</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Niveau de maîtrise
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="Debutant">Débutant</option>
                                <option value="Intermediaire">Intermédiaire</option>
                                <option value="Avance">Avancé</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Années d'expérience (optionnel)"
                        name="years_of_experience"
                        type="number"
                        step="0.5"
                        min="0"
                        max="50"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        placeholder="Ex: 3.5"
                        error={errors.years_of_experience}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Description / Contexte d'utilisation
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ex: Utilisé quotidiennement sur des projets React + TypeScript depuis 2023..."
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_primary"
                            name="is_primary"
                            checked={formData.is_primary}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="is_primary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mettre en avant cette compétence (compétence principale)
                        </label>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" disabled={saving} isLoading={saving} className="w-full sm:w-auto min-w-[180px]">
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Enregistrement...' : 'Enregistrer la compétence'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Affichage amélioré des erreurs globales */}
            {Object.keys(errors).length > 0 && !errors.name && !errors.years_of_experience && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                    {errors.non_field_errors && <p>{errors.non_field_errors.join(' • ')}</p>}
                    {errors.detail && <p>{errors.detail}</p>}
                </div>
            )}
        </form>
    )
}