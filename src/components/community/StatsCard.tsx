import type { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  value: string
  label: string
  loading?: boolean
}

export function StatsCard({ icon, value, label, loading = false }: StatsCardProps) {
  return (
    <div className={`stats-card ${loading ? 'stats-card--loading' : ''}`}>
      <div className="stats-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stats-card__content">
        <p className="stats-card__value">{value}</p>
        <p className="stats-card__label">{label}</p>
      </div>
    </div>
  )
}
