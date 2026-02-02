import { useState, useEffect } from 'react'
import { Plus, Link as LinkIcon, Lock, Unlock, Copy, Trash2, BarChart3, Clock, Share2, Eye, CheckCircle, XCircle, ExternalLink, Zap } from 'lucide-react'
import { AdminLayout } from '@/layouts/AdminLayout'
import { recruiterAPI } from '@/api'
import { Button, Card, Spinner, Badge, Alert } from '@/components/ui'  // Ajout Alert
import { RecruiterLinkDialog } from '@/components/admin/recruiter/RecruiterLinkDialog'

export function RecruiterLinksList() {
  const [links, setLinks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState(null)  // ← Nouveau : erreur globale

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [linksData, statsData] = await Promise.all([
        recruiterAPI.getAll(),
        recruiterAPI.statistics()
      ])
      setLinks(linksData)
      setStats(statsData)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des données. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData, setDialogErrors) => {  // ← Ajout setDialogErrors
    try {
      setSaving(true)
      setError(null)
      await recruiterAPI.create(formData)
      await fetchData()
      setIsCreateOpen(false)
    } catch (err) {
      console.error(err)
      const apiErrors = err.response?.data || { non_field_errors: ['Erreur inconnue'] }
      if (setDialogErrors) setDialogErrors(apiErrors)  // ← Set errors dans dialog
      setError('Erreur lors de la création du lien. Vérifiez les champs.')
    } finally {
      setSaving(false)
    }
  }

  const handleRevoke = async (id) => {
    if (!confirm('Voulez-vous vraiment révoquer ce lien ? Il ne sera plus utilisable.')) return
    try {
      await recruiterAPI.revoke(id)
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la révocation.')
    }
  }

  const createLink = (token) => {
    const link = `${window.location.origin}/recruiter-access/${token}`
    return link
  }

  const handleActivate = async (id) => {
    try {
      await recruiterAPI.activate(id)
      fetchData()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Impossible de réactiver ce lien')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer définitivement cet historique de lien ?')) return
    try {
      await recruiterAPI.delete(id)
      setLinks(links.filter(l => l.id !== id))
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la suppression.')
    }
  }

  const handleCopy = async (url, id) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center p-12 min-h-[60vh]">
        <Spinner className="h-10 w-10" />
        <p className="mt-4 text-gray-500">Chargement des liens...</p>
      </div>
    </AdminLayout>
  )

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group`}>
      <div className={`absolute -top-4 -right-4 h-24 w-24 rounded-full ${color} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className={`inline-flex p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
    </div>
  )

  return (
    <AdminLayout>
      {/* Erreur globale */}
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-lg shadow-primary-500/20">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accès Recruteurs</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2 ml-14">
            Générez des liens temporaires sécurisés pour partager votre portfolio
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-lg shadow-primary-500/25 gap-2"
        >
          <Zap className="h-4 w-4" />
          Générer un lien
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={LinkIcon}
            label="Liens actifs"
            value={stats.active_links}
            color="bg-blue-500"
          />
          <StatCard
            icon={Eye}
            label="Vues totales"
            value={stats.total_accesses}
            color="bg-green-500"
          />
          <StatCard
            icon={Clock}
            label="Expirés"
            value={stats.expired_links}
            color="bg-orange-500"
          />
          <StatCard
            icon={BarChart3}
            label="Total généré"
            value={stats.total_links}
            color="bg-gray-500"
          />
        </div>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {links.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="inline-flex p-4 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-2xl mb-4">
              <Share2 className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aucun lien généré</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Créez votre premier lien d'accès pour permettre aux recruteurs de découvrir vos projets et compétences privés.
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-lg shadow-primary-500/25"
              onClick={() => setIsCreateOpen(true)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Générer mon premier lien
            </Button>
          </div>
        ) : (
          links.map(link => {
            const isValid = link.is_active && !link.is_expired

            return (
              <Card
                key={link.id}
                className={`p-6 transition-all hover:shadow-lg border-l-4 ${isValid
                    ? 'border-l-green-500 hover:border-l-green-600'
                    : link.is_expired
                      ? 'border-l-orange-400 opacity-75'
                      : 'border-l-red-400 opacity-75'
                  }`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Infos principales */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {link.name}
                      </h3>
                      {isValid ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Actif
                        </Badge>
                      ) : link.is_expired ? (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0 gap-1">
                          <Clock className="h-3 w-3" />
                          Expiré
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 gap-1">
                          <XCircle className="h-3 w-3" />
                          Révoqué
                        </Badge>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                        <Eye className="h-3.5 w-3.5" />
                        {link.access_count} vue{link.access_count !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl font-mono text-sm text-gray-600 dark:text-gray-300 group">
                      <LinkIcon className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate flex-1">{createLink(link.token)}</span>
                      {isValid && (
                        <a
                          href={createLink(link.token)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Ouvrir dans un nouvel onglet"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </a>
                      )}
                    </div>

                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {link.is_expired ? (
                          <>Expiré le <span className="text-orange-600 font-medium">{new Date(link.expires_at).toLocaleDateString()}</span></>
                        ) : (
                          <>Expire dans <span className="text-primary-600 dark:text-primary-400 font-semibold">{link.time_remaining}</span></>
                        )}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>Créé le {new Date(link.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col justify-end items-stretch gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleCopy(createLink(link.token), link.id)}
                      className={`gap-2 transition-all ${copiedId === link.id
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : ''
                        }`}
                    >
                      {copiedId === link.id ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copier
                        </>
                      )}
                    </Button>

                    {isValid && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevoke(link.id)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/50 gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        Révoquer
                      </Button>
                    )}

                    {!link.is_active && !link.is_expired && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivate(link.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/50 gap-2"
                      >
                        <Unlock className="h-4 w-4" />
                        Réactiver
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <RecruiterLinkDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}  // ← Passe handleCreate qui gère errors
        saving={saving}
      />
    </AdminLayout>
  )
}