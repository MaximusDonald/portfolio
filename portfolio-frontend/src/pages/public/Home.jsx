import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sun, Moon, Github, Linkedin, Globe, Mail, MapPin, Phone, Download, ExternalLink, Calendar, Award, Briefcase, GraduationCap, Code2, BookOpen, Terminal } from 'lucide-react'
import { profileAPI, projectsAPI, skillsAPI, diplomasAPI, certificationsAPI, experiencesAPI, trainingsAPI, recruiterAPI } from '@/api'
import { Button, Badge, Card, Spinner } from '@/components/ui'

// Utils
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

export function Home() {
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('access')

  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [diplomas, setDiplomas] = useState([])
  const [certifications, setCertifications] = useState([])
  const [trainings, setTrainings] = useState([])

  const [loading, setLoading] = useState(true)
  const [tokenValid, setTokenValid] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Check system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    init()
  }, [accessToken])

  const init = async () => {
    try {
      setLoading(true)

      // Validate Token if present
      if (accessToken) {
        try {
          const res = await recruiterAPI.validateToken(accessToken)
          setTokenValid(res.valid)
        } catch (e) {
          console.error("Token validation failed", e)
          setTokenValid(false)
        }
      }

      // Fetch Profile
      const profileData = await profileAPI.getDefault()
      setProfile(profileData)

      if (profileData && profileData.user?.id) {
        const userId = profileData.user.id
        const params = accessToken ? { access: accessToken } : {}

        // Parallel fetch
        const [
          skillsData,
          projectsData,
          expData,
          dipData,
          certData,
          trainData
        ] = await Promise.all([
          skillsAPI.getGrouped(userId, params),
          projectsAPI.getPublic(userId, params),
          experiencesAPI.getPublic(userId, params),
          diplomasAPI.getPublic(userId, params),
          certificationsAPI.getPublic(userId, params),
          trainingsAPI.getPublic(userId, params)
        ])

        setSkills(skillsData)
        setProjects(projectsData)
        setExperiences(expData)
        setDiplomas(dipData)
        setCertifications(certData)
        setTrainings(trainData)
      }

    } catch (err) {
      console.error("Error fetching portfolio data", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Portfolio non disponible</h1>
          <p className="text-gray-600 dark:text-gray-400">Aucun profil n'a encore été configuré.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} profile={profile} />

      {tokenValid && (
        <div className="bg-primary-600 text-white text-center py-2 px-4 text-sm font-medium animate-in slide-in-from-top">
          Accès Recruteur Déverrouillé — Vous avez accès au contenu restreint
        </div>
      )}

      <Hero profile={profile} />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        {profile.bio && <section id="about" className="scroll-mt-24"><About profile={profile} /></section>}
        {skills.length > 0 && <section id="skills" className="scroll-mt-24"><Skills skills={skills} /></section>}
        {experiences.length > 0 && <section id="experience" className="scroll-mt-24"><Experiences experiences={experiences} /></section>}
        {projects.length > 0 && <section id="projects" className="scroll-mt-24"><Projects projects={projects} /></section>}
        {(diplomas.length > 0 || certifications.length > 0 || trainings.length > 0) && (
          <section id="education" className="scroll-mt-24">
            <Education diplomas={diplomas} certifications={certifications} trainings={trainings} />
          </section>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  )
}

function Navbar({ darkMode, setDarkMode, profile }) {
  const navLinks = [
    { name: 'À propos', href: '#about' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Expériences', href: '#experience' },
    { name: 'Projets', href: '#projects' },
    { name: 'Formation', href: '#education' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          {profile?.user_full_name || 'Portfolio'}
        </a>

        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  )
}

function Hero({ profile }) {
  const socials = profile.social_links || {}

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-[40rem] h-[40rem] bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[30rem] h-[30rem] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/4"></div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
        {profile.photo && (
          <div className="relative shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full p-1 bg-gradient-to-br from-primary-500 to-blue-500 shadow-xl">
            <img
              src={profile.photo}
              alt={profile.user.first_name}
              className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-950 bg-white"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Salut, je suis <span className="text-primary-600 dark:text-primary-400">{profile?.user_full_name}</span>.
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              {profile.professional_title}
            </h2>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="#projects">
              <Button size="lg" className="rounded-full px-8">Voir mes projets</Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="rounded-full px-8">Me contacter</Button>
            </a>
          </div>

          <div className="flex justify-center md:justify-start gap-5 text-gray-500 dark:text-gray-400">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {profile.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <Globe className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function About({ profile }) {
  return (
    <div className="grid md:grid-cols-3 gap-12 items-start">
      <div className="md:col-span-1">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 mb-6">À propos</h3>
      </div>
      <div className="md:col-span-2 space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed dark:text-gray-400">
        <div dangerouslySetInnerHTML={{ __html: profile.bio?.replace(/\n/g, '<br/>') }} />

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {profile.show_location && profile.location && (
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><MapPin className="h-5 w-5 text-gray-500" /></div>
              <span>{profile.location}</span>
            </div>
          )}
          {profile.show_email && (profile.professional_email || profile.user.email) && (
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><Mail className="h-5 w-5 text-gray-500" /></div>
              <a href={`mailto:${profile.professional_email || profile.user.email}`} className="hover:text-primary-600">{profile.professional_email || profile.user.email}</a>
            </div>
          )}
          {profile.show_phone && profile.phone && (
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><Phone className="h-5 w-5 text-gray-500" /></div>
              <a href={`tel:${profile.phone}`} className="hover:text-primary-600">{profile.phone}</a>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><div className="h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-200 dark:ring-green-900 mx-1.5"></div></div>
            <span className="capitalize">{profile.availability?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Skills({ skills }) {
  return (
    <div className="grid md:grid-cols-3 gap-12 items-start">
      <div className="md:col-span-1">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 mb-6 flex items-center gap-3">
          <Terminal className="h-6 w-6 text-gray-400" />
          Compétences
        </h3>
      </div>
      <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
        {skills.map(group => (
          <div key={group.category} className="space-y-4">
            <h4 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-800 pb-2">{group.category_display}</h4>
            <div className="flex flex-wrap gap-2">
              {group.skills.map(skill => (
                <div key={skill.id} className="group relative">
                  <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${skill.is_primary
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    } hover:scale-105 cursor-default`}>
                    {skill.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Experiences({ experiences }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Expériences</h3>
      </div>

      <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-12">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white dark:bg-gray-950 border-4 border-primary-500 group-hover:scale-125 transition-transform"></div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start">
              <div className="w-full md:w-1/3 shrink-0">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{exp.position}</h4>
                <div className="text-primary-600 dark:text-primary-400 font-medium mb-1">{exp.company}</div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  {formatDate(exp.start_date)} - {exp.is_current ? 'Présent' : formatDate(exp.end_date)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                  {exp.location}
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">{exp.experience_type}</Badge>
                </div>
              </div>

              <div className="w-full md:w-2/3 space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {exp.description}
                </p>

                {exp.missions && (
                  <ul className="space-y-2 list-none text-sm text-gray-600 dark:text-gray-400">
                    {exp.missions.split('\n').map((m, i) => m.trim() && (
                      <li key={i} className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0"></div>
                        <span>{m.replace(/^[•-]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {exp.technologies.split(',').map((tech, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Projects({ projects }) {
  const featured = projects.filter(p => p.is_featured)
  const others = projects.filter(p => !p.is_featured)

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          <Code2 className="h-6 w-6" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Projets</h3>
      </div>

      {/* Featured Grid */}
      {featured.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {featured.map(project => (
            <Card key={project.id} className="group overflow-hidden border-0 bg-gray-50 dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              {project.cover_image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{project.title}</h4>
                  <Badge variant={project.status === 'En_cours' ? 'default' : 'secondary'}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies && project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium border border-gray-200 dark:border-gray-700">
                      {tech}
                    </span>
                  ))}
                  {project.technologies && project.technologies.length > 4 && (
                    <span className="px-2 py-1 text-xs text-gray-500">+{project.technologies.length - 4}</span>
                  )}
                </div>

                <div className="pt-4 flex gap-4">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noreferrer" className="text-sm font-medium flex items-center gap-2 hover:text-primary-600 transition-colors">
                      <ExternalLink className="h-4 w-4" /> Voir le site
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-sm font-medium flex items-center gap-2 hover:text-primary-600 transition-colors">
                      <Github className="h-4 w-4" /> Code source
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Other Projects List */}
      {others.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map(project => (
            <div key={project.id} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900 transition-colors">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{project.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-3 text-sm font-medium text-primary-600">
                {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="flex items-center hover:underline"><ExternalLink className="h-3 w-3 mr-1" /> Demo</a>}
                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center hover:underline"><Github className="h-3 w-3 mr-1" /> Code</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Education({ diplomas, certifications, trainings }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Diplômes</h3>
        </div>

        <div className="space-y-6 border-l-2 border-gray-100 dark:border-gray-800 ml-3">
          {diplomas.map(dip => (
            <div key={dip.id} className="pl-6 relative">
              <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary-400"></div>
              <h4 className="font-bold text-gray-900 dark:text-white">{dip.title}</h4>
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">{dip.institution}, {dip.location}</div>
              <div className="text-xs text-gray-500 font-mono mb-2">{dip.start_date} - {dip.end_date}</div>
              {dip.honors && <Badge variant="secondary" className="text-xs">Mention: {dip.honors}</Badge>}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications & Formations</h3>
        </div>

        <div className="space-y-4">
          {[...certifications, ...trainings].sort((a, b) => (b.issue_date || b.start_date) > (a.issue_date || a.start_date) ? 1 : -1).map(item => (
            <div key={item.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name || item.title}</h4>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{item.organization}</div>
              </div>
              <div className="text-xs text-gray-500 text-right">
                {item.issue_date || (item.is_ongoing ? 'En cours' : item.end_date)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Footer({ profile }) {
  return (
    <footer id="contact" className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
            Restons en contact
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            Ouvert aux opportunités et aux échanges. N'hésitez pas à me contacter pour discuter de vos projets.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {(profile?.email) && (
              <li>
                <a href={`mailto:${profile?.email}`} className="hover:text-primary-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {profile?.email}
                </a>
              </li>
            )}
            {profile.phone && (
              <li>
                <a href={`tel:${profile.phone}`} className="hover:text-primary-600 flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {profile.phone}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white">Réseaux</h4>
          <div className="flex gap-4">
            {profile.linkedin_url && <a href={profile.linkedin_url} className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin className="h-5 w-5" /></a>}
            {profile.github_url && <a href={profile.github_url} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Github className="h-5 w-5" /></a>}
            {profile.twitter_url && <a href={profile.twitter_url} className="text-gray-400 hover:text-blue-400 transition-colors"><Globe className="h-5 w-5" /></a>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {profile?.user_full_name}. Tous droits réservés.</p>
      </div>
    </footer>
  )
}