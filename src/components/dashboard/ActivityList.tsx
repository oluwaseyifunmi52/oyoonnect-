import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'

export interface ActivityItem {
  id: string
  icon: LucideIcon
  title: string
  description?: string
  meta?: string
  to?: string
}

interface ActivityListProps {
  items: ActivityItem[]
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}

export function ActivityList({
  items,
  emptyIcon,
  emptyTitle = 'No activity yet',
  emptyDescription = 'Your recent activity will appear here.',
  emptyAction,
}: ActivityListProps) {
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
        const content = (
          <>
            <span className="activity-list__icon" aria-hidden="true"><item.icon size={18} /></span>
            <span className="activity-list__body">
              <span className="activity-list__title">{item.title}</span>
              {item.description ? <span className="activity-list__desc">{item.description}</span> : null}
            </span>
            {item.meta ? <span className="activity-list__meta">{item.meta}</span> : null}
          </>
        )
        return (
          <li key={item.id} className="activity-list__item">
            {item.to ? <a href={item.to} className="activity-list__link">{content}</a> : content}
          </li>
        )
      })}
    </ul>
  )
}
