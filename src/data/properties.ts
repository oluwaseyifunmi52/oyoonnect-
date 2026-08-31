import type { Property, PropertyFilters, PropertyType, PropertyStatus } from '../types/rental'

function createProperty(overrides: Partial<Property>): Property {
  return {
    id: overrides.id || `prop-${Math.random().toString(36).slice(2, 10)}`,
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 0,
    pricePeriod: 'monthly',
    negotiable: false,
    location: {
      state: 'Oyo',
      lga: '',
      town: '',
      area: '',
      busStop: '',
      address: '',
      latitude: 7.4333,
      longitude: 3.9,
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      toilets: 1,
      livingRooms: 1,
      kitchens: 1,
      floors: 1,
      propertyCondition: 'good',
    },
    amenities: {
      water: true,
      electricity: true,
      security: false,
      parking: false,
      generator: false,
      solar: false,
      internet: false,
      airConditioning: false,
      furnished: false,
      wardrobe: false,
      kitchen: true,
      bathroom: 'private',
      balcony: false,
      compound: false,
      fence: false,
      gate: false,
    },
    images: {
      cover: '',
      gallery: [],
      coverPreview: '',
      galleryPreviews: [],
    },
    status: 'active',
    verified: false,
    featured: false,
    ownerId: '',
    ownerName: '',
    ownerPhone: '',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export const properties: Property[] = []


export function propertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function getPropertiesByOwner(ownerId: string): Property[] {
  return properties.filter((p) => p.ownerId === ownerId)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured && (p.status === 'active' || p.status === 'verified'))
}

export function getRecentProperties(limit: number = 10): Property[] {
  return [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function searchProperties(filters: PropertyFilters): Property[] {
  return properties.filter((property) => {
    if (filters.query) {
      const q = filters.query.toLowerCase()
      if (
        !property.title.toLowerCase().includes(q) &&
        !property.description.toLowerCase().includes(q) &&
        !property.location.address.toLowerCase().includes(q)
      ) {
        return false
      }
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) return false
    if (filters.listingType && property.listingType !== filters.listingType) return false
    if (filters.location && property.location.lga.toLowerCase() !== filters.location.toLowerCase() &&
        property.location.town.toLowerCase() !== filters.location.toLowerCase()) return false
    if (filters.area && property.location.area !== filters.area) return false
    if (filters.busStop && property.location.busStop !== filters.busStop) return false
    if (filters.minPrice !== undefined && property.price < filters.minPrice) return false
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) return false
    if (filters.bedrooms !== undefined && property.features.bedrooms < filters.bedrooms) return false
    if (filters.bathrooms !== undefined && property.features.bathrooms < filters.bathrooms) return false
    if (filters.verified !== undefined && property.verified !== filters.verified) return false
    if (filters.featured !== undefined && property.featured !== filters.featured) return false
    if (filters.furnished !== undefined && property.amenities.furnished !== filters.furnished) return false
    if (filters.status && property.status !== filters.status) return false
    return true
  })
}

export function sortProperties(items: Property[], sortBy: string): Property[] {
  const sorted = [...items]
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'bedrooms':
      return sorted.sort((a, b) => b.features.bedrooms - a.features.bedrooms)
    case 'price-per-sqm':
      return sorted.sort((a, b) => {
        const plotA = a.features.plotSize || 100
        const plotB = b.features.plotSize || 100
        const pricePerSqmA = a.price / plotA
        const pricePerSqmB = b.price / plotB
        return pricePerSqmA - pricePerSqmB
      })
    default:
      return sorted
  }
}

export function paginateProperties<T>(
  items: T[],
  page: number,
  itemsPerPage: number
): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  return {
    items: items.slice(start, end),
    totalPages,
    totalItems,
  }
}

export function incrementViews(id: string): void {
  const property = properties.find((p) => p.id === id)
  if (property) {
    property.views += 1
    property.updatedAt = new Date().toISOString()
  }
}

export function incrementInquiries(id: string): void {
  const property = properties.find((p) => p.id === id)
  if (property) {
    property.inquiryCount += 1
    property.updatedAt = new Date().toISOString()
  }
}

export function deleteProperty(id: string): boolean {
  const idx = properties.findIndex((p) => p.id === id)
  if (idx !== -1) {
    properties.splice(idx, 1)
    return true
  }
  return false
}