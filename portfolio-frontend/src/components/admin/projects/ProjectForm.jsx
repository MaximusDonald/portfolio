import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Save, Upload, X } from 'lucide-react'
import { ProofManager } from '@/components/admin/proofs/ProofManager'

export function ProjectForm({ project, onSave, saving = false, errors: initialErrors = {} }) {
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        description: '',
        project_type: 'Personnel',
        status: 'En_cours',
        role: '',
        team_size: '',
        organization: '',
        start_date: '',
        end_date: '',
        technologies: '',
        key_features: '',
        challenges: '',
        solutions: '',
        achievements: '',
        learning_outcomes: '',
        github_url: '',
        demo_url: '',
        video_url: '',
        documentation_url: '',
        is_published: true,
        is_featured: false,
        display_order: 0,
        cover_image: null,
    })

    const [validationErrors, setValidationErrors] = useState({})

    // Merge props errors (from backend) with local validation errors
    const errors = { ...validationErrors, ...initialErrors }

    // Preview de l'image
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                short_description: project.short_description || '',
                description: project.description || '',
                project_type: project.project_type || 'Personnel',
                status: project.status || 'En_cours',
                role: project.role || '',
                team_size: project.team_size || '',
                organization: project.organization || '',
                start_date: project.start_date || '',
                end_date: project.end_date || '',
                technologies: project.technologies || '',
                key_features: project.key_features || '',
                challenges: project.challenges || '',
                solutions: project.solutions || '',
                achievements: project.achievements || '',
                learning_outcomes: project.learning_outcomes || '',
                github_url: project.github_url || '',
                demo_url: project.demo_url || '',
                video_url: project.video_url || '',
                documentation_url: project.documentation_url || '',
                is_published: project.is_published ?? true,
                is_featured: project.is_featured ?? false,
                display_order: project.display_order ?? 0,
                cover_image: null // On ne remplit pas avec l'URL existante pour l'envoi
            })
            setPreview(project.cover_image)
        }
    }, [project])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        // Clear error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, cover_image: file }))
            // Créer une URL temporaire pour la preview
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
        }
    }

    const validate = () => {
        const newErrors = {}
        const requiredFields = [
            'title',
            'short_description',
            'description',
            'technologies',
            'key_features',
            'start_date'
        ]

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = 'Ce champ est obligatoire.'
            }
        })

        // Validation simple du format de date AAAA-MM
        const dateRegex = /^\d{4}-\d{2}$/
        if (formData.start_date && !dateRegex.test(formData.start_date)) {
            newErrors.start_date = 'Format requis: AAAA-MM (Ex: 2024-01)'
        }
        if (formData.end_date && !dateRegex.test(formData.end_date)) {
            newErrors.end_date = 'Format requis: AAAA-MM (Ex: 2024-06)'
        }

        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            onSave(formData)
        } else {
            // Scroll to the first error or show a generic message
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLONNE GAUCHE (Principale) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Titre du projet *"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ex: Mon Super Portfolio"
                                required
                                error={errors.title}
                            />

                            <Input
                                label="Description courte *"
                                name="short_description"
                                value={formData.short_description}
                                onChange={handleChange}
                                placeholder="Résumé en une phrase pour les cartes..."
                                maxLength={300}
                                required
                                helperText={`${formData.short_description.length}/300`}
                                error={errors.short_description}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description détaillée *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Contexte, objectifs, méthode..."
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Aspects Techniques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Technologies utilisées *
                                </label>
                                <textarea
                                    name="technologies"
                                    value={formData.technologies}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="React, Django, Tailwind CSS, PostgreSQL..."
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Séparées par des virgules</p>
                                {errors.technologies && <p className="text-red-500 text-sm">{errors.technologies}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Fonctionnalités clés *
                                </label>
                                <textarea
                                    name="key_features"
                                    value={formData.key_features}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="- Authentification JWT&#10;- Upload d'images&#10;- Mode sombre"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Une par ligne</p>
                                {errors.key_features && <p className="text-red-500 text-sm">{errors.key_features}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Défis & Solutions
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <textarea
                                        name="challenges"
                                        value={formData.challenges}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Défis rencontrés..."
                                    />
                                    <textarea
                                        name="solutions"
                                        value={formData.solutions}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Solutions apportées..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* COLONNE DROITE (Latérale) */}
                <div className="space-y-6">
                    {/* Image de couverture */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Image de couverture</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative group hover:border-primary-500 transition-colors">
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm">Changer l'image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Glissez ou cliquez pour ajouter</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                {errors.cover_image && <p className="text-red-500 text-sm">{errors.cover_image}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preuves (Uniquement si le projet existe déjà) */}
                    {project && project.id && (
                        <Card>
                            <CardContent className="pt-6">
                                <ProofManager
                                    contentType="project"
                                    objectId={project.id}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Méta-données */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contexte</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    name="project_type"
                                    value={formData.project_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
                                >
                                    <option value="Personnel">Personnel</option>
                                    <option value="Professionnel">Professionnel</option>
                                    <option value="Académique">Académique</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
                                >
                                    <option value="En_cours">En cours</option>
                                    <option value="Termine">Terminé</option>
                                    <option value="Archive">Archivé</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    label="Début (AAAA-MM) *"
                                    name="start_date"
                                    type="month"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    placeholder="2024-01"
                                    required
                                    error={errors.start_date}
                                />
                                <Input
                                    label="Fin (AAAA-MM)"
                                    name="end_date"
                                    type="month"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    placeholder="2024-06"
                                    error={errors.end_date}
                                />
                            </div>

                            <Input
                                label="Rôle"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Ex: Lead Dev"
                            />

                            <Input
                                label="Taille de l'équipe"
                                name="team_size"
                                value={formData.team_size}
                                onChange={handleChange}
                                placeholder="Ex: 5 personnes"
                            />
                        </CardContent>
                    </Card>

                    {/* Liens */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Liens</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Démo URL"
                                name="demo_url"
                                type="url"
                                value={formData.demo_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                error={errors.demo_url}
                            />
                            <Input
                                label="GitHub URL"
                                name="github_url"
                                type="url"
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                                error={errors.github_url}
                            />
                            <Input
                                label="Vidéo URL"
                                name="video_url"
                                type="url"
                                value={formData.video_url}
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                            />
                        </CardContent>
                    </Card>

                    {/* Options */}
                    <Card>
                        <CardContent className="pt-6">
                            <label className="flex items-center gap-3 cursor-pointer mb-3">
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Publié
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Mettre en avant ce projet
                                </span>
                            </label>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardContent className="pt-6">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={saving}
                                disabled={saving}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? 'Sauvegarde...' : 'Enregistrer le projet'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
