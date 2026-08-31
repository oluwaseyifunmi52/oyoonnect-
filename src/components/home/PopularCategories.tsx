import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench,
  Utensils,
  Sparkles,
  GraduationCap,
  Hammer,
  Shirt,
  Pill,
  Camera,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { categories } from '../../data/categories'
import { businessService } from '../../services/businessService'
import { SectionHeading } from '../ui/SectionHeading'
import { ButtonLink } from '../ui/Button'

const categoryIcons: Record<string, LucideIcon> = {
  wrench: Wrench,
  utensils: Utensils,
  sparkles: Sparkles,
  'graduation-cap': GraduationCap,
  hammer: Hammer,
  shirt: Shirt,
  pill: Pill,
  camera: Camera,
}

const POPULAR_CATEGORY_SLUGS = [
  'plumbing',
  'electrical',
  'catering',
  'barbing',
  'makeup',
  'auto-wash',
  'carpentry',
]

export function PopularCategories() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const counts = await businessService.getCategoryCounts()
        setCategoryCounts(counts)
      } catch {
        setCategoryCounts({})
      } finally {
        setLoading(false)
      }
    }
    loadCounts()
  }, [])

  const popularCategories = useMemo(() => {
    return POPULAR_CATEGORY_SLUGS
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter((c): c is typeof categories[0] => c !== undefined)
  }, [])

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-skeleton" style={{ height: '200px' }} />
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="popular-categories-header">
          <SectionHeading
            eyebrow="Browse by category"
            title="Popular categories"
            subtitle="From auto repair and catering to healthcare — find trusted businesses and essential services across Oyo State."
          />
          <ButtonLink to="/categories" variant="outline" size="md">
            View all categories <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <div className="category-grid">
          {popularCategories.map((category) => {
            const Icon = categoryIcons[category.icon] ?? Sparkles
            const count = categoryCounts[category.name] ?? 0
            return (
              <Link
                key={category.id}
                to={`/search?category=${category.slug}`}
                className="category-card"
              >
                <span className="category-card__icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
                <span className="category-card__body">
                  <span className="category-card__name">{category.name}</span>
                  {count > 0 && (
                    <span className="category-card__meta">
                      {count} {count === 1 ? 'business' : 'businesses'}
                    </span>
                  )}
                </span>
                <ArrowRight size={18} className="category-card__arrow" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}