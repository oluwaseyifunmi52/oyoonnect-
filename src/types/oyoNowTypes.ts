import type { Business } from '../types/business'
import type { Job } from '../types/jobs'
import type { SupportRequest } from '../types/help'
import type { Category } from '../types/business'

export interface DailyOyoJob {
  id: string
  title: string
  category: string
  employerName: string
  location: string
  salary?: { min: number; max: number; currency: string; period: string }
  applicationDeadline?: string
  featured: boolean
}

export interface DailyOyoBusiness {
  id: string
  name: string
  category: string
  location: string
  rating: number
  verified: boolean
  featured: boolean
}

export interface DailyOyoHelpRequest {
  id: string
  title: string
  category: string
  requesterName: string
  amountRaised?: number
  targetAmount?: number
  status: string
}

export interface DailyOyoCommunityReport {
  id: string
  title: string
  category: string
  status: string
  verified: boolean
}

export interface DailyOyoSummary {
  newJobs: DailyOyoJob[]
  newBusinesses: DailyOyoBusiness[]
  newHelpRequests: DailyOyoHelpRequest[]
  newCommunityReports: DailyOyoCommunityReport[]
}

export interface AskOyoQuery {
  query?: string
  category?: string
  location?: string
}

export interface AskOyoResult {
  businesses: Business[]
  jobs: Job[]
  helpRequests: SupportRequest[]
  categories: Category[]
}

export interface PriceWatchItem {
  id: string
  item: string
  category: string
  price: string
  unit: string
  location: string
  source: 'business' | 'user' | 'system'
  reportedBy?: string
  createdAt: string
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  description?: string
}

export interface PriceWatchEmptyState {
  title: string
  description: string
}

export interface LocalAlert {
  id: string
  title: string
  category: string
  status: 'REPORTED' | 'VERIFYING' | 'CONFIRMED' | 'RESOLVED' | 'EXPIRED' | 'REJECTED'
  reportedBy?: string
  createdAt: string
  description?: string
}

export interface LocalAlertEmptyState {
  title: string
  description: string
}

export const PRICE_WATCH_EMPTY: PriceWatchEmptyState = {
  title: 'No price updates today',
  description: 'Price information will appear here when users or businesses report local prices.',
}

export const LOCAL_ALERTS_EMPTY: LocalAlertEmptyState = {
  title: 'No local alerts at this time',
  description: 'Community reports will appear here when local issues are verified.',
}