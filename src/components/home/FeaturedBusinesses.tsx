import { useState, useEffect } from 'react'
import { ButtonLink } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { BusinessGrid } from '../business/BusinessGrid'
import { businessService } from '../../services/businessService'
import { Building2 } from 'lucide-react'
import type { Business } from '../../types/business'

export function FeaturedBusinesses() {
  const [featured, setFeatured] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await businessService.getFeatured()
        setFeatured(data)
      } catch {
        setFeatured([])
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  if (loading) {
    return (
      <section className="section section--tinted">
        <div className="container">
          <div className="section-skeleton" style={{ height: '300px' }} />
        </div>
      </section>
    )
  }

  if (featured.length === 0) {
    return (
      <section className="section section--tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured businesses"
            subtitle="Trusted, top-rated providers our community keeps coming back to."
          />
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true">
              <Building2 size={48} color="var(--brand)" />
            </div>
            <h3 className="empty-state__title">Be one of our first featured businesses</h3>
            <p className="empty-state__description">
              Get your business in front of thousands of customers across Oyo State.
              List your business today and unlock the featured spotlight.
            </p>
            <div className="empty-state__action">
              <ButtonLink to="/owner/add-business" variant="primary" size="lg">
                List your business
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section section--tinted">
      <div className="container">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Featured businesses"
          subtitle="Trusted, top-rated providers our community keeps coming back to."
        />
        <BusinessGrid businesses={featured} />
        <div className="section__action">
          <ButtonLink to="/search" variant="outline" size="md">
            Explore all businesses
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}