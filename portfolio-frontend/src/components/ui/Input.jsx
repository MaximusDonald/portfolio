import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

/**
 * Composant Input réutilisable
 * 
 * @param {Object} props
 * @param {string} props.label - Label de l'input
 * @param {string} props.error - Message d'erreur
 * @param {string} props.helperText - Texte d'aide
 * @param {boolean} props.required - Champ requis
 */
export const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border rounded-lg shadow-sm',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-gray-100',
          'border-gray-300 dark:border-gray-600',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'