/**
 * Utilitaire pour fusionner des classes CSS conditionnellement
 * Combine clsx + tailwind-merge pour éviter les conflits de classes Tailwind
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes CSS avec résolution intelligente des conflits Tailwind
 * 
 * @param {...any} inputs - Classes CSS à fusionner
 * @returns {string} - Classes fusionnées
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'hover:bg-blue-600')
 * // => 'px-4 py-2 bg-blue-500 hover:bg-blue-600'
 * 
 * @example
 * cn('px-4', 'px-8') // Résout le conflit
 * // => 'px-8' (garde seulement la dernière valeur)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}