import { Skeleton, SkeletonText, SkeletonBadge, SkeletonButton, SkeletonAvatar } from '../../components/ui'

export function JobDetailSkeleton() {
  return (
    <main className="page job-detail-page">
      <div className="container container--narrow">
        <Skeleton className="skeleton--text" style={{ width: 140, marginBottom: 24 }} />

        <article className="job-detail-card">
          <div className="job-detail-card__top">
            <SkeletonAvatar className="job-detail-card__logo" />
            <div className="job-detail-card__title-wrap">
              <SkeletonText className="skeleton--wide" style={{ width: '70%', marginBottom: 8 }} />
              <SkeletonText style={{ width: '40%' }} />
            </div>
            <div className="job-detail-card__badges-skeleton">
              <SkeletonBadge />
              <SkeletonBadge style={{ width: 80 }} />
            </div>
          </div>

          <div className="job-detail-card__meta-skeleton">
            <SkeletonText style={{ width: '25%' }} />
            <SkeletonText style={{ width: '20%' }} />
            <SkeletonText style={{ width: '20%' }} />
            <SkeletonText style={{ width: '15%' }} />
          </div>

          <SkeletonText style={{ width: '50%', marginTop: 16 }} />

          <div className="job-detail-card__actions-skeleton">
            <SkeletonButton />
            <SkeletonButton style={{ width: 80 }} />
            <SkeletonButton style={{ width: 80 }} />
          </div>
        </article>

        <div className="job-detail-content">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="job-detail-section-skeleton">
              <SkeletonText className="skeleton--wide" style={{ width: '30%', marginBottom: 16 }} />
              <SkeletonText className="skeleton--wide" style={{ width: '100%', marginBottom: 12 }} />
              <SkeletonText className="skeleton--wide" style={{ width: '100%', marginBottom: 12 }} />
              <SkeletonText className="skeleton--wide" style={{ width: '80%' }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
