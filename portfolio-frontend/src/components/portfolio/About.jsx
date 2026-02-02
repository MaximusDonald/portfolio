import { UserCircle, Zap, Target, Lightbulb, Heart, ShieldCheck } from 'lucide-react'
import { EmptySection } from './EmptySection'

export function About({ profile }) {
    if (!profile) return null

    const hasBio = !!profile.bio
    const hasContact = profile.show_location || profile.show_email || profile.show_phone

    const traits = [
        { icon: Heart, title: profile.trait_1_title || 'Passionné', desc: profile.trait_1_description || 'Fasciné par les systèmes intelligents et leur capacité à résoudre des problèmes complexes.' },
        { icon: Target, title: profile.trait_2_title || 'Déterminé', desc: profile.trait_2_description || 'Toujours en quête de nouveaux défis pour repousser les limites de mes compétences.' },
        { icon: Lightbulb, title: profile.trait_3_title || 'Innovant', desc: profile.trait_3_description || 'Toujours à l\'affût des dernières avancées technologiques.' }
    ]

    return (
        <div className="space-y-24 animate-reveal">
            {/* Centered Heading */}
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                    À propos de <span className="text-emerald-500">moi</span>
                </h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            {!hasBio && !hasContact ? (
                <EmptySection
                    icon={UserCircle}
                    title="Protocole en attente"
                    defaultMessage="Les informations concernant mon parcours sont en cours de synchronisation."
                    profileMessage={profile.empty_about_text}
                />
            ) : (
                <div className="space-y-16 max-w-5xl mx-auto">
                    {/* Traits Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {traits.map((trait, i) => (
                            <div key={i} className="tech-card p-10 flex flex-col items-center text-center space-y-6 group">
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl">
                                    <trait.icon className="h-8 w-8" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{trait.title}</h4>
                                    <p className="text-gray-500 dark:text-neutral-500 text-sm font-medium leading-relaxed">
                                        {trait.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Bio Box */}
                    {hasBio && (
                        <div className="tech-card p-10 md:p-16 relative overflow-hidden group">
                            {/* Visual Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

                            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic">
                                <div dangerouslySetInnerHTML={{ __html: profile.bio?.replace(/\n/g, '<br/>') }} />
                            </div>
                        </div>
                    )}

                    {/* Availability Status */}
                    {profile.availability && (
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-sm shadow-xl">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                Status: {profile.availability.replace('_', ' ')}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
