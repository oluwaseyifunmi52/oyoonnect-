import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton'

interface StatCardProps {
  label: string
  value: string | number | null
  icon: LucideIcon
  loading?: boolean
  /** Shown instead of the value when there is no data. Defaults to "—". */
  emptyValue?: string
  /** Secondary line under the value. */
  hint?: string
}

export function StatCard({ label, value, icon: Icon, loading, emptyValue = '—', hint }: StatCardProps) {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="stat-card__header">
          <span className="stat-card-title">{label}</span>
          <span className="stat-card-icon"><Icon size={18} aria-hidden="true" /></span>
        </div>
        <Skeleton className="skeleton--text skeleton--mid" />
      </div>
    )
  }

  const hasValue = value !== null && value !== '' && value !== undefined
  const display = hasValue ? value : emptyValue

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card-title">{label}</span>
        <span className="stat-card-icon"><Icon size={18} aria-hidden="true" /></span>
      </div>
      <div className={`stat-card-value ${hasValue ? '' : 'is-empty'}`}>{display}</div>
      {hint ? <div className="stat-card-trend">{hint}</div> : null}
    </div>
  )
}
