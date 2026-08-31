import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { locations } from '../../data/locations'
import { businessService } from '../../services/businessService'
import { SectionHeading } from '../ui/SectionHeading'

export function PopularLocations() {
  const [locationCounts, setLocationCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const counts = await businessService.getLocationCounts()
        setLocationCounts(counts)
      } catch {
        setLocationCounts({})
      } finally {
        setLoading(false)
      }
    }
    loadCounts()
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
        <SectionHeading
          eyebrow="Find it nearby"
          title="Popular locations"
          subtitle="Businesses across the major cities and towns of Oyo State."
        />
        <div className="location-grid">
          {locations.map((location) => {
            const count = locationCounts[location.name] ?? 0
            return (
              <Link
                key={location.id}
                to={`/search?location=${location.name}`}
                className="location-card"
              >
                <span className="location-card__icon" aria-hidden="true">
                  <MapPin size={22} />
                </span>
                <div className="location-card__content">
                  <span className="location-card__name">{location.name}</span>
                  <span className="location-card__meta">
                    {count} {count === 1 ? 'business' : 'businesses'}
                  </span>
                </div>
                <span className="location-card__tagline">{location.tagline}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}