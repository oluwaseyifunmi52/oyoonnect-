import { MapPin } from 'lucide-react'
import type { Business } from '../../types/business'
import { Badge } from '../ui/Badge'
import { Rating } from '../ui/Rating'
import { ContactButtons } from './ContactButtons'

interface BusinessHeaderProps {
  business: Business
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <div className="profile-header">
      <div className="profile-header__meta">
        <Badge tone="brand">{business.category}</Badge>
        {business.verified ? <Badge tone="verified">Verified</Badge> : null}
      </div>

      <h1 className="profile-header__name">{business.name}</h1>

      <div className="profile-header__row">
        <Rating value={business.rating} reviewCount={business.reviewCount} />
        <span className="profile-header__dot" aria-hidden="true" />
        <p className="profile-header__location">
          <MapPin size={16} aria-hidden="true" />
          {business.location}, Oyo State
        </p>
      </div>

      <p className="profile-header__description">{business.description}</p>

      <ContactButtons business={business} />
    </div>
  )
}