import { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui'
import { Github, Linkedin, Mail, Menu, X, ChevronRight } from 'lucide-react'

/**
 * Header du site public - Sophisticated & Responsive
 */
function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { slug } = useParams()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: `#about`, label: 'SYSTÈME' },
    { path: `#skills`, label: 'MAÎTRISE' },
    { path: `#experience`, label: 'ARCHIVES' },
    { path: `#projects`, label: 'LAB' },
    { path: `#education`, label: 'ACADÉMIE' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl transition-all duration-700`}>
      <header className={`rounded-3xl transition-all duration-700 overflow-hidden border ${scrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-gray-200 dark:border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4'
          : 'bg-transparent py-6'
        }`}>
        <div className="px-10 flex items-center justify-between">
          <Link to={slug ? `/${slug}` : '/'} className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-black text-2xl shadow-2xl transition-all group-hover:bg-emerald-500 group-hover:dark:bg-emerald-500 group-hover:rotate-12 group-hover:text-white">
              T
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              TECH <span className="text-emerald-500">ALCHEMIST</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-px bg-gray-100 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-1">
            {navLinks.map((link) => {
              const isActive = location.hash === link.path
              return (
                <a
                  key={link.path}
                  href={link.path}
                  className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${isActive
                      ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-900 dark:text-neutral-500 dark:hover:text-white'
                    }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:flex items-center px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white dark:text-black bg-gray-900 dark:bg-white border border-gray-800 dark:border-white rounded-xl hover:bg-emerald-500 hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:border-emerald-500 transition-all active:scale-95"
            >
              ACCÈS SESSION
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-neutral-900 animate-slide-in">
            <nav className="flex flex-col p-8 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-5 text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-neutral-400 hover:text-emerald-500 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-2xl transition-all"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4" />
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center w-full px-8 py-5 mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-white bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20"
              >
                SYNCHRONISER SESSION
              </Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  )
}

/**
 * Footer du site public - Balanced & Clean
 */
function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[var(--bg-deep)] border-t border-gray-100 dark:border-neutral-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto py-32 px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-12 flex flex-col items-center text-center space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-black font-black text-3xl">
                T
              </div>
              <span className="text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                TECH <span className="text-emerald-500">ALCHEMIST.</span>
              </span>
            </div>
            <p className="text-gray-500 dark:text-neutral-500 max-w-lg text-xl font-medium leading-relaxed font-mono italic">
              {`// Transformer des idées complexes en architectures digitales élégantes et performantes.`}
            </p>
            <div className="flex items-center gap-10">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all hover:scale-125"><Github className="h-8 w-8" /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all hover:scale-125"><Linkedin className="h-8 w-8" /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-all hover:scale-125"><Mail className="h-8 w-8" /></a>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-gray-100 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
            © {currentYear} TECH ALCHEMIST • ENGINE V1.0.4 • ESTABLISHED 2024
          </p>
          <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[.3em] text-gray-400">
            <span className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              DATABASE: SYNC
            </span>
            <span className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">POLITIQUES_RÉSEAU</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Layout complet - Enhanced Visibility
 */
export function PublicLayout({ children }) {
  const publicTemplate = arguments?.[0]?.publicTemplate || 'tech_alchemist'

  return (
    <div className={`min-h-screen flex flex-col bg-[var(--bg-deep)] transition-colors duration-700 public-template-${publicTemplate}`}>
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
