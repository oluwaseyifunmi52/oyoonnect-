import type { PropertyType } from '../types/rental'

export const propertyTypes = [
  {
    id: 'apartment',
    name: 'Apartment / Flat',
    slug: 'apartment',
    icon: 'building-2',
    description: 'Self-contained units in a building',
  },
  {
    id: 'house',
    name: 'House',
    slug: 'house',
    icon: 'home',
    description: 'Standalone residential house',
  },
  {
    id: 'duplex',
    name: 'Duplex',
    slug: 'duplex',
    icon: 'building',
    description: 'Two-story residential unit',
  },
  {
    id: 'bungalow',
    name: 'Bungalow',
    slug: 'bungalow',
    icon: 'home',
    description: 'Single-story detached house',
  },
  {
    id: 'terrace',
    name: 'Terrace',
    slug: 'terrace',
    icon: 'building-2',
    description: 'Row house sharing walls',
  },
  {
    id: 'block_of_flats',
    name: 'Block of Flats',
    slug: 'block-of-flats',
    icon: 'building-2',
    description: 'Multi-unit residential building',
  },
  {
    id: 'shortlet',
    name: 'Shortlet / Airbnb',
    slug: 'shortlet',
    icon: 'key',
    description: 'Short-term rental apartments',
  },
  {
    id: 'hostel',
    name: 'Hostel / Student Housing',
    slug: 'hostel',
    icon: 'users',
    description: 'Shared accommodation for students',
  },
  {
    id: 'commercial',
    name: 'Commercial Property',
    slug: 'commercial',
    icon: 'briefcase',
    description: 'Commercial buildings and spaces',
  },
  {
    id: 'office',
    name: 'Office Space',
    slug: 'office',
    icon: 'briefcase',
    description: 'Office units and business spaces',
  },
  {
    id: 'shop',
    name: 'Shop / Retail Space',
    slug: 'shop',
    icon: 'store',
    description: 'Retail shops and commercial units',
  },
  {
    id: 'warehouse',
    name: 'Warehouse / Industrial',
    slug: 'warehouse',
    icon: 'warehouse',
    description: 'Storage and industrial spaces',
  },
  {
    id: 'land',
    name: 'Land / Plot',
    slug: 'land',
    icon: 'map-pin',
    description: 'Vacant land for development',
  },
] as const

export type PropertyTypeInfo = typeof propertyTypes[number]

export function propertyTypeBySlug(slug: string): PropertyTypeInfo | undefined {
  return propertyTypes.find((type) => type.slug === slug)
}

export function propertyTypeById(id: string): PropertyTypeInfo | undefined {
  return propertyTypes.find((type) => type.id === id)
}

export function getAllPropertyTypeSlugs(): string[] {
  return propertyTypes.map((t) => t.slug)
}

export function getPropertyTypeIcon(type: PropertyType): string {
  const info = propertyTypeById(type)
  return info?.icon || 'home'
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const info = propertyTypeById(type)
  return info?.name || type
}