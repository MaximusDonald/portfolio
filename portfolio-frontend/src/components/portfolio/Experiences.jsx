import { Calendar, MapPin, ArrowUpRight, History, Zap, ShieldCheck } from 'lucide-react'
import { EmptySection } from './EmptySection'

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

export function Experiences({ experiences, profile }) {
    const hasExperiences = experiences && experiences.length > 0

    return (
        <div className="space-y-24 animate-reveal">
            <div className="text-center space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-emerald-500">Parcours</h3>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Expériences <span className="text-emerald-500">Pro</span></h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            {!hasExperiences ? (
                <EmptySection
                    icon={History}
                    title="Archive Officielle"
                    defaultMessage="L'historique professionnel n'est pas encore accessible au public."
                    profileMessage={profile?.empty_experience_text}
                />
            ) : (
                <div className="space-y-16 max-w-6xl mx-auto">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="group relative grid lg:grid-cols-12 gap-10">
                            {/* Timeline Info */}
                            <div className="lg:col-span-3">
                                <div className="lg:sticky lg:top-40 space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{formatDate(exp.start_date)}</span>
                                        <div className="w-8 h-px bg-gray-200 dark:bg-neutral-800"></div>
                                        <span className="text-3xl font-black text-emerald-500 tracking-tighter leading-none">{exp.is_current ? 'PRÉSENT' : formatDate(exp.end_date)}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-[10px] font-black text-gray-500 dark:text-neutral-500 uppercase tracking-widest leading-none">
                                        <Zap className="h-3 w-3 text-emerald-500" />
                                        {exp.experience_type || "CORE SYSTEM"}
                                    </div>
                                </div>
                            </div>

                            {/* Work Card */}
                            <div className="lg:col-span-9 tech-card p-10 md:p-14 bg-white dark:bg-neutral-900/40 group-hover:shadow-2xl transition-all duration-500">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-100 dark:border-neutral-800 pb-10 mb-10">
                                    <div className="space-y-4">
                                        <h4 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors uppercase tracking-widest leading-none">{exp.position}</h4>
                                        <div className="flex flex-wrap items-center gap-8">
                                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">{exp.company}</span>
                                            <span className="flex items-center gap-3 text-sm text-gray-400 dark:text-neutral-500 font-black uppercase tracking-widest">
                                                <MapPin className="h-4 w-4 text-emerald-500" />
                                                {exp.location}
                                            </span>
                                        </div>
                                    </div>
                                    {exp.company_url && (
                                        <a href={exp.company_url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-110 transition-all shadow-xl">
                                            <ArrowUpRight className="h-8 w-8" />
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-12">
                                    <p className="text-xl text-gray-500 dark:text-neutral-400 leading-relaxed font-medium italic font-mono">
                                        {`// ${exp.description}`}
                                    </p>

                                    {exp.missions && (
                                        <div className="space-y-8">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-neutral-500 flex items-center gap-3">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Objectifs de Mission
                                            </p>
                                            <ul className="grid md:grid-cols-2 gap-6">
                                                {exp.missions.split('\n').filter(m => m.trim()).map((m, i) => (
                                                    <li key={i} className="flex items-start gap-4 p-6 rounded-[2rem] bg-gray-50/50 dark:bg-neutral-900/30 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800 transition-colors text-sm text-gray-500 dark:text-neutral-400">
                                                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                                        <span className="leading-relaxed">{m.replace(/^[•-]\s*/, '')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {exp.technologies && (
                                        <div className="flex flex-wrap gap-3 pt-10 border-t border-gray-100 dark:border-neutral-900">
                                            {exp.technologies.split(',').map((tech, i) => (
                                                <span key={i} className="px-5 py-2 rounded-2xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-neutral-500 group-hover:text-emerald-500 transition-colors">
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
            )}
        </div>
    )
}
