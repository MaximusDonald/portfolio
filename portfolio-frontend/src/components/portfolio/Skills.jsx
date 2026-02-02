import { Terminal, Cpu, Layers, Braces, Sparkles } from 'lucide-react'
import { EmptySection } from './EmptySection'

export function Skills({ skills, profile }) {
    const hasSkills = skills && skills.length > 0

    // Map category to icons
    const getIcon = (category) => {
        const cat = category.toLowerCase()
        if (cat.includes('frontend') || cat.includes('language') || cat.includes('langage') || cat.includes('programmation')) return Braces
        if (cat.includes('backend') || cat.includes('ia') || cat.includes('science')) return Cpu
        if (cat.includes('outil')) return Layers
        return Terminal
    }

    // Level configuration with distinct colors
    const levelConfig = {
        'Debutant': { percent: '30%', label: 'Débutant', class: 'bg-slate-400 dark:bg-neutral-600' },
        'Intermediaire': { percent: '60%', label: 'Intermédiaire', class: 'bg-blue-500' },
        'Avance': { percent: '85%', label: 'Avancé', class: 'bg-indigo-500' },
        'Expert': { percent: '100%', label: 'Expert', class: 'bg-gradient-to-r from-emerald-500 to-cyan-400' }
    }

    return (
        <div className="space-y-20 animate-reveal">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    Compétences <span className="text-emerald-500">techniques</span>
                </h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            {!hasSkills ? (
                <EmptySection
                    icon={Sparkles}
                    title="Données non indexées"
                    defaultMessage="La base de données des technologies maîtrisées est actuellement en cours de mise à jour."
                    profileMessage={profile?.empty_skills_text}
                />
            ) : (
                <div className="grid lg:grid-cols-2 gap-10">
                    {skills.map(group => {
                        const Icon = getIcon(group.category)
                        return (
                            <div key={group.category} className="tech-card p-10 md:p-14 group">
                                <div className="flex items-center gap-6 mb-12 border-b border-gray-100 dark:border-neutral-800 pb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-all duration-500 shadow-sm">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h4 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter">{group.category_display}</h4>
                                </div>

                                <div className="space-y-10">
                                    {group.skills.map(skill => {
                                        const cfg = levelConfig[skill.level] || levelConfig['Intermediaire']
                                        return (
                                            <div key={skill.id} className="space-y-4">
                                                <div className="flex justify-between items-end px-1">
                                                    <span className="text-lg font-bold text-gray-700 dark:text-neutral-200 tracking-tight">
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        {cfg.label}
                                                    </span>
                                                </div>

                                                {/* Distinct Level Progress Bar */}
                                                <div className="h-2 w-full bg-gray-100 dark:bg-neutral-900 rounded-full overflow-hidden border border-gray-100/50 dark:border-neutral-800/50">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-[1.5s] ease-out ${cfg.class}`}
                                                        style={{ width: cfg.percent }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
