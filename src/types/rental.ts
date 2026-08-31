export interface PropertyLocation {
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

export interface PropertyImages {
  cover: string
  gallery: string[]
  coverFile?: File
  galleryFiles?: File[]
  coverPreview?: string
  galleryPreviews?: string[]
}

export interface PropertyAmenities {
  water: boolean
  electricity: boolean
  security: boolean
  parking: boolean
  generator: boolean
  solar: boolean
  internet: boolean
  airConditioning: boolean
  furnished: boolean
  wardrobe: boolean
  kitchen: boolean
  bathroom: 'shared' | 'private' | 'ensuite'
  balcony: boolean
  compound: boolean
  fence: boolean
  gate: boolean
  [key: string]: boolean | string
}

export interface PropertyFeatures {
  bedrooms: number
  bathrooms: number
  toilets: number
  livingRooms: number
  kitchens: number
  floors: number
  totalFloors?: number
  plotSize?: number
  plotSizeUnit?: 'sqm' | 'acre' | 'hectare' | 'plot'
  yearBuilt?: number
  propertyCondition: 'new' | 'excellent' | 'good' | 'fair' | 'needs_renovation'
}

export type PropertyType =
  | 'apartment'
  | 'house'
  | 'commercial'
  | 'land'
  | 'office'
  | 'shop'
  | 'warehouse'
  | 'shortlet'
  | 'hostel'
  | 'duplex'
  | 'bungalow'
  | 'terrace'
  | 'block_of_flats'

export type ListingType = 'rent' | 'sale' | 'shortlet'

export type PropertyStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'verified'
  | 'rented'
  | 'sold'
  | 'expired'
  | 'rejected'

export interface Property {
  id: string
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  price: number
  pricePeriod: 'monthly' | 'annually' | 'total'
  negotiable: boolean
  location: PropertyLocation
  features: PropertyFeatures
  amenities: PropertyAmenities
  images: PropertyImages
  status: PropertyStatus
  verified: boolean
  featured: boolean
  ownerId: string
  ownerName: string
  ownerPhone: string
  ownerWhatsApp?: string
  ownerEmail?: string
  views: number
  inquiryCount: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
  availableFrom?: string
  agentId?: string
  agentName?: string
  agentPhone?: string
  agentVerified?: boolean
}

export interface PropertyFormData {
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  price: number
  pricePeriod: 'monthly' | 'annually' | 'total'
  negotiable: boolean
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
  bedrooms: number
  bathrooms: number
  toilets: number
  livingRooms: number
  kitchens: number
  floors: number
  totalFloors?: number
  plotSize?: number
  plotSizeUnit?: 'sqm' | 'acre' | 'hectare' | 'plot'
  yearBuilt?: number
  propertyCondition: 'new' | 'excellent' | 'good' | 'fair' | 'needs_renovation'
  amenities: PropertyAmenities
  coverFile: File | null
  galleryFiles: File[]
  coverPreview: string
  galleryPreviews: string[]
  coverImage: string
  gallery: string[]
  featured: boolean
  availableFrom?: string
  ownerName: string
  ownerPhone: string
  ownerWhatsApp: string
  ownerWhatsAppSameAsPhone: boolean
  ownerEmail: string
  agentName: string
  agentPhone: string
}

export const emptyPropertyFormData: PropertyFormData = {
  title: '',
  description: '',
  propertyType: 'apartment',
  listingType: 'rent',
  price: 0,
  pricePeriod: 'monthly',
  negotiable: true,
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
  bedrooms: 1,
  bathrooms: 1,
  toilets: 1,
  livingRooms: 1,
  kitchens: 1,
  floors: 1,
  propertyCondition: 'good',
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
  coverFile: null,
  galleryFiles: [],
  coverPreview: '',
  galleryPreviews: [],
  coverImage: '',
  gallery: [],
  featured: false,
  availableFrom: new Date().toISOString().split('T')[0],
  ownerName: '',
  ownerPhone: '',
  ownerWhatsApp: '',
  ownerWhatsAppSameAsPhone: true,
  ownerEmail: '',
  agentName: '',
  agentPhone: '',
}

export interface PropertyFilters {
  query?: string
  propertyType?: PropertyType
  listingType?: ListingType
  location?: string
  area?: string
  busStop?: string
  minPrice?: number
  maxPrice?: number
  pricePeriod?: 'monthly' | 'annually' | 'total'
  bedrooms?: number
  bathrooms?: number
  minPlotSize?: number
  maxPlotSize?: number
  verified?: boolean
  featured?: boolean
  furnished?: boolean
  amenities?: string[]
  sort?: string
  status?: PropertyStatus
}

export interface SortOption {
  value: string
  label: string
}

export const PROPERTY_SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-per-sqm', label: 'Price per sqm' },
  { value: 'bedrooms', label: 'Bedrooms' },
  { value: 'plot-size', label: 'Plot Size' },
]

export const PROPERTY_TYPES: { value: PropertyType; label: string; icon: string; description: string }[] = [
  { value: 'apartment', label: 'Apartment / Flat', icon: 'building-2', description: 'Self-contained units in a building' },
  { value: 'house', label: 'House', icon: 'home', description: 'Standalone residential house' },
  { value: 'duplex', label: 'Duplex', icon: 'building', description: 'Two-story residential unit' },
  { value: 'bungalow', label: 'Bungalow', icon: 'home', description: 'Single-story detached house' },
  { value: 'terrace', label: 'Terrace', icon: 'building-2', description: 'Row house sharing walls' },
  { value: 'block_of_flats', label: 'Block of Flats', icon: 'building-2', description: 'Multi-unit residential building' },
  { value: 'shortlet', label: 'Shortlet / Airbnb', icon: 'key', description: 'Short-term rental apartments' },
  { value: 'hostel', label: 'Hostel / Student Housing', icon: 'users', description: 'Shared accommodation for students' },
  { value: 'commercial', label: 'Commercial Property', icon: 'briefcase', description: 'Commercial buildings and spaces' },
  { value: 'office', label: 'Office Space', icon: 'briefcase', description: 'Office units and business spaces' },
  { value: 'shop', label: 'Shop / Retail Space', icon: 'store', description: 'Retail shops and commercial units' },
  { value: 'warehouse', label: 'Warehouse / Industrial', icon: 'warehouse', description: 'Storage and industrial spaces' },
  { value: 'land', label: 'Land / Plot', icon: 'map-pin', description: 'Vacant land for development' },
]

export const LISTING_TYPES: { value: ListingType; label: string; description: string }[] = [
  { value: 'rent', label: 'For Rent', description: 'Monthly or annual rental' },
  { value: 'sale', label: 'For Sale', description: 'Outright purchase' },
  { value: 'shortlet', label: 'Shortlet', description: 'Daily/weekly short-term rental' },
]

export const PRICE_PERIODS: { value: 'monthly' | 'annually' | 'total'; label: string }[] = [
  { value: 'monthly', label: 'Per Month' },
  { value: 'annually', label: 'Per Year' },
  { value: 'total', label: 'Total Price' },
]

export const PROPERTY_CONDITIONS: { value: PropertyFormData['propertyCondition']; label: string; description: string }[] = [
  { value: 'new', label: 'Brand New', description: 'Never occupied, newly built' },
  { value: 'excellent', label: 'Excellent', description: 'Like new, premium finishes' },
  { value: 'good', label: 'Good', description: 'Well-maintained, ready to move in' },
  { value: 'fair', label: 'Fair', description: 'Lived-in condition, minor repairs needed' },
  { value: 'needs_renovation', label: 'Needs Renovation', description: 'Requires significant work' },
]

export const BEDROOM_OPTIONS = [
  { value: 0, label: 'Studio / Bedsitter' },
  { value: 1, label: '1 Bedroom' },
  { value: 2, label: '2 Bedrooms' },
  { value: 3, label: '3 Bedrooms' },
  { value: 4, label: '4 Bedrooms' },
  { value: 5, label: '5 Bedrooms' },
  { value: 6, label: '6+ Bedrooms' },
]

export const BATHROOM_OPTIONS = [
  { value: 1, label: '1 Bathroom' },
  { value: 2, label: '2 Bathrooms' },
  { value: 3, label: '3 Bathrooms' },
  { value: 4, label: '4 Bathrooms' },
  { value: 5, label: '5+ Bathrooms' },
]

export const TOILET_OPTIONS = [
  { value: 1, label: '1 Toilet' },
  { value: 2, label: '2 Toilets' },
  { value: 3, label: '3 Toilets' },
  { value: 4, label: '4+ Toilets' },
]

export const LIVING_ROOM_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 1, label: '1 Living Room' },
  { value: 2, label: '2 Living Rooms' },
  { value: 3, label: '3+ Living Rooms' },
]

export const KITCHEN_OPTIONS = [
  { value: 1, label: '1 Kitchen' },
  { value: 2, label: '2 Kitchens' },
  { value: 3, label: '3+ Kitchens' },
]

export const AMENITY_LABELS: Record<keyof PropertyAmenities, string> = {
  water: 'Water Supply',
  electricity: 'Electricity',
  security: 'Security Guard / CCTV',
  parking: 'Parking Space',
  generator: 'Generator / Backup Power',
  solar: 'Solar Power',
  internet: 'Internet / WiFi Ready',
  airConditioning: 'Air Conditioning',
  furnished: 'Furnished',
  wardrobe: 'Built-in Wardrobes',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom Type',
  balcony: 'Balcony / Veranda',
  compound: 'Compound Space',
  fence: 'Perimeter Fence',
  gate: 'Gate / Gatehouse',
}