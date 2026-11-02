import type { Business, BusinessFilters } from '@/types/business'
import { devAuthRepository } from '../auth/devAuthRepository'

export const DEV_BUSINESSES_STORAGE_KEY = 'oyoconnect_businesses'

function getStoredBusinesses(): Business[] {
  try {
    const stored = localStorage.getItem(DEV_BUSINESSES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredBusinesses(businesses: Business[]): void {
  try {
    localStorage.setItem(DEV_BUSINESSES_STORAGE_KEY, JSON.stringify(businesses))
  } catch {
    console.warn('[dev business] failed to save to localStorage')
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `business_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

class DevBusinessRepository {
  async create(data: Partial<Business>): Promise<Business> {
    const user = await devAuthRepository.getCurrentUser()
    const business: Business = {
      id: data.id || generateId(),
      name: data.name || '',
      category: data.category || '',
      location: data.location || '',
      state: data.state || '',
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      verified: data.verified ?? false,
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      email: data.email,
      website: data.website,
      address: data.address || '',
      description: data.description || '',
      services: data.services ?? [],
      openingHours: data.openingHours ?? [],
      image: data.image || '',
      gallery: data.gallery ?? [],
      featured: data.featured ?? false,
      priceRange: data.priceRange,
      status: data.status ?? 'pending',
      ownerId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logo: data.logo,
      coverImage: data.coverImage,
      socialLinks: data.socialLinks,
      verification: data.verification,
      busStop: data.busStop,
      latitude: data.latitude,
      longitude: data.longitude,
      placeId: data.placeId,
      formattedAddress: data.formattedAddress,
      locationData: data.locationData,
      payoutDetails: data.payoutDetails,
      servicePrices: data.servicePrices,
      messageCount: data.messageCount,
      phoneClicks: data.phoneClicks,
      whatsappClicks: data.whatsappClicks,
    }
    const businesses = getStoredBusinesses()
    setStoredBusinesses([business, ...businesses])
    return business
  }

  async getById(id: string): Promise<Business | undefined> {
    const businesses = getStoredBusinesses()
    return businesses.find((b) => b.id === id)
  }

  async getAll(): Promise<Business[]> {
    return getStoredBusinesses()
  }

  async getMyBusinesses(): Promise<Business[]> {
    const businesses = getStoredBusinesses()
    const user = await devAuthRepository.getCurrentUser()
    if (!user) return []
    return businesses.filter((b) => b.ownerId === user.id)
  }

  async getByOwner(ownerId: string): Promise<Business[]> {
    const businesses = getStoredBusinesses()
    return businesses.filter((b) => b.ownerId === ownerId)
  }

  async search(filters: BusinessFilters): Promise<Business[]> {
    const businesses = getStoredBusinesses()
    let results = [...businesses]

    if (filters.query) {
      const queryLower = filters.query.toLowerCase()
      results = results.filter(
        (b) =>
          (b.name && b.name.toLowerCase().includes(queryLower)) ||
          (b.description && b.description.toLowerCase().includes(queryLower)) ||
          (b.category && b.category.toLowerCase().includes(queryLower))
      )
    }

    if (filters.category) {
      results = results.filter((b) => b.category === filters.category)
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      results = results.filter(
        (b) =>
          (b.location && b.location.toLowerCase().includes(locationLower)) ||
          (b.state && b.state.toLowerCase().includes(locationLower))
      )
    }

    if (filters.area !== undefined) {
      const areaLower = filters.area.toLowerCase()
      results = results.filter((b) => b.locationData?.town === filters.area || (b.locationData && b.locationData.town?.toLowerCase().includes(areaLower)))
    }

    if (filters.busStop) {
      results = results.filter((b) => b.locationData?.busStop === filters.busStop)
    }

    if (filters.verified !== undefined) {
      results = results.filter((b) => b.verified === filters.verified)
    }

    if (filters.minRating !== undefined) {
      results = results.filter((b) => b.rating >= (filters.minRating || 0))
    }

    if (filters.priceRange) {
      results = results.filter((b) => b.priceRange === filters.priceRange)
    }

    if (filters.status) {
      results = results.filter((b) => b.status === filters.status)
    }

    return results
  }

  async update(id: string, data: Partial<Business>): Promise<Business> {
    const businesses = getStoredBusinesses()
    const index = businesses.findIndex((b) => b.id === id)
    if (index === -1) throw new Error('Business not found')

    const updated: Business = {
      ...businesses[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    businesses[index] = updated
    setStoredBusinesses(businesses)
    return updated
  }

  async delete(id: string): Promise<void> {
    let businesses = getStoredBusinesses()
    businesses = businesses.filter((b) => b.id !== id)
    setStoredBusinesses(businesses)
  }

  async getFeatured(): Promise<Business[]> {
    const businesses = getStoredBusinesses()
    return businesses.filter((b) => b.featured === true)
  }
}

export const devBusinessRepository = new DevBusinessRepository()