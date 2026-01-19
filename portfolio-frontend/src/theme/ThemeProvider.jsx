import { createContext, useEffect, useState } from 'react'

/**
 * Context pour la gestion du thème (dark/light)
 */
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
})

/**
 * Provider pour le thème
 * Gère la persistance du thème dans localStorage
 * Applique la classe 'dark' sur <html> pour Tailwind
 */
export function ThemeProvider({ children }) {
  // Initialiser le thème depuis localStorage ou système
  const [theme, setThemeState] = useState(() => {
    // 1. Vérifier localStorage
    const stored = localStorage.getItem('portfolio-theme')
    if (stored) return stored

    // 2. Vérifier préférence système
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    // 3. Par défaut : light
    return 'light'
  })

  /**
   * Mettre à jour le thème
   */
  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
  }

  /**
   * Basculer entre dark et light
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  /**
   * Appliquer la classe 'dark' sur <html>
   */
  useEffect(() => {
    const root = window.document.documentElement
    
    // Retirer les deux classes
    root.classList.remove('light', 'dark')
    
    // Ajouter la classe active
    root.classList.add(theme)
  }, [theme])

  /**
   * Écouter les changements de préférence système
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Seulement si l'utilisateur n'a pas défini de préférence manuellement
      if (!localStorage.getItem('portfolio-theme')) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}