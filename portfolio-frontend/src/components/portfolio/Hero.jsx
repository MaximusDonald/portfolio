import { Button } from '@/components/ui'
import { Github, Linkedin, Globe, ChevronRight, Terminal, Zap } from 'lucide-react'

export function Hero({ profile }) {
    if (!profile) return null

    // Get initials from full name or email
    const getInitials = () => {
        if (profile.user_full_name) {
            return profile.user_full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        return 'PA'
    }

    const nameParts = profile.user_full_name?.split(' ') || ['John', 'Doe']
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden bg-[var(--bg-deep)]">
            {/* HUD / Tech Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center animate-reveal">
                {/* Left: Text Content */}
                <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/5">
                        <Zap className="h-4 w-4 fill-emerald-500" />
                        Disponible pour l'innovation
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.95] md:leading-[0.9]">
                            {firstName} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-500 drop-shadow-sm">
                                {lastName}
                            </span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-gray-500 dark:text-gray-400 font-bold max-w-2xl leading-tight tracking-tight uppercase">
                            {profile.professional_title || "Tech Alchemist"}
                        </p>
                    </div>

                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed font-medium font-mono">
                        {`> ${profile.tagline || "Transformer des idées complexes en architectures digitales élégantes."}`}
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                        <a href="#projects">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-10 h-16 text-lg font-black shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all active:scale-95 group">
                                VOIR MES PROJETS
                                <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </a>
                        <div className="flex gap-3">
                            {[
                                { icon: Github, url: profile.github_url },
                                { icon: Linkedin, url: profile.linkedin_url },
                                { icon: Globe, url: profile.website_url }
                            ].map((social, i) => social.url && (
                                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-xl">
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                            <a href="#contact" className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-xl">
                                <Terminal className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right: The Premium Profile Photo */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative group scale-110 lg:scale-125">
                        {/* Complex Glowing Rings */}
                        <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-600/20 to-cyan-600/20 rounded-full opacity-40 blur-[100px] group-hover:opacity-60 transition-opacity duration-1000 animate-pulse-slow"></div>
                        <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600 to-cyan-400 rounded-[3.5rem] md:rounded-[4.5rem] opacity-20 group-hover:opacity-100 transition-all duration-700 rotate-12 group-hover:rotate-0"></div>

                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden border-8 border-white dark:border-neutral-900 bg-gray-100 dark:bg-neutral-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-none">
                            {profile.photo ? (
                                <img
                                    src={profile.photo}
                                    alt={profile.user_full_name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300 dark:text-neutral-700">
                                    {getInitials()}
                                </div>
                            )}

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>

                        {/* Float Experience Badge */}
                        <div className="absolute -bottom-8 -right-8 bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-2xl animate-bounce-slow hidden md:block">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">05+</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Exp</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
