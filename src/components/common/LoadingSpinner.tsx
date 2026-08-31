import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className = '', label = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  }

  return (
    <div className={`loading-spinner flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
      <Loader2 className={`animate-spin text-brand ${sizeClasses[size]}`} aria-hidden="true" />
      {label && <span className="text-sm text-subtle">{label}</span>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="page-loader flex flex-col items-center justify-center min-h-[400px] gap-6">
      <LoadingSpinner size="lg" label="Loading businesses..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-skeleton">
            <div className="skeleton skeleton-media" />
            <div className="p-4 space-y-3">
              <div className="skeleton skeleton-text skeleton-wide" />
              <div className="skeleton skeleton-text skeleton-mid" />
              <div className="skeleton skeleton-text" />
              <div className="flex gap-2 mt-2">
                <div className="skeleton skeleton-btn" />
                <div className="skeleton skeleton-btn" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}