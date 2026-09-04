import { Link } from 'react-router-dom'
import { ArrowRight, Gamepad2, Smartphone, Monitor, Tv } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { GameProduct } from '../../types/bills'
import type { LucideIcon } from 'lucide-react'

interface GamesGridProps {
  products: GameProduct[]
}

const platformIcons: Record<GameProduct['platform'], LucideIcon> = {
  'google-play': Gamepad2,
  apple: Smartphone,
  steam: Monitor,
  playstation: Tv,
  xbox: Tv,
  other: Gamepad2,
}

const platformLabels: Record<GameProduct['platform'], string> = {
  'google-play': 'Google Play',
  apple: 'Apple',
  steam: 'Steam',
  playstation: 'PlayStation',
  xbox: 'Xbox',
  other: 'Other',
}

const platformColors: Record<GameProduct['platform'], string> = {
  'google-play': '#4285F4',
  apple: '#000000',
  steam: '#1B2838',
  playstation: '#003791',
  xbox: '#107C10',
  other: '#663399',
}

export function GamesGrid({ products }: GamesGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <Gamepad2 size={48} aria-hidden="true" />
        <h3>No games available</h3>
        <p>Check back later for new game vouchers.</p>
      </div>
    )
  }

  return (
    <div className="category-grid">
      {products.map((product) => {
        const PlatformIcon = platformIcons[product.platform] || Gamepad2
        const color = platformColors[product.platform] || '#663399'
        return (
          <Link key={product.id} to={`/services/games/${product.id}`} className="service-card">
            <div className="service-card__icon" style={{ backgroundColor: color + '20' }}>
              <PlatformIcon size={24} className="service-card__icon-svg" style={{ color }} aria-hidden="true" />
            </div>
            <div className="service-card__content">
              <div className="service-card__meta">
                <span className="service-card__category" style={{ color }}>{platformLabels[product.platform]}</span>
              </div>
              <h3 className="service-card__title">{product.name}</h3>
              <p className="service-card__description">{product.description || 'Game voucher for ' + platformLabels[product.platform]}</p>
              <div className="service-card__footer">
                <span className="service-card__price">{formatCurrency(product.price)}</span>
                <span className="service-card__denomination">{product.denomination} {product.currency}</span>
              </div>
            </div>
            <ArrowRight size={20} className="service-card__arrow" aria-hidden="true" />
          </Link>
        )
      })}
    </div>
  )
}

export default GamesGrid

