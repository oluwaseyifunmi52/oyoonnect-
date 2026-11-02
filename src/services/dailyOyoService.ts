import type { Business } from '../types/business'
import type { Job } from '../types/jobs'
import type { SupportRequest } from '../types/help'
import { businessService } from './businessService'
import { jobService } from './jobService'
import { helpService } from './helpService'
import { communityReportsService } from './communityReportsService'

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

export const DAILY_OYO_EMPTY_STATES = {
  noJobs: 'No new jobs in your selected area yet.',
  noBusinesses: 'No new businesses in your selected area yet.',
  noHelpRequests: 'No new support requests at this time.',
  noCommunityReports: 'No local alerts at this time.',
}

export async function fetchDailyOyo(): Promise<DailyOyoSummary> {
  const [
    featuredBusinesses,
    activeJobs,
    recentHelpRequests,
    recentCommunityReports,
  ] = await Promise.all([
    businessService.getFeatured(),
    jobService.getActive(),
    helpService.getRecent(5),
    communityReportsService.getRecent(5),
  ])

  const newJobs: DailyOyoJob[] = activeJobs
    .filter((j) => j.status === 'active')
    .slice(0, 5)
    .map((j): DailyOyoJob => ({
      id: j.id,
      title: j.title,
      category: j.category,
      employerName: j.employerName || 'Unknown employer',
      location: [
        j.location?.town,
        j.location?.area,
        j.location?.state,
      ]
        .filter(Boolean)
        .join(', '),
      salary: j.salary
  ? { min: j.salary.min || 0, max: j.salary.max || 0, currency: j.salary.currency || 'NGN', period: j.salary.period || 'monthly' }
  : undefined,
      applicationDeadline: j.applicationDeadline,
      featured: j.featured,
    }))

  const newBusinesses: DailyOyoBusiness[] = featuredBusinesses
    .slice(0, 5)
    .map((b): DailyOyoBusiness => ({
      id: b.id,
      name: b.name,
      category: b.category,
      location: [
        b.locationData?.town,
        b.locationData?.area,
        b.state,
      ]
        .filter(Boolean)
        .join(', '),
      rating: b.rating,
      verified: b.verified || false,
      featured: b.featured || false,
    }))

  const newHelpRequests: DailyOyoHelpRequest[] = recentHelpRequests
    .filter((r) => r.status === 'pending_review' || r.status === 'active')
    .slice(0, 5)
    .map((r): DailyOyoHelpRequest => ({
      id: r.id,
      title: r.title,
      category: r.category,
      requesterName: r.requesterName || 'Community member',
      amountRaised: r.amountRaised,
      targetAmount: r.targetAmount,
      status: r.status,
    }))

  const newCommunityReports: DailyOyoCommunityReport[] = recentCommunityReports
    .slice(0, 5)
    .map((r): DailyOyoCommunityReport => ({
      id: r.id,
      title: r.title,
      category: r.category,
      status: r.status || 'pending',
      verified: r.verified,
    }))

  return { newJobs, newBusinesses, newHelpRequests, newCommunityReports }
}