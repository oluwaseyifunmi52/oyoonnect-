import type { Business } from '../../types/business'
import { BusinessCard } from './BusinessCard'
import { SkeletonCard } from '../ui/Skeleton'

interface BusinessGridProps {
  businesses: Business[]
  loading?: boolean
}

export function BusinessGrid({ businesses, loading = false }: BusinessGridProps) {
  if (loading) {
    return (
      <div className="business-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="business-grid">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  )
}