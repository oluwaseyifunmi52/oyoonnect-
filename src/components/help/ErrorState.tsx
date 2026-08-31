import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '../ui/Button'

interface ErrorStateProps {
  title?: string
  message?: string
  actionLabel?: string
  actionHref?: string
  onRetry?: () => void
  showHomeLink?: boolean
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load the content. Please try again.',
  actionLabel = 'Try again',
  actionHref,
  onRetry,
  showHomeLink = true
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">
        <AlertCircle size={48} aria-hidden="true" />
      </div>
      <h2 className="error-state__title">{title}</h2>
      <p className="error-state__message">{message}</p>
      <div className="error-state__actions">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
          >
            <RefreshCw size={18} aria-hidden="true" />
            {actionLabel}
          </Button>
        )}
        {actionHref && (
          <ButtonLink
            to={actionHref}
            variant="outline"
            size="md"
          >
            {actionLabel}
          </ButtonLink>
        )}
        {showHomeLink && (
          <ButtonLink
            to="/"
            variant="ghost"
            size="md"
          >
            <Home size={18} aria-hidden="true" />
            Back to Home
          </ButtonLink>
        )}
      </div>
    </div>
  )
}