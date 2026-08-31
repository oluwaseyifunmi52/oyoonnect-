import { ServiceCard } from './ServiceCard'
import type { ServiceCategory } from '../../types/bills'

interface ServiceGridProps {
  services: ServiceCategory[]
  columns?: 2 | 3 | 4
}

export function ServiceGrid({ services, columns = 3 }: ServiceGridProps) {
  return (
    <div className={`service-grid service-grid--${columns}-col`}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}