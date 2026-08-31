import { HelpIcon } from './IconMapping'
import { Check } from 'lucide-react'
import type { HelpCategory } from '../../types/help'

interface SupportCategoryCardProps {
  category: HelpCategory
  isSelected?: boolean
  onClick: () => void
}

export function SupportCategoryCard({ category, isSelected, onClick }: SupportCategoryCardProps) {
  return (
    <article
      className={`help-category-card ${isSelected ? 'help-category-card--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div
        className="help-category-card__icon"
        style={{ backgroundColor: `${category.color}15`, color: category.color }}
      >
        <HelpIcon name={category.icon} size={28} aria-hidden="true" />
      </div>
      <div className="help-category-card__content">
        <h3 className="help-category-card__name">{category.name}</h3>
        <p className="help-category-card__description">{category.description}</p>
      </div>
      {isSelected && (
        <span className="help-category-card__check" aria-hidden="true">
          <Check size={16} />
        </span>
      )}
    </article>
  )
}