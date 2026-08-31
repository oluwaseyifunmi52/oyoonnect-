import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

interface OpportunityTypeCardProps {
  icon: ReactNode
  title: string
  description: string
  to: string
}

export function OpportunityTypeCard({
  icon,
  title,
  description,
  to,
}: OpportunityTypeCardProps) {
  return (
    <Link to={to} className="opportunity-card">
      <div className="opportunity-card__icon-wrap" aria-hidden="true">
        {icon}
      </div>
      <div className="opportunity-card__body">
        <h3 className="opportunity-card__title">{title}</h3>
        <p className="opportunity-card__desc">{description}</p>
      </div>
      <ArrowUpRight size={18} className="opportunity-card__arrow" aria-hidden="true" />
    </Link>
  )
}
