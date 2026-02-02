import { useEffect, useMemo, useState } from 'react'
import { X, Eye, ExternalLink, ShieldCheck } from 'lucide-react'
import { Button, Alert } from '@/components/ui'
import { profileAPI, recruiterAPI } from '@/api'

export function PortfolioPreviewDialog({ isOpen, onClose }) {
  const [mode, setMode] = useState('public')
  const [recruiterUrlType, setRecruiterUrlType] = useState('path')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [slug, setSlug] = useState('')
  const [links, setLinks] = useState([])
  const [selectedLinkId, setSelectedLinkId] = useState('')

  useEffect(() => {
    if (!isOpen) return

    let isCancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [profile, activeLinks] = await Promise.all([
          profileAPI.getMyProfile(),
          recruiterAPI.getActive().catch(() => []),
        ])

        if (isCancelled) return

        const nextSlug = profile?.portfolio_slug || ''
        setSlug(nextSlug)

        const nextLinks = Array.isArray(activeLinks) ? activeLinks : []
        setLinks(nextLinks)

        if (nextLinks.length > 0) {
          setSelectedLinkId(nextLinks[0].id)
        } else {
          setSelectedLinkId('')
        }

        if (!nextSlug && mode === 'public') {
          setError("Aucun slug de portfolio n'est disponible. Vérifie ton profil et sauvegarde-le.")
        }
      } catch (e) {
        console.error(e)
        if (isCancelled) return
        setError('Impossible de charger les informations de prévisualisation.')
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const selectedLink = useMemo(() => {
    return links.find((l) => String(l.id) === String(selectedLinkId))
  }, [links, selectedLinkId])

  const previewUrl = useMemo(() => {
    if (mode === 'recruiter') {
      const token = selectedLink?.token
      if (!token) return slug ? `${window.location.origin}/${slug}` : ''

      if (recruiterUrlType === 'path') {
        return `${window.location.origin}/recruiter-access/${token}`
      }

      if (!slug) return ''

      const url = new URL(`${window.location.origin}/${slug}`)
      url.searchParams.set('access', token)
      return url.toString()
    }

    if (!slug) return ''
    return `${window.location.origin}/${slug}`
  }, [mode, recruiterUrlType, selectedLink, slug])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleOpenPreview = () => {
    if (!previewUrl) return
    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    if (!previewUrl) return
    try {
      await navigator.clipboard.writeText(previewUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error(e)
      setError("Impossible de copier l'URL.")
    }
  }

  if (!isOpen) return null

  const hasRecruiterLinks = links.length > 0
  const canOpenRecruiterPreview = recruiterUrlType === 'path'
    ? hasRecruiterLinks && selectedLink?.token
    : slug && hasRecruiterLinks && selectedLink?.token

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-200/50 dark:border-gray-700/50">
        <div className="relative p-6 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-lg shadow-primary-500/25">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prévisualiser le portfolio</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Ouvrir ton portfolio en mode public ou recruteur
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('public')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  mode === 'public'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">Public</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sans token, visibilité publique</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('recruiter')
                  setError('')
                }}
                disabled={!hasRecruiterLinks}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  mode === 'recruiter'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600'
                } ${!hasRecruiterLinks ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-500'}`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">Recruiter</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Avec token, visibilité public + recruteur
                </p>
              </button>
            </div>
          </div>

          {mode === 'recruiter' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lien recruteur actif</p>

              {!hasRecruiterLinks ? (
                <Alert variant="warning">
                  Aucun lien recruteur actif. Crée-en un dans la section Recruiter.
                </Alert>
              ) : (
                <select
                  value={selectedLinkId}
                  onChange={(e) => setSelectedLinkId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700 dark:text-gray-300"
                >
                  {links.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Format de l'URL</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecruiterUrlType('slug')}
                    className={`px-4 py-2 rounded-lg border text-sm text-left transition-colors ${
                      recruiterUrlType === 'slug'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    /{slug}?access=token
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecruiterUrlType('path')}
                    className={`px-4 py-2 rounded-lg border text-sm text-left transition-colors ${
                      recruiterUrlType === 'path'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    /recruiter-access/token
                  </button>
                </div>
              </div>

              {recruiterUrlType === 'slug' && !slug && (
                <Alert variant="warning">
                  Le format <span className="font-mono">/{'{slug}'}?access=token</span> nécessite un slug.
                  Utilise <span className="font-mono">/recruiter-access/token</span> ou définis un slug dans le profil.
                </Alert>
              )}
            </div>
          )}

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">URL</p>
            <p className="text-sm font-mono break-all text-gray-900 dark:text-white mt-1">
              {previewUrl || '—'}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Fermer
            </Button>
            <Button type="button" variant="outline" onClick={handleCopy} disabled={loading || !previewUrl}>
              {copied ? 'Copié' : 'Copier URL'}
            </Button>
            <Button
              type="button"
              onClick={handleOpenPreview}
              disabled={loading || (mode === 'public' && !slug) || (mode === 'recruiter' && !canOpenRecruiterPreview)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {loading ? 'Chargement...' : 'Ouvrir'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
