import { cn } from '@/utils/cn'

/**
 * Composant Card - Conteneur avec style unifié
 */
export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Header
 */
export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Title
 */
export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * Card Description
 */
export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * Card Content
 */
export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Footer
 */
export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50', className)}
      {...props}
    >
      {children}
    </div>
  )
}