import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface QuickActionCardProps {
  to?: string
  icon: LucideIcon
  title: string
  description: string
  cta?: string
  onClick?: () => void
}

export function QuickActionCard({ to, icon: Icon, title, description, cta, onClick }: QuickActionCardProps) {
  const inner = (
    <>
      <span className="quick-action__icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <span className="quick-action__body">
        <span className="quick-action__title">{title}</span>
        <span className="quick-action__desc">{description}</span>
      </span>
      <span className="quick-action__cta">
        {cta ?? 'Open'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="quick-action" onClick={onClick}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className="quick-action" onClick={onClick}>
      {inner}
    </button>
  )
}
