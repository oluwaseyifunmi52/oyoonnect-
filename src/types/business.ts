export interface OpeningHour {
  days: string
  hours: string
}

export interface BusinessLocation {
  state: string
  lga: string
  town: string
  area: string
  busStop: string
  address: string
  latitude?: number
  longitude?: number
  placeId?: string
  formattedAddress?: string
}

export interface PayoutDetails {
  bankName: string
  bankCode: string
  accountNumber: string
  accountHolderName: string
  verified: boolean
  verifiedAt?: string
  accountHolderVerified?: string
}

export interface BusinessFormData {
  name: string
  description: string
  ownerName: string

  category: string

  state: string
  lga: string
  town: string
  area: string
  busStop: string
  address: string

  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string

  phone: string
  whatsapp: string
  whatsappSameAsPhone: boolean
  email: string
  website: string

  logoPreview: string
  coverPreview: string
  galleryPreviews: string[]

  logoFile: File | null
  coverImageFile: File | null
  galleryFiles: File[]

  openingHours: Record<
    string,
    {
      open: string
      close: string
      closed: boolean
    }
  >

  logo: string
  coverImage: string
  gallery: string[]

  featured: boolean

  priceRange: '#' | '##' | '###' | '####' | ''

  status: 'pending' | 'approved' | 'rejected' | 'verified'

  ownerId: string

  services: string[]
  servicePrices: string[]

  socialLinks: Record<string, string>

  verification: {
    status: 'pending' | 'verified' | 'rejected'
    documents?: string[]
  }
}

export const emptyBusinessFormData: BusinessFormData = {
  name: '',
  description: '',
  ownerName: '',

  category: '',

  state: 'Oyo',
  lga: '',
  town: '',
  area: '',
  busStop: '',
  address: '',

  latitude: 0,
  longitude: 0,
  placeId: '',
  formattedAddress: '',

  phone: '',
  whatsapp: '',
  whatsappSameAsPhone: true,
  email: '',
  website: '',

  logoPreview: '',
  coverPreview: '',
  galleryPreviews: [],

  logoFile: null,
  coverImageFile: null,
  galleryFiles: [],

  openingHours: {
    Monday: { open: '09:00', close: '18:00', closed: false },
    Tuesday: { open: '09:00', close: '18:00', closed: false },
    Wednesday: { open: '09:00', close: '18:00', closed: false },
    Thursday: { open: '09:00', close: '18:00', closed: false },
    Friday: { open: '09:00', close: '18:00', closed: false },
    Saturday: { open: '09:00', close: '18:00', closed: false },
    Sunday: { open: '09:00', close: '18:00', closed: true },
  },

  logo: '',
  coverImage: '',
  gallery: [],

  featured: false,

  priceRange: '##',

  status: 'pending',

  ownerId: '',

  services: [],
  servicePrices: [],

  socialLinks: {},

  verification: {
    status: 'pending',
    documents: [],
  },
}

export interface Business {
  id: string
  name: string
  category: string
  location: string
  area?: string
  state: string
  rating: number
  reviewCount: number
  verified: boolean
  phone: string
  whatsapp: string
  email?: string
  website?: string
  address: string
  description: string
  services: string[]
  openingHours: OpeningHour[]
  image: string
  gallery: string[]
  featured?: boolean
  priceRange?: '#' | '##' | '###' | '####'
  status?: 'pending' | 'approved' | 'rejected' | 'verified'
  ownerId?: string
  createdAt?: string
  updatedAt?: string
  logo?: string
  coverImage?: string
  socialLinks?: Record<string, string>
  verification?: {
    status: 'pending' | 'verified' | 'rejected'
    documents?: string[]
  }
  busStop?: string
  latitude?: number
  longitude?: number
  placeId?: string
  formattedAddress?: string
  locationData?: BusinessLocation
  payoutDetails?: PayoutDetails
  servicePrices?: Record<string, string>
  messageCount?: number
  phoneClicks?: number
  whatsappClicks?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

export interface Location {
  id: string
  name: string
  tagline: string
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  businessId: string
  userId?: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
  verified?: boolean
  status?: ReviewStatus
}

/** Optional capabilities a single OyoConnect account may have (one account, many capabilities). */
export type Capability = 'user' | 'customer' | 'service_provider' | 'job_seeker' | 'employer' | 'business_owner' | 'community_contributor' | 'help_requester'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'customer' | 'service_provider' | 'business_owner' | 'admin'
  capabilities?: Capability[]
  avatar?: string
  createdAt: string
}

export interface BusinessFilters {
  query?: string
  category?: string
  location?: string
  area?: string
  busStop?: string
  verified?: boolean
  minRating?: number
  priceRange?: string
  openNow?: boolean
  sort?: string
  status?: 'pending' | 'approved' | 'rejected' | 'verified'
}

export interface BusinessStats {
  total: number
  approved: number
  verified: number
  pending: number
  rejected: number
  totalViews: number
}

export interface SortOption {
  value: string
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'rating', label: 'Highest rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'newest', label: 'Newest' },
]

export const PRICE_RANGES = [
  { value: '#', label: 'Budget' },
  { value: '##', label: 'Moderate' },
  { value: '###', label: 'Expensive' },
  { value: '####', label: 'Premium' },
]