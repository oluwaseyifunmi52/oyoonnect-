interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />
}

export function SkeletonCard() {
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