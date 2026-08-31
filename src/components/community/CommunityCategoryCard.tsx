import { Link } from 'react-router-dom'
import {
  MapPin,
  AlertTriangle,
  Car,
  Zap,
  Droplets,
  Trash2,
  Hammer,
  Shield,
  Bus,
  Camera,
  ArrowRight,
} from 'lucide-react'
import type { CommunityCategoryItem } from '../../data/communityCategories'
import type { CommunityCategory } from '../../types/community'
import type { ComponentType } from 'react'

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  MapPin,
  AlertTriangle,
  Car,
  Zap,
  Droplets,
  Trash2,
  Hammer,
  Shield,
  Bus,
  Camera,
}

interface CategoryCardProps {
  category: CommunityCategoryItem
  reportCount?: number
}

export function CommunityCategoryCard({ category, reportCount }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] || MapPin

  return (
    <Link to={category.path} className="category-card" role="listitem">
      <div
        className="category-card__icon"
        style={{ backgroundColor: `${category.color}1A`, color: category.color }}
        aria-hidden="true"
      >
        <Icon size={28} />
      </div>
      <div className="category-card__body">
        <h3 className="category-card__title">{category.name}</h3>
        <p className="category-card__desc">{category.description}</p>
        <div className="category-card__meta">
          {reportCount === undefined ? (
            <span className="category-card__count-muted">No data yet</span>
          ) : reportCount > 0 ? (
            <span className="category-card__count">{reportCount} report{reportCount === 1 ? '' : 's'}</span>
          ) : (
            <span className="category-card__count-muted">No reports yet</span>
          )}
          <ArrowRight size={16} className="category-card__arrow" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}
