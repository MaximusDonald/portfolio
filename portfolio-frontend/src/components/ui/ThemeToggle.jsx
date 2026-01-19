import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

/**
 * Toggle pour basculer entre mode clair et sombre
 */
export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}

/**
 * Version switch avec animation
 */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform',
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        )}
      >
        {theme === 'light' ? (
          <Sun className="h-6 w-6 p-1 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 p-1 text-blue-400" />
        )}
      </span>
    </button>
  )
}