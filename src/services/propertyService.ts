import type { Property, PropertyFilters, PropertyStatus } from '../types/rental'
import {
  properties,
  propertyById,
  getPropertiesByOwner,
  getFeaturedProperties,
  getRecentProperties,
  searchProperties,
  sortProperties,
  paginateProperties,
  incrementViews as incrementPropertyViews,
  incrementInquiries as incrementPropertyInquiries,
  deleteProperty as deletePropertyFromData,
} from '../data/properties'

const FAVORITES_STORAGE_KEY = 'property_favorites'

export interface PaginatedResult<T> {
  items: T[]
  totalPages: number
  totalItems: number
}

export const propertyService = {
  async search(filters: PropertyFilters): Promise<Property[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = searchProperties(filters)

        if (filters.sort) {
          results = sortProperties(results, filters.sort)
        }

        resolve(results)
      }, 100)
    })
  },

  sort(items: Property[], sortBy: string): Property[] {
    return sortProperties(items, sortBy)
  },

  paginate<T>(items: T[], page: number, itemsPerPage: number): PaginatedResult<T> {
    return paginateProperties(items, page, itemsPerPage)
  },

  async getById(id: string): Promise<Property | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(propertyById(id))
      }, 100)
    })
  },

  async getByOwner(ownerId: string): Promise<Property[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getPropertiesByOwner(ownerId))
      }, 100)
    })
  },

  async create(data: Partial<Property>): Promise<Property> {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: data.title || 'Untitled Property',
      description: data.description || '',
      propertyType: data.propertyType || 'apartment',
      listingType: data.listingType || 'rent',
      price: data.price || 0,
      pricePeriod: data.pricePeriod || 'monthly',
      negotiable: data.negotiable ?? false,
      location: data.location || {
        state: 'Oyo',
        lga: '',
        town: '',
        area: '',
        busStop: '',
        address: '',
        latitude: 0,
        longitude: 0,
      },
      features: data.features || {
        bedrooms: 1,
        bathrooms: 1,
        toilets: 1,
        livingRooms: 1,
        kitchens: 1,
        floors: 1,
        propertyCondition: 'good',
      },
      amenities: data.amenities || {
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
      images: data.images || { cover: '', gallery: [], coverPreview: '', galleryPreviews: [] },
      status: data.status || 'pending',
      verified: data.verified ?? false,
      featured: data.featured ?? false,
      ownerId: data.ownerId || '',
      ownerName: data.ownerName || '',
      ownerPhone: data.ownerPhone || '',
      ownerWhatsApp: data.ownerWhatsApp,
      ownerEmail: data.ownerEmail,
      views: 0,
      inquiryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      availableFrom: data.availableFrom,
      agentId: data.agentId,
      agentName: data.agentName,
      agentPhone: data.agentPhone,
      agentVerified: data.agentVerified,
    }
    properties.push(newProperty)
    return newProperty
  },

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const existing = propertyById(id)
    if (!existing) {
      throw new Error(`Property with id ${id} not found`)
    }
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() }
    const idx = properties.findIndex((p) => p.id === id)
    if (idx !== -1) {
      properties[idx] = updated
    }
    return updated
  },

  async delete(id: string): Promise<void> {
    deletePropertyFromData(id)
  },

  async incrementViews(id: string): Promise<void> {
    incrementPropertyViews(id)
  },

  async incrementInquiries(id: string): Promise<void> {
    incrementPropertyInquiries(id)
  },

  async getFeatured(): Promise<Property[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFeaturedProperties())
      }, 100)
    })
  },

  async getRecent(limit: number = 10): Promise<Property[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getRecentProperties(limit))
      }, 100)
    })
  },
}

export const propertyFavoritesService = {
  getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  async getFavoriteProperties(): Promise<Property[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const favIds = this.getFavorites()
        resolve(properties.filter((p) => favIds.includes(p.id)))
      }, 100)
    })
  },

  add(propertyId: string): void {
    const favs = this.getFavorites()
    if (!favs.includes(propertyId)) {
      favs.push(propertyId)
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs))
    }
  },

  remove(propertyId: string): void {
    const favs = this.getFavorites().filter((id) => id !== propertyId)
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs))
  },

  toggle(propertyId: string): boolean {
    const favs = this.getFavorites()
    const idx = favs.indexOf(propertyId)
    if (idx === -1) {
      favs.push(propertyId)
    } else {
      favs.splice(idx, 1)
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs))
    return idx === -1
  },

  isFavorite(propertyId: string): boolean {
    return this.getFavorites().includes(propertyId)
  },
}

export const propertyDraftService = {
  getDraft<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  saveDraft<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {}
  },

  clearDraft(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {}
  },
}
