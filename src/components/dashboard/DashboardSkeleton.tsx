interface DashboardSkeletonProps {
  cards?: number
  sections?: number
}

export function DashboardSkeleton({ cards = 4, sections = 2 }: DashboardSkeletonProps) {
  return (
    <div className="dash-skeleton" aria-hidden="true">
      <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: 320, height: 28 }} />
      <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: 220, marginBottom: 24 }} />

      <div className="dash-skeleton__grid">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="skeleton dashboard-skeleton__card" style={{ height: 96 }} />
        ))}
      </div>

      <div className="dash-skeleton__sections">
        {Array.from({ length: sections }).map((_, i) => (
          <div key={i} className="skeleton dashboard-skeleton__section" style={{ height: 160 }} />
        ))}
      </div>
    </div>
  )
}
