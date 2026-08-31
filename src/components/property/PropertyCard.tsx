import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Bed, Bath, Square, Heart, CheckCircle2 } from 'lucide-react'
import type { Property } from '../../types/rental'

interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'compact'
  showFavorite?: boolean
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  duplex: 'Duplex',
  bungalow: 'Bungalow',
  terrace: 'Terrace',
  block_of_flats: 'Block of Flats',
  shortlet: 'Shortlet',
  hostel: 'Hostel',
  commercial: 'Commercial',
  office: 'Office',
  shop: 'Shop',
  warehouse: 'Warehouse',
  land: 'Land',
}

const LISTING_TYPE_LABELS: Record<string, string> = {
  rent: 'For Rent',
  sale: 'For Sale',
  shortlet: 'Shortlet',
}

const PRICE_PERIOD_LABELS: Record<string, string> = {
  monthly: '/mo',
  annually: '/yr',
  total: '',
}

export function PropertyCard({ property, variant = 'default', showFavorite = true }: PropertyCardProps) {
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType
  const listingLabel = LISTING_TYPE_LABELS[property.listingType] || property.listingType
  const priceSuffix = PRICE_PERIOD_LABELS[property.pricePeriod] || ''

  return (
    <article className={`card ${variant === 'compact' ? 'card-compact' : ''}`}>
      <Link to={`/rentals/${property.id}`} className="card__media-link">
        <img
          src={property.images.cover}
          alt={property.title}
          className="card__media"
          loading="lazy"
        />
        <div className="card__badges">
          {property.verified && (
            <span className="card__badge card__badge--verified">
              <CheckCircle2 size={12} /> Verified
            </span>
          )}
          <span className="card__badge card__badge--listing-type">
            {listingLabel}
          </span>
          <span className="card__category">{propertyTypeLabel}</span>
        </div>
      </Link>

      <div className="card__body">
        <div className="card__title-row">
          <h3 className="card__title">
            <Link to={`/rentals/${property.id}`}>{property.title}</Link>
          </h3>
        </div>

        <p className="card__location">
          <MapPin size={14} aria-hidden="true" />
          {property.location.busStop ? `${property.location.busStop}, ` : ''}
          {property.location.area ? `${property.location.area}, ` : ''}
          {property.location.lga}
        </p>

        <div className="property-card__features">
          {property.features.bedrooms > 0 && (
            <span className="property-feature">
              <Bed size={14} aria-hidden="true" />
              {property.features.bedrooms} Bed
            </span>
          )}
          {property.features.bathrooms > 0 && (
            <span className="property-feature">
              <Bath size={14} aria-hidden="true" />
              {property.features.bathrooms} Bath
            </span>
          )}
          {property.features.plotSize ? (
            <span className="property-feature">
              <Square size={14} aria-hidden="true" />
              {property.features.plotSize} {property.features.plotSizeUnit || 'sqm'}
            </span>
          ) : null}
        </div>

        <div className="card__footer">
          <p className="property-card__price">
            <span className="property-price__amount">₦{property.price.toLocaleString()}</span>
            <span className="property-price__period">{priceSuffix}</span>
            {property.negotiable && <span className="property-price__negotiable">Negotiable</span>}
          </p>
          <Link
            to={`/rentals/${property.id}`}
            className="btn btn--ghost btn--sm card__details"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
