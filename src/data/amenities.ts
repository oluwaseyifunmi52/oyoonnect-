export interface Amenity {
  key: string
  label: string
  icon: string
  description: string
  category: 'essential' | 'comfort' | 'security' | 'utility' | 'outdoor'
}

export const amenities: Amenity[] = [
  // Essential
  { key: 'water', label: 'Water Supply', icon: 'droplets', description: 'Running water / borehole', category: 'essential' },
  { key: 'electricity', label: 'Electricity', icon: 'zap', description: 'Grid electricity connection', category: 'essential' },
  { key: 'kitchen', label: 'Kitchen', icon: 'chef-hat', description: 'Functional kitchen space', category: 'essential' },

  // Comfort
  { key: 'airConditioning', label: 'Air Conditioning', icon: 'wind', description: 'AC units installed', category: 'comfort' },
  { key: 'furnished', label: 'Furnished', icon: 'armchair', description: 'Comes with furniture', category: 'comfort' },
  { key: 'wardrobe', label: 'Built-in Wardrobes', icon: 'shirt', description: 'Fitted wardrobes in bedrooms', category: 'comfort' },
  { key: 'internet', label: 'Internet / WiFi Ready', icon: 'wifi', description: 'Fiber/broadband infrastructure', category: 'comfort' },
  { key: 'balcony', label: 'Balcony / Veranda', icon: 'sun', description: 'Private outdoor space', category: 'comfort' },

  // Security
  { key: 'security', label: 'Security Guard / CCTV', icon: 'shield', description: '24hr security or CCTV', category: 'security' },
  { key: 'fence', label: 'Perimeter Fence', icon: 'fence', description: 'Fenced property boundary', category: 'security' },
  { key: 'gate', label: 'Gate / Gatehouse', icon: 'door-open', description: 'Controlled entry with gate', category: 'security' },

  // Utility
  { key: 'generator', label: 'Generator / Backup Power', icon: 'battery-charging', description: 'Standby generator', category: 'utility' },
  { key: 'solar', label: 'Solar Power', icon: 'sun', description: 'Solar panels installed', category: 'utility' },
  { key: 'parking', label: 'Parking Space', icon: 'car', description: 'Dedicated parking spot', category: 'utility' },

  // Outdoor
  { key: 'compound', label: 'Compound Space', icon: 'square', description: 'Open compound area', category: 'outdoor' },
  { key: 'bathroom', label: 'Private Bathroom', icon: 'bath', description: 'Ensuite or private bathroom', category: 'essential' },
]

export const amenityCategories = [
  { key: 'essential', label: 'Essentials', icon: 'check-circle' },
  { key: 'comfort', label: 'Comfort', icon: 'heart' },
  { key: 'security', label: 'Security', icon: 'shield' },
  { key: 'utility', label: 'Utilities', icon: 'zap' },
  { key: 'outdoor', label: 'Outdoor', icon: 'tree-pine' },
] as const

export function getAmenitiesByCategory(category: Amenity['category']): Amenity[] {
  return amenities.filter((a) => a.category === category)
}

export function getAmenityLabel(key: string): string {
  const amenity = amenities.find((a) => a.key === key)
  return amenity?.label || key
}

export function getAmenityIcon(key: string): string {
  const amenity = amenities.find((a) => a.key === key)
  return amenity?.icon || 'check'
}

export function getAmenityDescription(key: string): string {
  const amenity = amenities.find((a) => a.key === key)
  return amenity?.description || ''
}