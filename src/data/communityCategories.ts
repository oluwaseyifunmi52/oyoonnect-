export interface CommunityCategoryItem {
  slug: string
  name: string
  description: string
  color: string
  icon: keyof typeof import('lucide-react')
  path: string
}

export const communityCategories: CommunityCategoryItem[] = [
  {
    slug: 'roads',
    name: 'Road Conditions',
    description: 'Report potholes, road damage, erosion, and repair needs',
    color: '#7c3aed',
    icon: 'MapPin',
    path: '/community/roads',
  },
  {
    slug: 'floods',
    name: 'Flood Reports',
    description: 'Report flooded areas, drainage issues, and waterlogging',
    color: '#2563eb',
    icon: 'AlertTriangle',
    path: '/community/floods',
  },
  {
    slug: 'traffic',
    name: 'Traffic Updates',
    description: 'Report congestion, accidents, road closures, and diversions',
    color: '#dc2626',
    icon: 'Car',
    path: '/community/traffic',
  },
  {
    slug: 'power',
    name: 'Power Reports',
    description: 'Report outages, transformer issues, and electricity supply',
    color: '#f59e0b',
    icon: 'Zap',
    path: '/community/power',
  },
  {
    slug: 'water',
    name: 'Water Availability',
    description: 'Report water supply issues, pipe bursts, and shortages',
    color: '#06b6d4',
    icon: 'Droplets',
    path: '/community/water',
  },
  {
    slug: 'waste',
    name: 'Waste Reports',
    description: 'Report illegal dumping, overflowing bins, and collection issues',
    color: '#16a34a',
    icon: 'Trash2',
    path: '/community/waste',
  },
  {
    slug: 'construction',
    name: 'Construction Updates',
    description: 'Share ongoing projects, road works, and building sites',
    color: '#ea580c',
    icon: 'Hammer',
    path: '/community/construction',
  },
  {
    slug: 'security',
    name: 'Security Alerts',
    description: 'Safety concerns, incidents, and neighborhood alerts',
    color: '#be123c',
    icon: 'Shield',
    path: '/community/security',
  },
  {
    slug: 'transport',
    name: 'Transport Updates',
    description: 'Bus routes, transport changes, park changes, and fares',
    color: '#7c2d12',
    icon: 'Bus',
    path: '/community/transport',
  },
  {
    slug: 'photos',
    name: 'Community Photos',
    description: 'Share photos of neighborhoods, events, and community activities',
    color: '#4338ca',
    icon: 'Camera',
    path: '/community/photos',
  },
]

export function communityCategoryBySlug(slug: string): CommunityCategoryItem | undefined {
  return communityCategories.find((category) => category.slug === slug)
}

export function getAllCommunityCategorySlugs(): string[] {
  return communityCategories.map((c) => c.slug)
}
