import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { HelpIcon } from './IconMapping'
import { Button, ButtonLink } from '../ui/Button'

interface HelpEmptyStateProps {
  title?: string
  description?: string
  primaryAction?: { label: string; to: string }
  secondaryAction?: { label: string; to: string }
  icon?: string
}

export function HelpEmptyState({
  title = 'No active support requests right now',
  description = 'New verified requests will appear here when available.',
  primaryAction = { label: 'Request Help', to: '/help/request' },
  secondaryAction = { label: 'Browse Categories', to: '/help' },
  icon = 'heart',
}: HelpEmptyStateProps) {
  return (
    <div className="help-empty-state">
      <div className="help-empty-state__icon">
        <HelpIcon name={icon} size={48} aria-hidden="true" />
      </div>
      <h3 className="help-empty-state__title">{title}</h3>
      <p className="help-empty-state__description">{description}</p>
      <div className="help-empty-state__actions">
        <ButtonLink to={primaryAction.to} variant="primary" size="lg">
          {primaryAction.label}
        </ButtonLink>
        <ButtonLink to={secondaryAction.to} variant="outline" size="lg">
          {secondaryAction.label}
        </ButtonLink>
      </div>
    </div>
  )
}

export default HelpEmptyState
