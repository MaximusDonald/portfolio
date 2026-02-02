import { cn } from "@/utils/cn" // ← suppose que tu as cette fonction utilitaire (très courante avec Shadcn)
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"
import { forwardRef } from "react"

const alertVariants = {
  default: "bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",
  destructive: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800/60",
  success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800/60",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800/60",
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800/60",
}

const alertIconVariants = {
  default: <Info className="h-5 w-5" />,
  destructive: <XCircle className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
}

const Alert = forwardRef(
  (
    {
      className,
      variant = "default",
      icon,
      title,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = icon || alertIconVariants[variant] || alertIconVariants.default

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          alertVariants[variant],
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 pt-0.5">{Icon}</div>
          <div className="flex-1 space-y-1">
            {title && (
              <h5 className="font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            <div className="text-sm [&>p]:leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&>p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }