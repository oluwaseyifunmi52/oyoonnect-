import { MapPin, Clock, Wrench, Check, Navigation } from 'lucide-react'
import type { Business } from '../../types/business'

interface BusinessInfoProps {
  business: Business
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <div className="profile-info">
      <section className="info-card">
        <h2 className="info-card__title">
          <Wrench size={18} aria-hidden="true" /> Services & offers
        </h2>
        <ul className="info-card__list">
          {business.services.map((service) => (
            <li key={service}>
              <Check size={16} className="info-card__check" aria-hidden="true" />
              {service}
            </li>
          ))}
        </ul>
      </section>

      <section className="info-card">
        <h2 className="info-card__title">
          <Clock size={18} aria-hidden="true" /> Opening hours
        </h2>
        <ul className="info-card__hours">
          {business.openingHours.map((entry) => (
            <li key={entry.days} className="info-card__hour">
              <span>{entry.days}</span>
              <span className="info-card__hour-value">{entry.hours}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="info-card">
        <h2 className="info-card__title">
          <MapPin size={18} aria-hidden="true" /> Location
        </h2>
        <ul className="info-card__location-list">
          {business.locationData?.lga && (
            <li className="info-card__location-item">
              <MapPin size={14} aria-hidden="true" />
              <span><strong>LGA:</strong> {business.locationData.lga}</span>
            </li>
          )}
          {business.locationData?.town && (
            <li className="info-card__location-item">
              <MapPin size={14} aria-hidden="true" />
              <span><strong>Town:</strong> {business.locationData.town}</span>
            </li>
          )}
          {business.locationData?.area && (
            <li className="info-card__location-item">
              <MapPin size={14} aria-hidden="true" />
              <span><strong>Area:</strong> {business.locationData.area}</span>
            </li>
          )}
          {business.locationData?.busStop && (
            <li className="info-card__location-item">
              <MapPin size={14} aria-hidden="true" />
              <span><strong>Nearest Landmark:</strong> {business.locationData.busStop}</span>
            </li>
          )}
          <li className="info-card__location-item">
            <MapPin size={14} aria-hidden="true" />
            <span><strong>Address:</strong> {business.address}</span>
          </li>
          {business.latitude && business.longitude && (
            <li className="info-card__location-item">
              <Navigation size={14} aria-hidden="true" />
              <span>
                <strong>Coordinates:</strong> {business.latitude}, {business.longitude}
              </span>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}