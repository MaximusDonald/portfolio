import { GraduationCap, Award, CheckCircle2, BookOpen } from 'lucide-react'
import { EmptySection } from './EmptySection'

export function Education({ diplomas = [], certifications = [], trainings = [], profile }) {
    const hasContent = diplomas.length > 0 || certifications.length > 0 || trainings.length > 0

    return (
        <div className="space-y-24 animate-reveal">
            <div className="text-center space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-emerald-500">Académie</h3>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Formation <span className="text-emerald-500">& Certificats</span></h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            {!hasContent ? (
                <EmptySection
                    icon={BookOpen}
                    title="Protocole Académique"
                    defaultMessage="L'historique des certifications et diplômes est en cours de validation."
                    profileMessage={profile?.empty_education_text}
                />
            ) : (
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Diplomas Timeline */}
                    <div className="space-y-12">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
                            <GraduationCap className="h-6 w-6 text-emerald-500" /> Diplômes
                        </h4>

                        <div className="space-y-12 relative pl-8">
                            {/* Central Timeline Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100 dark:bg-neutral-800"></div>

                            {diplomas.map(dip => (
                                <div key={dip.id} className="relative group">
                                    {/* Pulsing Dot */}
                                    <div className="absolute left-[-36px] top-0 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] group-hover:scale-150 transition-transform duration-500"></div>

                                    <div className="space-y-5 tech-card p-10 bg-white dark:bg-neutral-900 group-hover:shadow-2xl transition-all">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-500 px-3 py-1 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-neutral-800">
                                                {dip.start_date.split('-')[0]} — {dip.end_date.split('-')[0]}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                                                {dip.title}
                                            </h4>
                                            <p className="text-lg font-bold text-gray-500 dark:text-neutral-400">{dip.institution}</p>
                                        </div>

                                        {dip.honors && (
                                            <div className="inline-flex items-center gap-3 text-amber-600 dark:text-amber-500 px-4 py-2 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                                                <Award className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Mention {dip.honors}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications Grid */}
                    <div className="space-y-12">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" /> Certifications
                        </h4>

                        <div className="grid sm:grid-cols-1 gap-6">
                            {[...certifications, ...trainings].sort((a, b) => (b.issue_date || b.start_date) > (a.issue_date || a.start_date) ? 1 : -1).map(item => (
                                <div key={item.id} className="group flex items-start gap-6 p-8 bg-gray-50/50 dark:bg-neutral-900/50 rounded-[2rem] border border-gray-100 dark:border-neutral-800 hover:border-emerald-500/20 hover:bg-white dark:hover:bg-neutral-900 transition-all shadow-sm">
                                    <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight uppercase tracking-tight group-hover:text-emerald-500 transition-colors uppercase">{item.name || item.title}</h4>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500">
                                            {item.organization || item.institution} • {item.issue_date || (item.is_ongoing ? 'EN COURS' : item.end_date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
