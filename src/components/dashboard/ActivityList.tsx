import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'
import { formatDate } from '../../utils/date'
import type { DashboardSectionState } from '../../hooks/useDashboardData'

export interface ActivityItem {
  id: string
  icon: LucideIcon
  title: string
  description?: string
  meta?: string
  timestamp?: string
  to?: string
  iconColor?: string
}

export interface ActivityListProps {
  items: ActivityItem[]
  loading?: boolean
  error?: string | null
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}

export function ActivityList({
  items,
  loading,
  error,
  emptyIcon,
  emptyTitle = 'No activity yet',
  emptyDescription = 'Your recent activity will appear here.',
  emptyAction,
}: ActivityListProps) {
  if (loading) {
    return (
      <div className="activity-list--skeleton">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="activity-list__skeleton-row">
            <div className="activity-list__skeleton-icon" />
            <div className="activity-list__skeleton-lines">
              <div className="activity-list__skeleton-line activity-list__skeleton-line--title" />
              <div className="activity-list__skeleton-line activity-list__skeleton-line--desc" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="activity-list__error" role="alert">
        <p className="activity-list__error-text">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon ?? <span className="empty-state__icon-mark" aria-hidden="true">•</span>}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <ul className="activity-list">
      {items.map((item) => {
        const timeLabel = item.timestamp ? formatDate(item.timestamp) : item.meta
        const content = (
          <>
            <span className="activity-list__icon" aria-hidden="true" style={{ color: item.iconColor }}>
              <item.icon size={18} />
            </span>
            <span className="activity-list__body">
              <span className="activity-list__title">{item.title}</span>
              {item.description ? <span className="activity-list__desc">{item.description}</span> : null}
            </span>
            {timeLabel ? <span className="activity-list__meta">{timeLabel}</span> : null}
          </>
        )

        return (
          <li key={item.id} className="activity-list__item">
            {item.to ? <a href={item.to} className="activity-list__link">{content}</a> : <div className="activity-list__row">{content}</div>}
          </li>
        )
      })}
    </ul>
  )
}

export type { DashboardSectionState }
