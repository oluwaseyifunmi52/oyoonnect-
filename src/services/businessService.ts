import type { Business, BusinessFilters, Category, Location, Review } from '../types/business'
import {
  businesses,
  businessById,
  featuredBusinesses,
  getBusinessesByOwner,
  getBusinessesByStatus,
  getApprovedBusinesses,
  searchBusinesses,
  sortBusinesses,
  paginateBusinesses,
  getCategoryCounts,
  getLocationCounts,
  getBusinessStats,
  categories,
  locations,
} from '../data/businesses'
import { reviews, getReviewsByBusinessId, calculateAverageRating, getReviewCount as getReviewCountByBusiness, getRatingDistribution, sortReviews } from '../data/reviews'

interface BusinessStats {
  total: number
  approved: number
  verified: number
  pending: number
  rejected: number
  totalViews: number
  totalMessages?: number
  totalClicks?: number
  totalWhatsApp?: number
}

interface PaginatedResult<T> {
  items: T[]
  totalPages: number
  totalItems: number
}

export const businessService = {
  async search(filters: BusinessFilters): Promise<Business[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(searchBusinesses(filters))
      }, 100)
    })
  },

  sort(items: Business[], sortBy: string): Business[] {
    return sortBusinesses(items, sortBy)
  },

  paginate<T>(items: T[], page: number, itemsPerPage: number): PaginatedResult<T> {
    return paginateBusinesses(items, page, itemsPerPage)
  },

  async getById(id: string): Promise<Business | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(businessById(id))
      }, 100)
    })
  },

  async getAll(): Promise<Business[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(businesses)
      }, 100)
    })
  },

  async getByOwner(ownerId: string): Promise<Business[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getBusinessesByOwner(ownerId))
      }, 100)
    })
  },

  async create(data: Partial<Business>): Promise<Business> {
    const newBusiness: Business = {
      id: `biz-${Date.now().toString(36)}`,
      name: data.name || 'Untitled Business',
      category: data.category || '',
      location: data.location || '',
      area: data.area,
      state: data.state || 'Oyo',
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      verified: data.verified ?? false,
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      email: data.email,
      website: data.website,
      address: data.address || '',
      description: data.description || '',
      services: data.services || [],
      openingHours: data.openingHours || [],
      image: data.image || '',
      gallery: data.gallery || [],
      featured: data.featured ?? false,
      priceRange: data.priceRange,
      status: data.status ?? 'pending',
      ownerId: data.ownerId,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logo: data.logo,
      coverImage: data.coverImage,
      socialLinks: data.socialLinks,
      verification: data.verification,
      busStop: data.busStop,
      latitude: data.latitude,
      longitude: data.longitude,
      locationData: data.locationData,
      payoutDetails: data.payoutDetails,
      servicePrices: data.servicePrices,
      messageCount: data.messageCount ?? 0,
      phoneClicks: data.phoneClicks ?? 0,
      whatsappClicks: data.whatsappClicks ?? 0,
    }
    return newBusiness
  },

  async update(id: string, data: Partial<Business>): Promise<Business> {
    const existing = businessById(id)
    if (!existing) {
      throw new Error(`Business with id ${id} not found`)
    }
    return { ...existing, ...data, updatedAt: new Date().toISOString() }
  },

  async delete(id: string): Promise<void> {
    const idx = businesses.findIndex((b) => b.id === id)
    if (idx !== -1) {
      businesses.splice(idx, 1)
    }
  },

  approve(id: string): void {
    const business = businesses.find((b) => b.id === id)
    if (business) {
      business.status = 'approved'
      business.updatedAt = new Date().toISOString()
    }
  },

  verify(id: string): void {
    const business = businesses.find((b) => b.id === id)
    if (business) {
      business.status = 'verified'
      business.verified = true
      business.updatedAt = new Date().toISOString()
    }
  },

  reject(id: string): void {
    const business = businesses.find((b) => b.id === id)
    if (business) {
      business.status = 'rejected'
      business.updatedAt = new Date().toISOString()
    }
  },

  getCategoryCounts(): Record<string, number> {
    return getCategoryCounts()
  },

  async getStats(ownerId: string): Promise<BusinessStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = getBusinessStats(ownerId)
        resolve({
          ...stats,
          totalMessages: stats.totalViews,
          totalClicks: stats.totalViews,
          totalWhatsApp: stats.totalViews,
        })
      }, 100)
    })
  },

  async getFeatured(): Promise<Business[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(featuredBusinesses())
      }, 100)
    })
  },

  getCategories(): Category[] {
    return categories
  },

  getLocations(): Location[] {
    return locations
  },

  getLocationCounts(): Record<string, number> {
    return getLocationCounts()
  },
}

export const draftService = {
  saveDraft<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      // ignore storage errors
    }
  },

  clearDraft(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore storage errors
    }
  },

  getDraft<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },
}

export const reviewService = {
  async getByBusiness(businessId: string): Promise<Review[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getReviewsByBusinessId(businessId))
      }, 100)
    })
  },

  async getAverageRating(businessId: string): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const businessReviews = getReviewsByBusinessId(businessId)
        resolve(calculateAverageRating(businessReviews))
      }, 100)
    })
  },

  async getReviewCount(businessId: string): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getReviewCountByBusiness(businessId))
      }, 100)
    })
  },

  async getRatingDistribution(businessId: string): Promise<Record<number, number>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const businessReviews = getReviewsByBusinessId(businessId)
        resolve(getRatingDistribution(businessReviews))
      }, 100)
    })
  },

  async addMockReview(review: {
    businessId: string
    userName: string
    rating: number
    comment: string
    verified?: boolean
    status?: Review['status']
  }): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now().toString(36)}`,
      businessId: review.businessId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      verified: review.verified ?? false,
      status: review.status ?? 'pending',
      createdAt: new Date().toISOString(),
    }
    reviews.push(newReview)
    return newReview
  },

  getSorted(reviews: Review[], sortBy: 'newest' | 'highest' | 'lowest'): Review[] {
    return sortReviews(reviews, sortBy)
  },

  getFiltered(reviews: Review[], rating: number | 'all'): Review[] {
    if (rating === 'all') return reviews
    return reviews.filter((r) => r.rating === rating)
  },
}

export const favoritesService = {
  getFavorites(): string[] {
    try {
      const stored = localStorage.getItem('favorites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  async getFavoriteBusinesses(): Promise<Business[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const favIds = this.getFavorites()
        resolve(businesses.filter((b) => favIds.includes(b.id)))
      }, 100)
    })
  },

  add(businessId: string): void {
    const favs = this.getFavorites()
    if (!favs.includes(businessId)) {
      favs.push(businessId)
      localStorage.setItem('favorites', JSON.stringify(favs))
    }
  },

  remove(businessId: string): void {
    const favs = this.getFavorites().filter((id) => id !== businessId)
    localStorage.setItem('favorites', JSON.stringify(favs))
  },

  toggle(businessId: string): boolean {
    const favs = this.getFavorites()
    const idx = favs.indexOf(businessId)
    if (idx === -1) {
      favs.push(businessId)
    } else {
      favs.splice(idx, 1)
    }
    localStorage.setItem('favorites', JSON.stringify(favs))
    return idx === -1
  },

  isFavorite(businessId: string): boolean {
    return this.getFavorites().includes(businessId)
  },
}

export const getApprovedBusinessesList = getApprovedBusinesses
