import { useContext } from 'react'
import { ThemeContext } from '@/theme/ThemeProvider'

/**
 * Hook pour accéder au thème
 * 
 * @returns {Object} - { theme, setTheme, toggleTheme, isDark }
 * 
 * @example
 * const { theme, toggleTheme, isDark } = useTheme()
 * 
 * return (
 *   <button onClick={toggleTheme}>
 *     Mode: {isDark ? 'Sombre' : 'Clair'}
 *   </button>
 * )
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de ThemeProvider')
  }
  
  return context
}