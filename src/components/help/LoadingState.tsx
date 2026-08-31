import { Skeleton } from '../ui/Skeleton'

interface LoadingStateProps {
  variant?: 'page' | 'card' | 'list'
  count?: number
}

export function LoadingState({ variant = 'page', count = 6 }: LoadingStateProps) {
  if (variant === 'card') {
    return (
      <div className="card card--skeleton">
        <Skeleton className="skeleton--media" />
        <div className="card__body">
          <Skeleton className="skeleton--text skeleton--wide" />
          <Skeleton className="skeleton--text skeleton--mid" />
          <Skeleton className="skeleton--text" />
          <div className="card__actions">
            <Skeleton className="skeleton--btn" />
            <Skeleton className="skeleton--btn" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="loading-state loading-state--list" role="status" aria-label="Loading support requests">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="loading-state__item">
            <div className="loading-state__item-header">
              <Skeleton className="skeleton skeleton--avatar" />
              <div className="loading-state__item-header-text">
                <Skeleton className="skeleton--text skeleton--avatar-name" />
                <Skeleton className="skeleton--text skeleton--avatar-meta" />
              </div>
              <Skeleton className="skeleton skeleton--badge" />
            </div>
            <Skeleton className="skeleton--text skeleton--wide skeleton--margin-y" />
            <Skeleton className="skeleton--text skeleton--mid skeleton--margin-bottom" />
            <Skeleton className="skeleton skeleton--progress" />
            <div className="loading-state__item-footer">
              <Skeleton className="skeleton--text skeleton--footer-item" />
              <Skeleton className="skeleton--text skeleton--footer-item" />
            </div>
            <div className="loading-state__item-actions">
              <Skeleton className="skeleton--btn" />
              <Skeleton className="skeleton--btn" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="page-skeleton" role="status" aria-label="Loading page content">
      <div className="skeleton skeleton--text skeleton--wide skeleton--center" />
      <div className="skeleton skeleton--text skeleton--mid skeleton--center" />
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton skeleton--media skeleton--card" />
        ))}
      </div>
    </div>
  )
}