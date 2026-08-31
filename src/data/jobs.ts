import type { Job, JobLocation, JobApplication, JobSeekerProfile, JobStatus } from '../types/jobs'

function createLocation(overrides: Partial<JobLocation> = {}): JobLocation {
  return {
    state: 'Oyo',
    lga: 'Ibadan North',
    town: 'Bodija',
    area: 'UI Area',
    busStop: 'UI Gate',
    address: 'University of Ibadan, Ibadan',
    latitude: 7.4333,
    longitude: 3.9000,
    ...overrides,
  }
}

export const jobs: Job[] = []

export function jobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id)
}

export function getJobsByEmployer(employerId: string): Job[] {
  return jobs.filter((job) => job.employerId === employerId)
}

export function getActiveJobs(): Job[] {
  return jobs.filter((job) => job.status === 'active')
}

export function getFeaturedJobs(): Job[] {
  return jobs.filter((job) => job.status === 'active' && job.featured)
}

export function getJobsByCategory(categorySlug: string): Job[] {
  return jobs.filter((job) => job.categorySlug === categorySlug && job.status === 'active')
}

export function getJobsByCategorySlug(categorySlug: string): Job[] {
  return jobs.filter((job) => job.categorySlug === categorySlug && job.status === 'active')
}

export function searchJobs(query: string, filters?: {
  category?: string
  location?: string
  employmentType?: string
  experienceLevel?: string
}): Job[] {
  let results = getActiveJobs()

  if (query) {
    const q = query.toLowerCase()
    results = results.filter((job) =>
      job.title.toLowerCase().includes(q) ||
      job.category.toLowerCase().includes(q) ||
      job.employerName.toLowerCase().includes(q) ||
      job.skills.some(s => s.toLowerCase().includes(q))
    )
  }

  if (filters?.category) {
    results = results.filter((job) => job.categorySlug === filters.category)
  }

  if (filters?.location) {
    results = results.filter((job) =>
      job.location.lga.toLowerCase().includes(filters.location!.toLowerCase()) ||
      job.location.town.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }

  if (filters?.employmentType) {
    results = results.filter((job) => job.employmentType === filters.employmentType)
  }

  if (filters?.experienceLevel) {
    results = results.filter((job) => job.experienceLevel === filters.experienceLevel)
  }

  return results
}

export function sortJobs(jobs: Job[], sortBy: string): Job[] {
  const sorted = [...jobs]
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'salary-high':
      return sorted.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0))
    case 'salary-low':
      return sorted.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0))
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

export function paginateJobs<T>(
  items: T[],
  page: number,
  itemsPerPage: number
): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  return {
    items: items.slice(start, end),
    totalPages,
    totalItems,
  }
}

export const applications: JobApplication[] = []

export function getApplicationsByApplicant(applicantId: string): JobApplication[] {
  return applications.filter((app) => app.applicantId === applicantId)
}

export function getApplicationById(id: string): JobApplication | undefined {
  return applications.find((app) => app.id === id)
}

export const jobSeekerProfiles: JobSeekerProfile[] = []

export function getProfileByUserId(userId: string): JobSeekerProfile | undefined {
  return jobSeekerProfiles.find((p) => p.userId === userId)
}

export const savedJobs: string[] = []

export function getSavedJobIds(): string[] {
  return [...savedJobs]
}

export function getSavedJobs(): Job[] {
  return jobs.filter((job) => savedJobs.includes(job.id))
}

export const jobStatuses: { value: JobStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'expired', label: 'Expired' },
  { value: 'rejected', label: 'Rejected' },
]

export function isJobClosed(status: JobStatus): boolean {
  return status === 'closed' || status === 'expired' || status === 'rejected'
}

export function isJobActive(status: JobStatus): boolean {
  return status === 'active'
}