import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { ServiceCategory } from '../../types/bills'

interface ServiceCardProps {
  service: ServiceCategory
  variant?: 'default' | 'compact'
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
  return (
    <Link to={service.path} className={`service-card ${variant === 'compact' ? 'service-card--compact' : ''}`}>
      <div className="service-card__icon" style={{ backgroundColor: service.color + '20' }}>
        <i className={`service-card__icon-svg`} data-lucide={service.icon} style={{ color: service.color }} />
      </div>
      <div className="service-card__content">
        <h3 className="service-card__title">{service.name}</h3>
        <p className="service-card__description">{service.description}</p>
        {service.startingPrice && (
          <span className="service-card__price">
            From {formatCurrency(service.startingPrice)}
          </span>
        )}
      </div>
      <ArrowRight size={20} className="service-card__arrow" aria-hidden="true" />
    </Link>
  )
}