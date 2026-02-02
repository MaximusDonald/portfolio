import { Code2, ExternalLink, Github, ArrowRight, FolderSearch, Star, Rocket } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { EmptySection } from './EmptySection'

export function Projects({ projects, profile }) {
    const hasProjects = projects && projects.length > 0

    const featured = hasProjects ? projects.filter(p => p.is_featured) : []
    const others = hasProjects ? projects.filter(p => !p.is_featured) : []

    return (
        <div className="space-y-24 animate-reveal">
            <div className="text-center space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-emerald-500">Laboratoire</h3>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Projets <span className="text-emerald-500">Sélectionnés</span></h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            {!hasProjects ? (
                <EmptySection
                    icon={FolderSearch}
                    title="Terminal Vide"
                    defaultMessage="Aucun projet n'est actuellement indexé dans ce répertoire."
                    profileMessage={profile?.empty_projects_text}
                />
            ) : (
                <div className="space-y-32">
                    {featured.map((project, idx) => (
                        <div key={project.id} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center group`}>
                            {/* Project Visual */}
                            <div className="flex-1 w-full relative">
                                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                                    {project.cover_image ? (
                                        <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
                                            <Rocket className="h-20 w-20 text-gray-200 dark:text-neutral-800 group-hover:text-emerald-500 transition-colors duration-500" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                                        <div className="flex gap-4">
                                            {project.github_url && <a href={project.github_url} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-500 hover:scale-110 transition-all"><Github className="h-6 w-6" /></a>}
                                            {project.url && <a href={project.url} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-500 hover:scale-110 transition-all"><ExternalLink className="h-6 w-6" /></a>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="flex-1 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-widest leading-none">
                                            {project.status?.replace('_', ' ') || "ACTIVE"}
                                        </span>
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Priority</span>
                                        </div>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none group-hover:text-emerald-500 transition-colors">
                                        {project.title}
                                    </h3>
                                </div>

                                <p className="text-xl text-gray-500 dark:text-neutral-400 font-medium leading-relaxed font-mono">
                                    {`// ${project.description}`}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {project.technologies && project.technologies.slice(0, 6).map((tech, i) => (
                                        <span key={i} className="px-5 py-2 bg-gray-50 dark:bg-neutral-900 rounded-2xl text-[10px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest border border-gray-200 dark:border-neutral-800 group-hover:border-emerald-500/30 transition-colors">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <Button variant="outline" className="rounded-2xl border-2 border-gray-200 dark:border-neutral-800 px-10 h-16 bg-transparent text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs hover:border-emerald-500 hover:bg-emerald-500 hover:text-white dark:hover:text-black transition-all group-hover:shadow-xl group-hover:shadow-emerald-500/10">
                                        EXPLORER <ArrowRight className="ml-3 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Grid for minor projects */}
            {others.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8 pt-24 border-t border-gray-100 dark:border-neutral-900">
                    {others.map(project => (
                        <div key={project.id} className="group tech-card p-10 h-full flex flex-col bg-white dark:bg-neutral-900">
                            <h4 className="font-black text-xl text-gray-900 dark:text-white mb-4 uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{project.title}</h4>
                            <p className="text-gray-500 dark:text-neutral-500 mb-10 line-clamp-3 font-medium text-sm leading-relaxed grow">{project.description}</p>
                            <div className="flex items-center gap-6 mt-auto">
                                {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500 hover:opacity-70 flex items-center gap-2">Live Access <ExternalLink className="h-4 w-4" /></a>}
                                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-2">Source <Github className="h-4 w-4" /></a>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
