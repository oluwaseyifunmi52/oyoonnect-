import type { Business, BusinessFilters, Category, Location } from '../types/business'
import { categories, categoryBySlug } from './categories'
import { locations } from './locations'

export const businesses: Business[] = []

export function businessById(id: string): Business | undefined {
  return businesses.find((business) => business.id === id)
}

export function featuredBusinesses(): Business[] {
  return businesses.filter((business) => business.featured && business.status === 'verified')
}

export function getBusinessesByOwner(ownerId: string): Business[] {
  return businesses.filter((business) => business.ownerId === ownerId)
}

export function getBusinessesByStatus(status: Business['status']): Business[] {
  return businesses.filter((business) => business.status === status)
}

export function getApprovedBusinesses(): Business[] {
  return businesses.filter((business) => business.status === 'approved' || business.status === 'verified')
}

export function searchBusinesses(filters: BusinessFilters): Business[] {
  return businesses.filter((business) => {
    if (filters.query) {
      const q = filters.query.toLowerCase()
      if (
        !business.name.toLowerCase().includes(q) &&
        !business.description.toLowerCase().includes(q) &&
        !business.services.some((s) => s.toLowerCase().includes(q))
      ) {
        return false
      }
    }
    if (filters.category && business.category !== filters.category) return false
    if (filters.location && business.location !== filters.location) return false
    if (filters.area && business.area !== filters.area) return false
    if (filters.busStop && business.busStop !== filters.busStop) return false
    if (filters.verified !== undefined && business.verified !== filters.verified) return false
    if (filters.minRating !== undefined && business.rating < filters.minRating) return false
    if (filters.priceRange && business.priceRange !== filters.priceRange) return false
    if (filters.status && business.status !== filters.status) return false
    if (filters.openNow !== undefined && filters.openNow) {
      return false
    }
    return true
  })
}

export function sortBusinesses(businesses: Business[], sortBy: string): Business[] {
  const sorted = [...businesses]
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'reviews':
      return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(),
      )
    default:
      return sorted
  }
}

export interface PaginatedResult<T> {
  items: T[]
  totalPages: number
  totalItems: number
}

export function paginateBusinesses<T>(
  items: T[],
  page: number,
  itemsPerPage: number,
): PaginatedResult<T> {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return {
    items: items.slice(startIndex, endIndex),
    totalPages,
    totalItems,
  }
}

export function getCategoryCounts(): Record<string, number> {
  return businesses.reduce((acc, business) => {
    acc[business.category] = (acc[business.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

export function getLocationCounts(): Record<string, number> {
  return businesses.reduce((acc, business) => {
    acc[business.location] = (acc[business.location] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

export function getBusinessStats(ownerId: string): {
  total: number
  approved: number
  verified: number
  pending: number
  rejected: number
  totalViews: number
} {
  const ownerBusinesses = getBusinessesByOwner(ownerId)
  return {
    total: ownerBusinesses.length,
    approved: ownerBusinesses.filter((b) => b.status === 'approved').length,
    verified: ownerBusinesses.filter((b) => b.status === 'verified').length,
    pending: ownerBusinesses.filter((b) => b.status === 'pending').length,
    rejected: ownerBusinesses.filter((b) => b.status === 'rejected').length,
    totalViews: ownerBusinesses.reduce((sum, b) => sum + (b.messageCount || 0), 0),
  }
}

export {
  categories,
  categoryBySlug,
  locations,
}
