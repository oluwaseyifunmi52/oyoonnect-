import type { ReactNode } from 'react'
import { ButtonLink } from '../ui/Button'
import { Plus } from 'lucide-react'

interface CommunityEmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionTo?: string
  icon?: ReactNode
}

export function CommunityEmptyState({
  title = 'No reports yet',
  description = 'Be the first to report an issue in your area.',
  actionLabel = 'Report an Issue',
  actionTo = '/community/report',
  icon = null,
}: CommunityEmptyStateProps) {
  return (
    <div className="empty-state--community">
      {icon}
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      <ButtonLink to={actionTo} variant="primary">
        <Plus size={18} />
        {actionLabel}
      </ButtonLink>
    </div>
  )
}
