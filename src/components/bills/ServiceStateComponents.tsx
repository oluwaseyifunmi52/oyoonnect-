import { Wifi, Smartphone, Zap, Tv, GraduationCap, Key, Monitor, Gamepad2, Share2, Heart, AlertTriangle, Loader2, RefreshCw, SearchX } from 'lucide-react'
import { Button, ButtonLink } from '../ui/Button'

interface ServiceStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function ServiceUnavailable({ title, description, icon, action }: ServiceStateProps) {
  return (
    <div className="service-state service-state--unavailable" role="status">
      <div className="service-state__icon" aria-hidden="true">
        {icon || <AlertTriangle size={48} />}
      </div>
      <h3 className="service-state__title">{title || 'Service Currently Unavailable'}</h3>
      <p className="service-state__description">
        {description || 'This service is not connected to a provider yet. Live products and pricing will appear once OyoConnect connects to a VTU service provider.'}
      </p>
      {action && <div className="service-state__action">{action}</div>}
    </div>
  )
}

export function ServiceEmpty({ title, description, icon, action }: ServiceStateProps) {
  return (
    <div className="service-state service-state--empty" role="status">
      <div className="service-state__icon" aria-hidden="true">
        {icon || <SearchX size={48} />}
      </div>
      <h3 className="service-state__title">{title || 'No services available'}</h3>
      <p className="service-state__description">
        {description || 'No services are currently available. Please check back later.'}
      </p>
      {action && <div className="service-state__action">{action}</div>}
    </div>
  )
}

export function ServiceError({ title, description, icon, action, onRetry }: ServiceStateProps & { onRetry?: () => void }) {
  return (
    <div className="service-state service-state--error" role="alert">
      <div className="service-state__icon" aria-hidden="true">
        {icon || <AlertTriangle size={48} />}
      </div>
      <h3 className="service-state__title">{title || 'Unable to load service'}</h3>
      <p className="service-state__description">
        {description || 'We couldn\'t load this service right now. Please try again later.'}
      </p>
      {action && <div className="service-state__action">{action}</div>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="service-state__retry">
          <RefreshCw size={18} aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export function ServiceLoading({ title, description, icon }: ServiceStateProps) {
  return (
    <div className="service-state service-state--loading" role="status" aria-label={title || 'Loading service'}>
      <div className="service-state__icon service-state__icon--loading" aria-hidden="true">
        {icon || <Loader2 size={48} />}
      </div>
      <h3 className="service-state__title">{title || 'Loading available services...'}</h3>
      <p className="service-state__description">
        {description || 'Please wait while we fetch the latest services and pricing.'}
      </p>
    </div>
  )
}

export function ServicePageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <header className="service-page-header">
      <div className="container container--narrow">
        <div className="service-page-header__eyebrow">{eyebrow}</div>
        <h1 className="service-page-header__title">{title}</h1>
        {subtitle && <p className="service-page-header__subtitle">{subtitle}</p>}
      </div>
    </header>
  )
}