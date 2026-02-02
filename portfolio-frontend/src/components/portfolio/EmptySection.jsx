import { Info } from 'lucide-react'

export function EmptySection({ title, defaultMessage, profileMessage, icon: Icon = Info }) {
    const displayMessage = profileMessage || defaultMessage

    return (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-[3rem] bg-gray-50 dark:bg-neutral-900/40 border border-dashed border-gray-200 dark:border-neutral-800 transition-all duration-700 hover:border-emerald-500/20 group">
            <div className="w-20 h-20 mb-8 rounded-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Icon className="h-10 w-10" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-[0.2em]">{title}</h4>
            <p className="text-gray-500 dark:text-neutral-400 max-w-lg font-medium leading-relaxed italic text-lg">
                {displayMessage}
            </p>
        </div>
    )
}
