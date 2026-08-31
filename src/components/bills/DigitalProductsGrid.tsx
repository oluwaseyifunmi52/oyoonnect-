import { Link } from 'react-router-dom'
import { ArrowRight, Monitor, Palette, FileText, Zap, Code } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { DigitalProduct } from '../../types/bills'
import type { LucideIcon } from 'lucide-react'

interface DigitalProductsGridProps {
  products: DigitalProduct[]
}

const categoryIcons: Record<DigitalProduct['category'], LucideIcon> = {
  design: Palette,
  productivity: Monitor,
  writing: FileText,
  video: Zap,
  other: Code,
}

const categoryLabels: Record<DigitalProduct['category'], string> = {
  design: 'Design',
  productivity: 'Productivity',
  writing: 'Writing',
  video: 'Video',
  other: 'Other',
}

export function DigitalProductsGrid({ products }: DigitalProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <Monitor size={48} aria-hidden="true" />
        <h3>No products available</h3>
        <p>Check back later for new digital products.</p>
      </div>
    )
  }

  return (
    <div className="category-grid">
      {products.map((product) => {
        const CategoryIcon = categoryIcons[product.category] || Code
        return (
          <Link key={product.id} to={`/services/digital-products/${product.id}`} className="service-card">
            <div className="service-card__icon" style={{ backgroundColor: '#0066CC20' }}>
              <CategoryIcon size={24} className="service-card__icon-svg" style={{ color: '#0066CC' }} aria-hidden="true" />
            </div>
            <div className="service-card__content">
              <div className="service-card__meta">
                <span className="service-card__category">{categoryLabels[product.category]}</span>
                {product.badge && <span className="service-card__badge">{product.badge}</span>}
              </div>
              <h3 className="service-card__title">{product.name}</h3>
              <p className="service-card__description">{product.description}</p>
              <div className="service-card__features">
                {product.features.slice(0, 3).map((feature, i) => (
                  <span key={i} className="service-card__feature">✓ {feature}</span>
                ))}
              </div>
              <div className="service-card__footer">
                <span className="service-card__price">{formatCurrency(product.price)}</span>
                <span className="service-card__duration">{product.duration}</span>
              </div>
            </div>
            <ArrowRight size={20} className="service-card__arrow" aria-hidden="true" />
          </Link>
        )
      })}
    </div>
  )
}

export default DigitalProductsGrid