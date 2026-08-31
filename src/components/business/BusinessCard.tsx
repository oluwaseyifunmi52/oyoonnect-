import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Phone, MessageCircle, Heart, Tag, Navigation } from 'lucide-react'
import type { Business } from '../../types/business'
import { Rating } from '../ui/Rating'
import { formatPhone, telHref } from '../../utils/phone'
import { whatsappHref } from '../../utils/whatsapp'
import { useFavorites } from '../../context/FavoritesContext'

interface BusinessCardProps {
  business: Business
  variant?: 'default' | 'compact'
  showFavorite?: boolean
}

export function BusinessCard({ business, variant = 'default', showFavorite = true }: BusinessCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(business.id)

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleFavorite(business.id)
  }

  const priceRangeLabels: Record<string, string> = {
    '#': 'Budget',
    '##': 'Moderate',
    '###': 'Expensive',
    '####': 'Premium',
  }

  return (
    <article className={`card ${variant === 'compact' ? 'card-compact' : ''}`}>
      <Link to={`/business/${business.id}`} className="card__media-link">
        <img
          src={business.image}
          alt={business.name}
          className="card__media"
          loading="lazy"
        />
        <div className="card__badges">
          {business.verified && (
            <span className="card__badge card__badge--verified">
              <BadgeCheck size={12} /> Verified
            </span>
          )}
          {business.priceRange && (
            <span className="card__badge card__badge--price">
              <Tag size={12} /> {priceRangeLabels[business.priceRange] || business.priceRange}
            </span>
          )}
          <span className="card__category">{business.category}</span>
        </div>
      </Link>

      <div className="card__body">
        <div className="card__title-row">
          <h3 className="card__title">
            <Link to={`/business/${business.id}`}>{business.name}</Link>
          </h3>
          <div className="card__title-actions">
            <Rating value={business.rating} reviewCount={business.reviewCount} size="sm" />
            {showFavorite && (
              <button
                type="button"
                onClick={handleFavoriteClick}
                className={`btn btn-ghost btn-sm favorite-btn ${favorite ? 'favorited' : ''}`}
                aria-label={favorite ? `Remove ${business.name} from favorites` : `Add ${business.name} to favorites`}
                aria-pressed={favorite}
              >
                <Heart size={16} className={favorite ? 'filled' : ''} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <p className="card__location">
          <MapPin size={14} aria-hidden="true" />
          {business.locationData?.busStop ? `${business.locationData.busStop}, ` : ''}
          {business.area ? `${business.area}, ` : ''}{business.location}
        </p>

        <p className="card__description">{business.description}</p>

        <div className="card__actions">
          <a
            href={telHref(business.phone)}
            className="btn btn--outline btn--sm"
            aria-label={`Call ${business.name} on ${formatPhone(business.phone)}`}
          >
            <Phone size={15} />
            Call
          </a>
          <a
            href={whatsappHref(
              business.whatsapp,
              `Hello ${business.name}, I found you on OyoConnect.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp btn--sm"
            aria-label={`Message ${business.name} on WhatsApp`}
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
          {business.latitude && business.longitude && (
            <a
              href={`/business/${business.id}`}
              className="btn btn--ghost btn--sm card__details"
              aria-label={`View ${business.name} on map`}
            >
              <Navigation size={14} />
              View Map
            </a>
          )}
          <Link
            to={`/business/${business.id}`}
            className="btn btn--ghost btn--sm card__details"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}