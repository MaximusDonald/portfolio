// src/pages/public/RecruiterPage.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { recruiterAPI, profileAPI, projectsAPI, skillsAPI, diplomasAPI, certificationsAPI, experiencesAPI, trainingsAPI } from '@/api'
import { Alert, Spinner, ThemeToggle } from '@/components/ui'
import { Lock, CheckCircle, XCircle, ShieldCheck, Terminal } from 'lucide-react'
import { Hero, About, Skills, Experiences, Projects, Education } from '@/components/portfolio'

export function RecruiterPage() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading, valid, invalid, expired
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [experiences, setExperiences] = useState([])
  const [diplomas, setDiplomas] = useState([])
  const [certifications, setCertifications] = useState([])
  const [trainings, setTrainings] = useState([])

  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const validateAndFetch = async () => {
      try {
        const validation = await recruiterAPI.validateToken(token)

        if (!validation.valid) {
          setStatus('invalid')
          setErrorMessage(validation.message || 'Lien invalide ou expiré.')
          return
        }

        if (validation.expired) {
          setStatus('expired')
          setErrorMessage('Ce lien a expiré.')
          return
        }

        // Token valide → on charge les données avec le contexte du token
        const params = { access: token }
        const userId = validation.user_id

        const [
          profileData,
          projectsData,
          skillsData,
          expData,
          dipData,
          certData,
          trainData
        ] = await Promise.all([
          profileAPI.getPublicProfile(userId, params),
          projectsAPI.getPublic(userId, params),
          skillsAPI.getGrouped(userId, params),
          experiencesAPI.getPublic(userId, params),
          diplomasAPI.getPublic(userId, params),
          certificationsAPI.getPublic(userId, params),
          trainingsAPI.getPublic(userId, params),
        ])

        setProfile(profileData)
        setProjects(projectsData)
        setSkills(skillsData)
        setExperiences(expData)
        setDiplomas(dipData)
        setCertifications(certData)
        setTrainings(trainData)

        setStatus('valid')
      } catch (err) {
        console.error(err)
        setStatus('error')
        setErrorMessage('Une erreur est survenue. Le lien est peut-être invalide.')
      }
    }

    validateAndFetch()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-900 rounded-full animate-spin border-t-emerald-500 mx-auto"></div>
            <Terminal className="h-8 w-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">
            DÉCRYPTAGE DE L'ACCÈS SÉCURISÉ...
          </p>
        </div>
      </div>
    )
  }

  if (status !== 'valid' || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)] p-6">
        <div className="max-w-md w-full text-center space-y-8 tech-card p-12">
          <div className="relative inline-block">
            <div className={`p-8 rounded-[2.5rem] bg-neutral-900 border border-neutral-800`}>
              {status === 'expired' ? (
                <XCircle className="h-20 w-20 text-orange-500" />
              ) : (
                <Lock className="h-20 w-20 text-emerald-500" />
              )}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              ACCÈS REFUSÉ
            </h1>
            <p className="text-lg text-neutral-400 font-mono italic">
              {`// ${errorMessage}`}
            </p>
          </div>
          <div className="pt-4">
            <Link to="/" className="inline-flex h-12 items-center px-10 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
              TERMINER LA SESSION
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Navbar specifically for Recruiter Page (Internal Links)
  const RecruiterNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-2xl border-b border-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-xl font-black uppercase tracking-tight text-white">
            {profile.user_full_name} <span className="text-emerald-500">.</span>
          </span>
        </div>

        <div className="flex items-center gap-10">
          <ul className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
            <li><a href="#about" className="hover:text-emerald-500 transition-colors">IDENTITÉ</a></li>
            <li><a href="#skills" className="hover:text-emerald-500 transition-colors">SYSTÈME</a></li>
            <li><a href="#projects" className="hover:text-emerald-500 transition-colors">LABS</a></li>
            <li><a href="#experience" className="hover:text-emerald-500 transition-colors">ARCHIVES</a></li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-white transition-colors duration-500 font-sans">
      <RecruiterNavbar />

      {/* Recruiter Banner */}
      <div className="pt-20">
        <div className="bg-emerald-500 text-black py-4 px-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/10 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-[2s]"></div>
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em]">
            <ShieldCheck className="h-5 w-5" />
            <span>AUTHENTIFICATION VÉRIFIÉE • PROTOCOLE D'ACCÈS RECRUTEUR ACTIF</span>
          </div>
        </div>
      </div>

      <Hero profile={profile} />

      <main className="relative">
        <section id="about" className="section-container border-b border-neutral-900">
          <div className="max-w-6xl mx-auto"><About profile={profile} /></div>
        </section>

        <section id="skills" className="section-container bg-neutral-900/10 border-b border-neutral-900">
          <div className="max-w-6xl mx-auto"><Skills skills={skills} profile={profile} /></div>
        </section>

        <section id="experience" className="section-container border-b border-neutral-900">
          <div className="max-w-6xl mx-auto"><Experiences experiences={experiences} profile={profile} /></div>
        </section>

        <section id="projects" className="section-container bg-neutral-900/10 border-b border-neutral-900">
          <div className="max-w-6xl mx-auto"><Projects projects={projects} profile={profile} /></div>
        </section>

        <section id="education" className="section-container">
          <div className="max-w-6xl mx-auto">
            <Education diplomas={diplomas} certifications={certifications} trainings={trainings} profile={profile} />
          </div>
        </section>
      </main>

      <footer className="bg-neutral-950 border-t border-neutral-900 py-32 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-neutral-600 italic">
            &copy; {new Date().getFullYear()} {profile.user_full_name} // TRANSMISSION TERMINÉE
          </p>
          <div className="flex justify-center gap-6">
            <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
