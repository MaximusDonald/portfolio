import { useState, useEffect } from 'react'
import { Plus, Trash2, FileText, Image as ImageIcon, Film, File, GripVertical, Download } from 'lucide-react'
import { proofsAPI } from '@/api'
import { Button, Card, CardContent, Spinner, Input } from '@/components/ui'

export function ProofManager({ contentType, objectId }) {
    const [proofs, setProofs] = useState([])
    const [loading, setLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    // Form state
    const [showForm, setShowForm] = useState(false)
    const [newProof, setNewProof] = useState({
        title: '',
        description: '',
        proof_type: 'image',
        file: null
    })

    useEffect(() => {
        if (objectId) {
            loadProofs()
        }
    }, [objectId, contentType])

    const loadProofs = async () => {
        try {
            setLoading(true)
            const data = await proofsAPI.getByObject(contentType, objectId)
            setProofs(data)
        } catch (err) {
            console.error('Erreur chargement preuves:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette preuve ?')) return
        try {
            await proofsAPI.delete(id)
            setProofs(proofs.filter(p => p.id !== id))
        } catch (err) {
            console.error('Erreur suppression:', err)
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!newProof.file) return alert('Veuillez sélectionner un fichier')

        try {
            setIsUploading(true)
            await proofsAPI.create({
                ...newProof,
                content_type_model: contentType,
                object_id: objectId
            })
            setShowForm(false)
            setNewProof({ title: '', description: '', proof_type: 'image', file: null })
            loadProofs()
        } catch (err) {
            console.error('Erreur upload:', err)
            alert('Erreur lors de l\'upload')
        } finally {
            setIsUploading(false)
        }
    }

    const handleReorder = async (currentIndex, direction) => {
        const newIndex = currentIndex + direction
        if (newIndex < 0 || newIndex >= proofs.length) return

        const newProofs = [...proofs]
        const [movedItem] = newProofs.splice(currentIndex, 1)
        newProofs.splice(newIndex, 0, movedItem)

        setProofs(newProofs)

        const reorderPayload = newProofs.map((p, index) => ({
            id: p.id,
            display_order: index
        }))

        try {
            await proofsAPI.reorder(reorderPayload)
        } catch (err) {
            console.error('Erreur réorganisation:', err)
            loadProofs()
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <ImageIcon className="h-5 w-5 text-blue-500" />
            case 'video': return <Film className="h-5 w-5 text-red-500" />
            case 'pdf': return <FileText className="h-5 w-5 text-orange-500" />
            default: return <File className="h-5 w-5 text-gray-500" />
        }
    }

    if (!objectId) return <div className="text-gray-500 text-sm italic">Enregistrez d'abord l'objet pour ajouter des preuves.</div>

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preuves & Fichiers</h3>
                <Button size="sm" onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                </Button>
            </div>

            {showForm && (
                <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
                    <CardContent className="pt-6">
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Titre du fichier *"
                                    value={newProof.title}
                                    onChange={e => setNewProof({ ...newProof, title: e.target.value })}
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select
                                        value={newProof.proof_type}
                                        onChange={e => setNewProof({ ...newProof, proof_type: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
                                    >
                                        <option value="image">Image</option>
                                        <option value="video">Vidéo</option>
                                        <option value="pdf">PDF</option>
                                        <option value="document">Document</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Description"
                                value={newProof.description}
                                onChange={e => setNewProof({ ...newProof, description: e.target.value })}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fichier *</label>
                                <input
                                    type="file"
                                    onChange={e => setNewProof({ ...newProof, file: e.target.files[0] })}
                                    required
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
                                <Button type="submit" isLoading={isUploading}>Uploader</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <Spinner size="sm" className="mx-auto" />
            ) : proofs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg dashed border border-gray-200 dark:border-gray-700">
                    Aucune preuve associée
                </div>
            ) : (
                <div className="space-y-2">
                    {proofs.map((proof, index) => (
                        <div key={proof.id} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm group">
                            <div className="flex flex-col gap-1 text-gray-400">
                                <button
                                    disabled={index === 0}
                                    onClick={() => handleReorder(index, -1)}
                                    className="hover:text-primary-600 disabled:opacity-30 p-0.5"
                                >▲</button>
                                <button
                                    disabled={index === proofs.length - 1}
                                    onClick={() => handleReorder(index, 1)}
                                    className="hover:text-primary-600 disabled:opacity-30 p-0.5"
                                >▼</button>
                            </div>

                            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                                {proof.is_image ? (
                                    <img src={proof.file_url} alt={proof.title} className="h-full w-full object-cover" />
                                ) : (
                                    getIcon(proof.proof_type)
                                )}
                            </div>

                            <div className="flex-grow min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">{proof.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="uppercase bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{proof.proof_type}</span>
                                    <span>{proof.file_size_display}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={proof.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-gray-500 hover:text-primary-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="Télécharger / Voir"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                                <button
                                    onClick={() => handleDelete(proof.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="Supprimer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
