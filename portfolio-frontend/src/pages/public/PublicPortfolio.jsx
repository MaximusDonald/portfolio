import { useLoaderData } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { Hero, About, Skills, Experiences, Projects, Education } from '@/components/portfolio'

export function PublicPortfolio() {
  const { profile, projects, skills, experiences, diplomas, certifications, trainings } = useLoaderData()

  if (!profile) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
          <div className="text-center p-8">
            <h1 className="text-4xl font-black text-white mb-4 uppercase">
              Système Hors Ligne
            </h1>
            <p className="text-neutral-500 mb-6 font-mono">
              [ERROR] Profil introuvable ou non synchronisé.
            </p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout publicTemplate={profile?.public_template}>
      <Hero profile={profile} />

      <main className="relative bg-[var(--bg-deep)]">
        {/* HUD Decoration */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

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
    </PublicLayout>
  )
}
