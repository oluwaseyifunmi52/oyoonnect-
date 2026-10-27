export type HomeCategory = 'Jobs' | 'Businesses' | 'Community'

export interface HomeUser {
  name: string
  role: string
  avatar: string
}

export interface HomeNotification {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
  href: string
}

export interface HomeUpdate {
  id: string
  category: HomeCategory
  title: string
  description: string
  location: string
  createdAt: string
  href: string
  image: string
}

export interface HomeEvent {
  id: string
  title: string
  venue: string
  location: string
  startsAt: string
  endsAt: string
  href: string
}

export interface HomeSearchItem {
  id: string
  category: HomeCategory
  title: string
  description: string
  location: string
  href: string
  image?: string
}

export interface HomePlace {
  id: string
  name: string
  category: string
  description: string
  location: string
  latitude: number
  longitude: number
  href: string
}

export const homeMockUser: HomeUser = {
  name: 'Oluwaseyi Abayomi',
  role: 'User',
  avatar: '/images/mock-user-avatar.svg',
}

export const homeMockNotifications: HomeNotification[] = [
  { id: 'n1', title: 'Your community is growing', body: 'A new neighbor joined the OyoConnect community.', createdAt: '2026-10-24T08:00:00+01:00', read: false, href: '/community' },
  { id: 'n2', title: 'New jobs near you', body: 'There are fresh opportunities around Ibadan.', createdAt: '2026-10-24T06:00:00+01:00', read: false, href: '/jobs' },
  { id: 'n3', title: 'Community update', body: 'A road maintenance report was updated.', createdAt: '2026-10-23T16:00:00+01:00', read: true, href: '/community' },
]

export const homeMockUpdates: HomeUpdate[] = [
  { id: 'u1', category: 'Jobs', title: 'Customer Experience Associate', description: 'Full-time · OyoConnect Careers', location: 'Ibadan', createdAt: '2026-10-24T08:00:00+01:00', href: '/jobs', image: '/images/oyo-hero.jpg' },
  { id: 'u2', category: 'Businesses', title: 'Abeni Kitchen & Café', description: 'Food & dining · Local favorite', location: 'Ibadan', createdAt: '2026-10-24T06:00:00+01:00', href: '/business', image: '/images/oyo-hero.jpg' },
  { id: 'u3', category: 'Community', title: 'New streetlights for Bodija', description: 'Community report · In progress', location: 'Ibadan', createdAt: '2026-10-23T16:00:00+01:00', href: '/community', image: '/images/oyo-hero.jpg' },
]

export const homeMockEvents: HomeEvent[] = [
  { id: 'e1', title: 'Oyo Tech Meetup', venue: 'Cocoa House', location: 'Ibadan', startsAt: '2026-11-02T18:00:00+01:00', endsAt: '2026-11-02T20:00:00+01:00', href: '/community/events/e1' },
  { id: 'e2', title: 'Small Business Workshop', venue: 'City Hall', location: 'Ogbomoso', startsAt: '2026-11-08T10:00:00+01:00', endsAt: '2026-11-08T13:00:00+01:00', href: '/community/events/e2' },
  { id: 'e3', title: 'Community Cleanup Day', venue: 'Agodi Gardens', location: 'Ibadan', startsAt: '2026-11-15T08:00:00+01:00', endsAt: '2026-11-15T11:00:00+01:00', href: '/community/events/e3' },
]

export const homeMockPlaces: HomePlace[] = [
  { id: 'p1', name: 'Abeni Kitchen & Café', category: 'Food & dining', description: 'Fresh local meals, coffee and pastries.', location: 'Ibadan', latitude: 7.3775, longitude: 3.9470, href: '/business' },
  { id: 'p2', name: 'Oyo Home Repairs', category: 'Home services', description: 'Trusted plumbing and electrical services.', location: 'Ibadan', latitude: 7.4012, longitude: 3.9168, href: '/business' },
  { id: 'p3', name: 'Bodija Fresh Market', category: 'Shopping', description: 'Fruit, vegetables and everyday essentials.', location: 'Ibadan', latitude: 7.4384, longitude: 3.9167, href: '/business' },
  { id: 'p4', name: 'Ogbomoso Craft House', category: 'Arts & crafts', description: 'Local makers and handmade goods.', location: 'Ogbomoso', latitude: 8.1330, longitude: 4.2400, href: '/business' },
  { id: 'p5', name: 'Oyo Heritage Walks', category: 'Attractions', description: 'Discover Oyo history with local guides.', location: 'Oyo', latitude: 7.8500, longitude: 3.9333, href: '/business' },
]

export const homeMockMarketListings = [
  { id: 'm1', name: 'Handwoven Aso-Oke fabric', category: 'Fashion', price: '₦18,000', location: 'Ibadan', description: 'Made by local artisans in Oyo State.' },
  { id: 'm2', name: 'Fresh farm produce box', category: 'Food', price: '₦8,500', location: 'Ibadan', description: 'Seasonal vegetables from nearby farms.' },
  { id: 'm3', name: 'Handmade leather sandals', category: 'Fashion', price: '₦12,000', location: 'Ogbomoso', description: 'Handcrafted and made to order.' },
  { id: 'm4', name: 'Home cleaning service', category: 'Services', price: 'From ₦10,000', location: 'Ibadan', description: 'Book a trusted local home cleaning team.' },
]

export const homeMockSearchItems: HomeSearchItem[] = [
  { id: 'j1', category: 'Jobs', title: 'Customer Experience Associate', description: 'Full-time role · OyoConnect Careers', location: 'Ibadan', href: '/jobs', image: '/images/oyo-hero.jpg' },
  { id: 'j2', category: 'Jobs', title: 'Solar Installation Technician', description: 'Skilled trades · Flexible hours', location: 'Ogbomoso', href: '/jobs', image: '/images/oyo-hero.jpg' },
  { id: 'b1', category: 'Businesses', title: 'Abeni Kitchen & Café', description: 'Nigerian food · Open today', location: 'Ibadan', href: '/business', image: '/images/oyo-hero.jpg' },
  { id: 'b2', category: 'Businesses', title: 'Oyo Home Repairs', description: 'Plumbing, electrical and home services', location: 'Oyo', href: '/business', image: '/images/oyo-hero.jpg' },
  { id: 'c1', category: 'Community', title: 'New streetlights for Bodija', description: 'Report · In progress', location: 'Ibadan', href: '/community', image: '/images/oyo-hero.jpg' },
  { id: 'c2', category: 'Community', title: 'Saturday market cleanup', description: 'Community activity · Volunteers welcome', location: 'Iseyin', href: '/community', image: '/images/oyo-hero.jpg' },
]

const delay = (ms = 600) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export async function loadHomeUser() { await delay(); return homeMockUser }
export async function loadHomeNotifications() { await delay(); return homeMockNotifications.map((item) => ({ ...item })) }
export async function loadHomeUpdates() { await delay(); return homeMockUpdates }
export async function loadHomeEvents() { await delay(); return homeMockEvents }

export function relativeTime(date: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.floor((now - new Date(date).getTime()) / 60_000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
