import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Alert, AlertTitle, AlertDescription, ThemeSwitch } from '@/components/ui'
import { authAPI, profileAPI, projectsAPI, skillsAPI, diplomasAPI, certificationsAPI, experiencesAPI, trainingsAPI } from '@/api'
import { useAuth } from '@/auth/hooks/useAuth'

export function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [password, setPassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [publicTemplate, setPublicTemplate] = useState('tech_alchemist')
  const [savingTemplate, setSavingTemplate] = useState(false)

  const [importFile, setImportFile] = useState(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const [importReplace, setImportReplace] = useState(false)

  const [qualityIssues, setQualityIssues] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const p = await profileAPI.getMyProfile()
        setPublicTemplate(p?.public_template || 'tech_alchemist')
      } catch (err) {
        console.error(err)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const runQualityChecks = async () => {
      try {
        const [p, projects, skills, diplomas, certifications, experiences, trainings] = await Promise.all([
          profileAPI.getMyProfile(),
          projectsAPI.getAll(),
          skillsAPI.getAll(),
          diplomasAPI.getAll(),
          certificationsAPI.getAll(),
          experiencesAPI.getAll(),
          trainingsAPI.getAll(),
        ])

        const issues = []
        if (!p?.professional_title) issues.push('Titre professionnel manquant')
        if (!p?.bio || String(p.bio).trim().length < 50) issues.push('Biographie trop courte (min 50 caractères)')
        if (!p?.portfolio_slug) issues.push('Slug public manquant (URL publique)')

        const publishedProjects = (projects || []).filter(x => x?.is_published)
        if (publishedProjects.length === 0) issues.push('Aucun projet publié')

        const hasPrimarySkill = (skills || []).some(x => x?.is_primary)
        if (!hasPrimarySkill) issues.push('Aucune compétence principale')

        const hasAnyEducation = (diplomas || []).length > 0 || (certifications || []).length > 0
        if (!hasAnyEducation) issues.push('Aucune entrée éducation (diplômes/certifications)')

        const hasAnyProfessional = (experiences || []).length > 0 || (trainings || []).length > 0
        if (!hasAnyProfessional) issues.push('Aucune entrée professionnelle (expériences/formations)')

        setQualityIssues(issues)
      } catch (err) {
        console.error(err)
      }
    }

    runQualityChecks()
  }, [])

  const handleSaveTemplate = async (nextTemplate) => {
    try {
      setSavingTemplate(true)
      setError('')
      setSuccess('')

      setPublicTemplate(nextTemplate)
      await profileAPI.updateMyProfile({ public_template: nextTemplate })
      setSuccess('Template public mis à jour.')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Erreur lors de la mise à jour du template'
      setError(msg)
    } finally {
      setSavingTemplate(false)
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError('')
      setSuccess('')

      const data = await profileAPI.exportPortfolio()
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'portfolio-export.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setSuccess('Export JSON généré.')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Erreur lors de l\'export'
      setError(msg)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setError('Veuillez sélectionner un fichier JSON à importer.')
      return
    }

    const confirmed = confirm(
      importReplace
        ? 'Mode remplacement total: toutes tes données portfolio actuelles seront supprimées puis remplacées par le JSON. Continuer ?'
        : 'Importer un export JSON va mettre à jour des éléments existants. Continuer ?'
    )
    if (!confirmed) return

    try {
      setIsImporting(true)
      setError('')
      setSuccess('')

      const text = await importFile.text()
      const payload = JSON.parse(text)
      await profileAPI.importPortfolio(payload, { mode: importReplace ? 'replace' : 'merge' })

      setSuccess('Import terminé. Recharge la page pour voir toutes les données à jour.')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Erreur lors de l\'import'
      setError(msg)
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!password) {
      setError('Veuillez saisir votre mot de passe pour confirmer.')
      return
    }

    const confirmed = confirm('Confirmer la suppression définitive de votre compte ? Cette action est irréversible.')
    if (!confirmed) return

    try {
      setIsDeleting(true)
      await authAPI.deleteAccount(password)
      await logout()
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Erreur lors de la suppression du compte'
      setError(msg)
    } finally {
      setIsDeleting(false)
      setPassword('')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Configurez vos préférences et gérez votre compte.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Succès</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Thème</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Basculer entre clair et sombre</p>
              </div>
              <ThemeSwitch />
            </div>

            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Template public</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choisir le style du portfolio public</p>
              </div>
              <select
                value={publicTemplate}
                onChange={(e) => handleSaveTemplate(e.target.value)}
                disabled={savingTemplate}
                className="min-w-[220px] px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="tech_alchemist">Tech Alchemist</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import / Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Export JSON</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Télécharger une sauvegarde complète du portfolio</p>
              </div>
              <Button onClick={handleExport} disabled={isExporting} isLoading={isExporting}>
                Exporter
              </Button>
            </div>

            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Import JSON</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Restaurer un export JSON (merge par défaut, ou remplacement total)</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={importReplace}
                    onChange={(e) => setImportReplace(e.target.checked)}
                  />
                  Remplacer totalement
                </label>
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
                <Button onClick={handleImport} variant="outline" disabled={isImporting} isLoading={isImporting}>
                  Importer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qualité éditoriale</CardTitle>
          </CardHeader>
          <CardContent>
            {qualityIssues.length === 0 ? (
              <Alert>
                <AlertTitle>OK</AlertTitle>
                <AlertDescription>Aucun point bloquant détecté.</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTitle>À améliorer</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1">
                    {qualityIssues.map((x) => (
                      <div key={x}>- {x}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suppression du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <Input
                label="Mot de passe"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div className="flex justify-end">
                <Button type="submit" variant="danger" isLoading={isDeleting} disabled={isDeleting}>
                  {isDeleting ? 'Suppression...' : 'Supprimer mon compte'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
