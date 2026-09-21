import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton'

interface StatCardProps {
  label: string
  value: string | number | null
  icon: LucideIcon
  loading?: boolean
  hint?: string
}

export function StatCard({ label, value, icon: Icon, loading, hint }: StatCardProps) {
  if (loading) {
    return (
      <div className="stat-card stat-card--loading">
        <div className="stat-card__header">
          <span className="stat-card-title">{label}</span>
          <span className="stat-card-icon"><Icon size={18} aria-hidden="true" /></span>
        </div>
        <Skeleton className="skeleton--text" style={{ width: 60, height: 24 }} />
      </div>
    )
  }

  const hasValue = value !== null && value !== '' && value !== undefined

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card-title">{label}</span>
        <span className="stat-card-icon"><Icon size={18} aria-hidden="true" /></span>
      </div>
      <div className="stat-card-value">
        {hasValue ? value : <span className="stat-card-value--empty">—</span>}
      </div>
      {hint ? <div className="stat-card-hint">{hint}</div> : null}
    </div>
  )
}
