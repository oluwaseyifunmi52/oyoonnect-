import { useEffect, useState } from 'react'
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
import { categories } from '../data/categories'
import { businessService } from '../services/businessService'
import { SectionHeading } from '../components/ui/SectionHeading'

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

export function Categories() {
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

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton skeleton--media" style={{ aspectRatio: '4/3', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        <SectionHeading
          eyebrow="Browse by category"
          title="All categories"
          subtitle="Explore all business categories on OyoConnect. From auto repair and catering to healthcare — find trusted businesses and essential services across Oyo State."
        />
        <div className="category-grid">
          {categories.map((category) => {
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
    </main>
  )
}

export default Categories