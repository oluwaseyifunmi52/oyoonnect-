import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  action?: ReactNode
}

export function ErrorState({
  title = 'Unable to load dashboard',
  description = "Something went wrong while loading your information. Please try again.",
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon" aria-hidden="true"><AlertTriangle size={28} /></div>
      <h2 className="error-state__title">{title}</h2>
      <p className="error-state__description">{description}</p>
      <div className="error-state__actions">
        {onRetry ? (
          <Button variant="primary" size="sm" onClick={onRetry}>Try Again</Button>
        ) : null}
        {action}
      </div>
    </div>
  )
}
