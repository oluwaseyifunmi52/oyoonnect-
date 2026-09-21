import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

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
        <ChevronRight size={14} />
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
