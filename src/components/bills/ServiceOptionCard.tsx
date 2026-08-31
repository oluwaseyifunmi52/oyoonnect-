import { ArrowRight } from 'lucide-react'

interface ServiceOptionCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  image?: string
  onClick: () => void
  disabled?: boolean
  badge?: string
}

export function ServiceOptionCard({
  title,
  subtitle,
  icon,
  image,
  onClick,
  disabled = false,
  badge,
}: ServiceOptionCardProps) {
  return (
    <button
      type="button"
      className={`service-option-card ${disabled ? 'service-option-card--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <div className="service-option-card__icon" aria-hidden="true">
        {image ? (
          <img src={image} alt="" className="service-option-card__image" />
        ) : icon ? (
          <span className="service-option-card__icon-inner">{icon}</span>
        ) : null}
        {badge && <span className="service-option-card__badge">{badge}</span>}
      </div>
      <div className="service-option-card__content">
        <h3 className="service-option-card__label">{title}</h3>
        {subtitle && <p className="service-option-card__description">{subtitle}</p>}
      </div>
      <ArrowRight size={20} className="service-option-card__arrow" aria-hidden="true" />
    </button>
  )
}