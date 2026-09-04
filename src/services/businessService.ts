import { apiClient, type ApiResponse, ApiError } from './apiClient'
import type { Business, BusinessFilters, Category, Location, BusinessStats, Review, ReviewStatus } from '../types/business'

interface PaginatedResult<T> {
  items: T[]
  totalPages: number
  totalItems: number
  currentPage: number
  itemsPerPage: number
}

function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || 'API request failed')
  }
  return response.data
}

function handleApiError(error: unknown): never {
  if (error instanceof ApiError) throw error
  throw new ApiError(0, error instanceof Error ? error.message : 'Network error')
}

export const businessService = {
  async search(filters: BusinessFilters): Promise<Business[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        params.set(key, String(value))
      }
    })
    const response = await apiClient.get<Business[]>(`/businesses/search?${params.toString()}`)
    return handleApiResponse(response)
  },

  sort(items: Business[], sortBy: string): Business[] {
    const sorted = [...items]
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
            new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
      default:
        return sorted
    }
  },

  paginate<T>(items: T[], page: number, itemsPerPage: number): PaginatedResult<T> {
    const totalItems = items.length
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      items: items.slice(startIndex, endIndex),
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage,
    }
  },

  async getById(id: string): Promise<Business | undefined> {
    try {
      const response = await apiClient.get<Business>(`/businesses/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return undefined
      }
      throw error
    }
  },

  async getAll(): Promise<Business[]> {
    const response = await apiClient.get<Business[]>('/businesses')
    return handleApiResponse(response)
  },

  async getMyBusinesses(): Promise<Business[]> {
    const response = await apiClient.get<Business[]>('/businesses/my-businesses')
    return handleApiResponse(response)
  },

  async getByOwner(ownerId: string): Promise<Business[]> {
    const response = await apiClient.get<Business[]>(`/businesses/owner/${ownerId}`)
    return handleApiResponse(response)
  },

  async create(data: Partial<Business>): Promise<Business> {
    const response = await apiClient.post<Business>('/businesses', data)
    return handleApiResponse(response)
  },

  async update(id: string, data: Partial<Business>): Promise<Business> {
    const response = await apiClient.patch<Business>(`/businesses/${id}`, data)
    return handleApiResponse(response)
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`/businesses/${id}`)
    handleApiResponse(response)
  },

  async getStats(ownerId: string): Promise<BusinessStats> {
    const response = await apiClient.get<BusinessStats>(`/businesses/stats/${ownerId}`)
    return handleApiResponse(response)
  },

  async getFeatured(): Promise<Business[]> {
    const response = await apiClient.get<Business[]>('/businesses/featured')
    return handleApiResponse(response)
  },

  getCategories(): Category[] {
    return []
  },

  async fetchCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories')
    return handleApiResponse(response)
  },

  getLocations(): Location[] {
    return []
  },

  async fetchLocations(): Promise<Location[]> {
    const response = await apiClient.get<Location[]>('/locations')
    return handleApiResponse(response)
  },

  getLocationCounts(): Record<string, number> {
    return {}
  },

  async getCategoryCounts(): Promise<Record<string, number>> {
    try {
      const response = await apiClient.get<Record<string, number>>('/categories/counts')
      return handleApiResponse(response)
    } catch {
      return {}
    }
  },

  async approve(id: string): Promise<Business> {
    const response = await apiClient.patch<Business>(`/businesses/${id}/approve`, {})
    return handleApiResponse(response)
  },

  async verify(id: string): Promise<Business> {
    const response = await apiClient.patch<Business>(`/businesses/${id}/verify`, {})
    return handleApiResponse(response)
  },

  async reject(id: string): Promise<Business> {
    const response = await apiClient.patch<Business>(`/businesses/${id}/reject`, {})
    return handleApiResponse(response)
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
    const response = await apiClient.get<Review[]>(`/businesses/${businessId}/reviews`)
    return handleApiResponse(response)
  },

  async getAverageRating(businessId: string): Promise<number> {
    const response = await apiClient.get<{ averageRating: number }>(`/businesses/${businessId}/reviews/stats`)
    const data = handleApiResponse(response)
    return data.averageRating
  },

  async getReviewCount(businessId: string): Promise<number> {
    const response = await apiClient.get<{ reviewCount: number }>(`/businesses/${businessId}/reviews/count`)
    const data = handleApiResponse(response)
    return data.reviewCount
  },

  async getRatingDistribution(businessId: string): Promise<Record<number, number>> {
    const response = await apiClient.get<Record<number, number>>(`/businesses/${businessId}/reviews/distribution`)
    return handleApiResponse(response)
  },

  async addReview(data: {
    businessId: string
    userName: string
    rating: number
    comment: string
    verified?: boolean
    status?: ReviewStatus
  }): Promise<Review> {
    const response = await apiClient.post<Review>(`/businesses/${data.businessId}/reviews`, {
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
    })
    return handleApiResponse(response)
  },

  getSorted(reviews: Review[], sortBy: 'newest' | 'highest' | 'lowest'): Review[] {
    const sorted = [...reviews]
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating)
      default:
        return sorted
    }
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
    const favoriteIds = this.getFavorites()
    if (favoriteIds.length === 0) return []
    const response = await apiClient.get<Business[]>(`/businesses/favorites?ids=${favoriteIds.join(',')}`)
    return handleApiResponse(response)
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

export const getApprovedBusinessesList = businessService.getAll