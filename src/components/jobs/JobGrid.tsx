import { JobCard } from './JobCard'
import type { Job } from '../../types/jobs'

interface JobGridProps {
  jobs?: Job[]
  loading?: boolean
  variant?: 'default' | 'compact' | 'featured'
  columns?: 1 | 2 | 3
  showEmployer?: boolean
  onSaveToggle?: (jobId: string, isSaved: boolean) => void
}

export function JobGrid({
  jobs = [],
  loading = false,
  variant = 'default',
  columns = 3,
  showEmployer = true,
  onSaveToggle,
}: JobGridProps) {
  const gridClass = `job-grid job-grid--cols-${columns}`

  if (loading) {
    return (
      <div
        className={gridClass}
        role="status"
        aria-label="Loading jobs"
      >
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <JobCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return null
  }

  return (
    <div
      className={gridClass}
      role="list"
      aria-label="Job listings"
    >
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          variant={variant}
          showEmployer={showEmployer}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  )
}

function JobCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  if (variant === 'compact') {
    return (
      <div className="job-card job-card--compact skeleton-card">
        <div className="skeleton skeleton--text" style={{ width: '80%', height: '20px', marginBottom: '8px' }} />
        <div className="skeleton skeleton--text" style={{ width: '60%', height: '16px' }} />
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <article className="job-card job-card--featured skeleton-card">
        <div className="job-card__header skeleton-row">
          <div className="skeleton skeleton--circle" style={{ width: '50px', height: '50px' }} />
          <div className="skeleton skeleton--text" style={{ width: '150px', height: '18px' }} />
        </div>
        <div className="skeleton skeleton--text skeleton--wide" style={{ marginTop: '16px' }} />
        <div className="skeleton-row" style={{ marginTop: '16px' }}>
          <div className="skeleton skeleton--text" style={{ width: '120px', height: '16px' }} />
          <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
          <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
        </div>
        <div className="job-card__footer skeleton-row" style={{ marginTop: '20px', justifyContent: 'space-between' }}>
          <div className="skeleton skeleton--text" style={{ width: '80px', height: '16px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton skeleton--circle" style={{ width: '40px', height: '40px' }} />
            <div className="skeleton" style={{ width: '100px', height: '40px', borderRadius: '8px' }} />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="job-card skeleton-card">
      <div className="job-card__header skeleton-row" style={{ marginBottom: '12px' }}>
        <div className="skeleton skeleton--circle" style={{ width: '40px', height: '40px' }} />
        <div>
          <div className="skeleton skeleton--text" style={{ width: '120px', height: '16px', marginBottom: '4px' }} />
          <div className="skeleton skeleton--text" style={{ width: '80px', height: '14px' }} />
        </div>
      </div>
      <div className="skeleton skeleton--text skeleton--wide" style={{ marginBottom: '12px' }} />
      <div className="skeleton-row" style={{ marginBottom: '12px' }}>
        <div className="skeleton skeleton--text" style={{ width: '120px', height: '16px' }} />
        <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
        <div className="skeleton skeleton--text" style={{ width: '90px', height: '16px' }} />
      </div>
      <div className="skeleton-row" style={{ marginBottom: '16px' }}>
        <div className="skeleton skeleton--text" style={{ width: '80px', height: '28px', borderRadius: '4px' }} />
        <div className="skeleton skeleton--text" style={{ width: '70px', height: '28px', borderRadius: '4px' }} />
        <div className="skeleton skeleton--text" style={{ width: '70px', height: '28px', borderRadius: '4px' }} />
      </div>
      <div className="job-card__footer skeleton-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="skeleton skeleton--text" style={{ width: '80px', height: '14px' }} />
          <div className="skeleton skeleton--text" style={{ width: '90px', height: '14px', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="skeleton skeleton--circle" style={{ width: '40px', height: '40px' }} />
          <div className="skeleton" style={{ width: '100px', height: '40px', borderRadius: '8px' }} />
        </div>
      </div>
    </article>
  )
}
