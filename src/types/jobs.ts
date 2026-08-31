export interface JobLocation {
  state: string
  lga: string
  town: string
  area?: string
  busStop?: string
  address: string
  latitude?: number
  longitude?: number
  placeId?: string
  formattedAddress?: string
}

export interface JobCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'apprenticeship'
  | 'temporary'
  | 'remote'

export type ExperienceLevel =
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'executive'

export type JobStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'closed'
  | 'expired'
  | 'rejected'

export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'accepted'

export interface SalaryRange {
  min?: number
  max?: number
  currency: 'NGN'
  period: 'monthly' | 'annually' | 'hourly' | 'daily'
  negotiable: boolean
}

export interface Job {
  id: string
  title: string
  category: string
  categorySlug: string
  employerId: string
  employerName: string
  employerLogo?: string
  description: string
  responsibilities: string
  requirements: string
  skills: string[]
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  salary?: SalaryRange
  location: JobLocation
  applicationMethod: 'whatsapp' | 'email' | 'phone' | 'external' | 'platform'
  applicationContact?: string
  applicationDeadline?: string
  status: JobStatus
  featured: boolean
  views: number
  applicationCount: number
  createdAt: string
  updatedAt: string
  postedBy: string
}

export interface JobFormData {
  title: string
  category: string
  description: string
  responsibilities: string
  requirements: string
  skills: string
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  salaryMin?: number
  salaryMax?: number
  salaryPeriod: SalaryRange['period']
  salaryNegotiable: boolean
  lga: string
  town: string
  area: string
  busStop: string
  address: string
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
  applicationMethod: Job['applicationMethod']
  applicationContact?: string
  applicationDeadline?: string
  featured: boolean
}

export const emptyJobFormData: JobFormData = {
  title: '',
  category: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  employmentType: 'full-time',
  experienceLevel: 'entry',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryPeriod: 'monthly',
  salaryNegotiable: true,
  lga: '',
  town: '',
  area: '',
  busStop: '',
  address: '',
  latitude: 0,
  longitude: 0,
  placeId: '',
  formattedAddress: '',
  applicationMethod: 'whatsapp',
  applicationContact: '',
  applicationDeadline: '',
  featured: false,
}

export interface JobFilters {
  query?: string
  category?: string
  location?: string
  area?: string
  employmentType?: EmploymentType
  experienceLevel?: ExperienceLevel
  salaryMin?: number
  featured?: boolean
  sort?: string
  status?: JobStatus
}

export interface JobApplication {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantPhone: string
  applicantEmail: string
  applicantMessage?: string
  cvUrl?: string
  status: ApplicationStatus
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface JobSeekerProfile {
  userId: string
  fullName: string
  profilePhoto?: string
  professionalTitle: string
  skills: string[]
  yearsOfExperience: number
  education: string
  location: JobLocation
  phone: string
  whatsapp?: string
  email: string
  bio: string
  cvUrl?: string
  createdAt: string
  updatedAt: string
}

export interface SavedJob {
  id: string
  jobId: string
  userId: string
  savedAt: string
}

export interface SortOption {
  value: string
  label: string
}

export const JOB_SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'salary-high', label: 'Highest Salary' },
  { value: 'salary-low', label: 'Lowest Salary' },
  { value: 'title', label: 'Title (A-Z)' },
]

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string; description: string }[] = [
  { value: 'full-time', label: 'Full-time', description: 'Permanent, full-time position' },
  { value: 'part-time', label: 'Part-time', description: 'Fewer hours, flexible schedule' },
  { value: 'contract', label: 'Contract', description: 'Fixed-term contract' },
  { value: 'internship', label: 'Internship', description: 'Learning opportunity for students/graduates' },
  { value: 'apprenticeship', label: 'Apprenticeship', description: 'On-the-job training with certification' },
  { value: 'temporary', label: 'Temporary', description: 'Short-term or seasonal work' },
  { value: 'remote', label: 'Remote', description: 'Work from anywhere' },
]

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; years: string }[] = [
  { value: 'entry', label: 'Entry Level', years: '0-1 years' },
  { value: 'junior', label: 'Junior', years: '1-3 years' },
  { value: 'mid', label: 'Mid Level', years: '3-5 years' },
  { value: 'senior', label: 'Senior', years: '5-8 years' },
  { value: 'lead', label: 'Lead/Principal', years: '8+ years' },
  { value: 'executive', label: 'Executive', years: '10+ years' },
]

export const SALARY_PERIODS: { value: SalaryRange['period']; label: string }[] = [
  { value: 'monthly', label: 'Per Month' },
  { value: 'annually', label: 'Per Year' },
  { value: 'hourly', label: 'Per Hour' },
  { value: 'daily', label: 'Per Day' },
]

export const APPLICATION_METHODS: { value: Job['applicationMethod']; label: string; description: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp', description: 'Apply via WhatsApp message' },
  { value: 'email', label: 'Email', description: 'Send application to email' },
  { value: 'phone', label: 'Phone', description: 'Call to apply' },
  { value: 'external', label: 'External Link', description: 'Redirect to company website' },
  { value: 'platform', label: 'Apply Here', description: 'Apply through OyoConnect' },
]

export function getEmploymentTypeLabel(type: EmploymentType): string {
  return EMPLOYMENT_TYPES.find(t => t.value === type)?.label || type
}

export function getExperienceLevelLabel(level: ExperienceLevel): string {
  return EXPERIENCE_LEVELS.find(l => l.value === level)?.label || level
}

export function getApplicationMethodLabel(method: Job['applicationMethod']): string {
  return APPLICATION_METHODS.find(m => m.value === method)?.label || method
}

export function formatSalary(salary: {
  min?: number
  max?: number
  currency: 'NGN'
  period: 'monthly' | 'annually' | 'hourly' | 'daily'
  negotiable: boolean
}): string {
  const { min, max, period, negotiable } = salary
  const formatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 })

  if (min && max) {
    return `₦${formatter.format(min)} - ₦${formatter.format(max)}/${period.charAt(0).toUpperCase() + period.slice(1)}${negotiable ? ' (Negotiable)' : ''}`
  } else if (min) {
    return `₦${formatter.format(min)}+/${period.charAt(0).toUpperCase() + period.slice(1)}${negotiable ? ' (Negotiable)' : ''}`
  } else if (max) {
    return `Up to ₦${formatter.format(max)}/${period.charAt(0).toUpperCase() + period.slice(1)}${negotiable ? ' (Negotiable)' : ''}`
  }
  return `Negotiable${negotiable ? ' (Negotiable)' : ''}`
}