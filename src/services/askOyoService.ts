import type { Business, BusinessFilters } from '../types/business'
import type { Job, JobFilters } from '../types/jobs'
import type { SupportRequest, HelpCategoryValue } from '../types/help'
import { businessService } from './businessService'
import { jobService } from './jobService'
import { helpService } from './helpService'
import { categories } from '../data/categories'

export interface AskOyoQuery {
  query?: string
  category?: string
  location?: string
}

export interface AskOyoResult {
  businesses: Business[]
  jobs: Job[]
  helpRequests: SupportRequest[]
  categories: typeof categories[0][]
}

export async function searchAskOyo(query: AskOyoQuery): Promise<AskOyoResult> {
  const [businessResults, jobResults, helpResults] = await Promise.all([
    businessService.search({
      query: query.query,
      category: query.category,
      location: query.location,
      minRating: 0,
    }),
    query.query
      ? jobService.search({
          query: query.query,
          category: query.category,
          location: query.location,
        })
      : [],
    query.query
      ? helpService.search({
          category: query.category as HelpCategoryValue,
          location: query.location,
          sort: 'recent',
        })
      : [],
  ])

  return {
    businesses: businessResults,
    jobs: jobResults,
    helpRequests: helpResults,
    categories,
  }
}

export function getCategories(): typeof categories {
  return categories
}

export function formatLocation(location?: string): string {
  if (!location) return 'Oyo State'
  const parts = location.split(',').map((p) => p.trim())
  return parts.length > 0 ? parts[0] : 'Oyo State'
}