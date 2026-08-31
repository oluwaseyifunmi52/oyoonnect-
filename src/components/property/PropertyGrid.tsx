import type { Property } from '../../types/rental'
import { PropertyCard } from './PropertyCard'
import { SkeletonCard } from '../ui/Skeleton'

interface PropertyGridProps {
  properties: Property[]
  loading?: boolean
}

export function PropertyGrid({ properties, loading = false }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="property-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="property-grid">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
