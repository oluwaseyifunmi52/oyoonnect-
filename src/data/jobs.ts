/**
 * DEVELOPMENT-ONLY data layer for Jobs.
 *
 * All arrays are empty. This file provides in-memory utility functions
 * used by jobService.ts during local development. In production these
 * functions will be replaced by API calls through apiClient.
 */
import type { Job, JobLocation, JobApplication, JobSeekerProfile, JobStatus, Interview } from '../types/jobs'

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

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    category: 'Information Technology',
    categorySlug: 'information-technology',
    employerId: 'emp-1',
    employerName: 'TechCorp Nigeria',
    employerLogo: 'https://example.com/logos/techcorp.png',
    description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining modern web applications using React and TypeScript.',
    responsibilities: '• Develop and maintain frontend applications using React and TypeScript\n• Collaborate with designers and backend developers\n• Write clean, maintainable, and testable code\n• Participate in code reviews and architectural decisions\n• Optimize applications for maximum speed and scalability',
    requirements: '• 5+ years of experience with React and TypeScript\n• Strong understanding of modern frontend architectures\n• Experience with state management (Redux, Zustand, or similar)\n• Familiarity with testing frameworks (Jest, React Testing Library)\n• Experience with CI/CD pipelines',
    skills: ['React', 'TypeScript', 'Redux', 'Jest', 'Git', 'CI/CD'],
    employmentType: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 300000, max: 500000, currency: 'NGN', period: 'monthly', negotiable: true },
    location: { state: 'Oyo', lga: 'Ibadan North', town: 'Bodija', area: 'UI Area', busStop: 'UI Gate', address: 'University of Ibadan, Ibadan', latitude: 7.4333, longitude: 3.9000, formattedAddress: 'University of Ibadan, Ibadan, Oyo State' },
    applicationMethod: 'platform',
    applicationContact: undefined,
    applicationDeadline: '2024-02-15',
    status: 'active',
    featured: true,
    views: 245,
    applicationCount: 12,
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z',
    postedBy: 'emp-1',
  },
  {
    id: 'job-2',
    title: 'Backend Developer (Node.js)',
    category: 'Information Technology',
    categorySlug: 'information-technology',
    employerId: 'emp-2',
    employerName: 'DataSoft Solutions',
    employerLogo: 'https://example.com/logos/datasoft.png',
    description: 'We are seeking a Backend Developer to build scalable APIs and microservices using Node.js and PostgreSQL.',
    responsibilities: '• Design and develop RESTful APIs and GraphQL endpoints\n• Work with PostgreSQL databases and optimize queries\n• Implement authentication and authorization systems\n• Write unit and integration tests\n• Collaborate with frontend developers and product managers',
    requirements: '• 3+ years of experience with Node.js\n• Strong knowledge of PostgreSQL and database design\n• Experience with TypeScript and modern Node.js frameworks\n• Understanding of microservices architecture\n• Experience with Docker and containerization',
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS'],
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 250000, max: 400000, currency: 'NGN', period: 'monthly', negotiable: true },
    location: { state: 'Oyo', lga: 'Ibadan South West', town: 'Ring Road', area: 'Agodi', busStop: 'Secretariat', address: 'Secretariat, Ibadan, Oyo State', latitude: 7.3775, longitude: 3.9470, formattedAddress: 'Secretariat, Ibadan, Oyo State' },
    applicationMethod: 'platform',
    applicationContact: undefined,
    applicationDeadline: '2024-02-20',
    status: 'active',
    featured: false,
    views: 189,
    applicationCount: 8,
    createdAt: '2024-01-05T09:30:00.000Z',
    updatedAt: '2024-01-05T09:30:00.000Z',
    postedBy: 'emp-2',
  },
  {
    id: 'job-3',
    title: 'Marketing Manager',
    category: 'Sales & Marketing',
    categorySlug: 'sales-marketing',
    employerId: 'emp-3',
    employerName: 'Growth Agency',
    employerLogo: 'https://example.com/logos/growthagency.png',
    description: 'We are looking for a Marketing Manager to lead our digital marketing efforts and drive brand awareness.',
    responsibilities: '• Develop and execute marketing strategies\n• Manage social media campaigns and content calendar\n• Analyze marketing metrics and optimize campaigns\n• Collaborate with sales team on lead generation\n• Manage marketing budget and vendor relationships',
    requirements: '• 4+ years of marketing experience\n• Proven track record of successful campaigns\n• Experience with digital marketing tools (Google Ads, Meta Ads, etc.)\n• Strong analytical and communication skills\n• Experience with marketing automation platforms',
    skills: ['Digital Marketing', 'Google Ads', 'Meta Ads', 'Analytics', 'Content Strategy', 'SEO'],
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 200000, max: 350000, currency: 'NGN', period: 'monthly', negotiable: true },
    location: { state: 'Oyo', lga: 'Ogbomoso North', town: 'Ogbomoso', area: 'Central', busStop: 'Under G', address: 'Ogbomoso, Oyo State', latitude: 8.1333, longitude: 4.2500, formattedAddress: 'Ogbomoso, Oyo State' },
    applicationMethod: 'platform',
    applicationContact: undefined,
    applicationDeadline: '2024-02-10',
    status: 'active',
    featured: true,
    views: 156,
    applicationCount: 5,
    createdAt: '2023-12-20T11:00:00.000Z',
    updatedAt: '2023-12-20T11:00:00.000Z',
    postedBy: 'emp-3',
  },
  {
    id: 'job-4',
    title: 'Customer Support Specialist',
    category: 'Customer Service',
    categorySlug: 'customer-service',
    employerId: 'emp-4',
    employerName: 'ConnectTel',
    employerLogo: 'https://example.com/logos/connecttel.png',
    description: 'Join our customer support team and help our users get the most out of our services.',
    responsibilities: '• Respond to customer inquiries via phone, email, and chat\n• Troubleshoot technical issues and escalate when needed\n• Maintain customer satisfaction scores\n• Document common issues and solutions\n• Participate in training and quality assurance',
    requirements: '• Excellent communication skills in English and Yoruba\n• Previous customer service experience preferred\n• Ability to work in shifts\n• Strong problem-solving skills\n• Empathy and patience',
    skills: ['Customer Support', 'Communication', 'Problem Solving', 'CRM Tools'],
    employmentType: 'full-time',
    experienceLevel: 'entry',
    salary: { min: 120000, max: 180000, currency: 'NGN', period: 'monthly', negotiable: false },
    location: { state: 'Oyo', lga: 'Ibadan North East', town: 'Iwo Road', area: 'Challenge', busStop: 'Challenge', address: 'Iwo Road, Ibadan, Oyo State', latitude: 7.4167, longitude: 3.9333, formattedAddress: 'Iwo Road, Ibadan, Oyo State' },
    applicationMethod: 'platform',
    applicationContact: undefined,
    applicationDeadline: '2024-01-31',
    status: 'active',
    featured: false,
    views: 87,
    applicationCount: 3,
    createdAt: '2024-01-01T12:00:00.000Z',
    updatedAt: '2024-01-01T12:00:00.000Z',
    postedBy: 'emp-4',
  },
  {
    id: 'job-5',
    title: 'Junior Graphic Designer',
    category: 'Creative & Design',
    categorySlug: 'creative-design',
    employerId: 'emp-5',
    employerName: 'Creative Studio',
    employerLogo: 'https://example.com/logos/creativestudio.png',
    description: 'We are looking for a Junior Graphic Designer to create visual content for our clients.',
    responsibilities: '• Create graphics for social media, web, and print\n• Collaborate with marketing team on campaigns\n• Maintain brand guidelines across all materials\n• Assist with video editing and motion graphics\n• Stay updated on design trends',
    requirements: '• 1-2 years of graphic design experience\n• Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)\n• Portfolio demonstrating design skills\n• Basic knowledge of motion graphics is a plus\n• Strong attention to detail',
    skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Motion Graphics'],
    employmentType: 'full-time',
    experienceLevel: 'junior',
    salary: { min: 100000, max: 150000, currency: 'NGN', period: 'monthly', negotiable: true },
    location: { state: 'Oyo', lga: 'Ibadan South East', town: 'Mapo', area: 'Dugbe', busStop: 'Dugbe', address: 'Dugbe, Ibadan, Oyo State', latitude: 7.3833, longitude: 3.9000, formattedAddress: 'Dugbe, Ibadan, Oyo State' },
    applicationMethod: 'platform',
    applicationContact: undefined,
    applicationDeadline: '2024-02-05',
    status: 'active',
    featured: false,
    views: 92,
    applicationCount: 7,
    createdAt: '2024-01-08T14:00:00.000Z',
    updatedAt: '2024-01-08T14:00:00.000Z',
    postedBy: 'emp-5',
  },
]

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

export const applications: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    applicantId: 'user-1',
    applicantName: 'John Doe',
    applicantPhone: '+234 801 234 5678',
    applicantEmail: 'john.doe@example.com',
    applicantMessage: 'I am very interested in this position and believe my skills match the requirements.',
    cvUrl: undefined,
    status: 'submitted',
    appliedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    applicantId: 'user-1',
    applicantName: 'John Doe',
    applicantPhone: '+234 801 234 5678',
    applicantEmail: 'john.doe@example.com',
    applicantMessage: 'I have 3 years of experience in this field and would love to contribute.',
    cvUrl: undefined,
    status: 'reviewing',
    appliedAt: '2024-01-10T14:20:00.000Z',
    reviewedAt: '2024-01-12T09:00:00.000Z',
    reviewedBy: 'emp-1',
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    applicantId: 'user-1',
    applicantName: 'John Doe',
    applicantPhone: '+234 801 234 5678',
    applicantEmail: 'john.doe@example.com',
    applicantMessage: 'Looking forward to contributing to your team.',
    cvUrl: undefined,
    status: 'accepted',
    appliedAt: '2024-01-05T09:15:00.000Z',
    reviewedAt: '2024-01-08T11:30:00.000Z',
    reviewedBy: 'emp-2',
  },
  {
    id: 'app-4',
    jobId: 'job-4',
    applicantId: 'user-1',
    applicantName: 'John Doe',
    applicantPhone: '+234 801 234 5678',
    applicantEmail: 'john.doe@example.com',
    applicantMessage: 'I believe I would be a great fit for this role.',
    cvUrl: undefined,
    status: 'rejected',
    appliedAt: '2023-12-20T11:00:00.000Z',
    reviewedAt: '2023-12-22T16:45:00.000Z',
    reviewedBy: 'emp-3',
  },
  {
    id: 'app-5',
    jobId: 'job-5',
    applicantId: 'user-1',
    applicantName: 'John Doe',
    applicantPhone: '+234 801 234 5678',
    applicantEmail: 'john.doe@example.com',
    applicantMessage: 'Excited about this opportunity!',
    cvUrl: undefined,
    status: 'shortlisted',
    appliedAt: '2024-01-18T08:45:00.000Z',
  },
]

export function getApplicationsByApplicant(applicantId: string): JobApplication[] {
  return applications.filter((app) => app.applicantId === applicantId)
}

export function getApplicationById(id: string): JobApplication | undefined {
  return applications.find((app) => app.id === id)
}

export function getInterviewById(id: string): Interview | undefined {
  return interviews.find((interview) => interview.id === id)
}

export function getInterviewsByApplication(jobId: string, applicationId: string): Interview[] {
  return interviews.filter((interview) => interview.jobId === jobId && interview.applicationId === applicationId)
}

export function getInterviewsByCandidate(candidateId: string): Interview[] {
  return interviews.filter((interview) => interview.candidateId === candidateId)
}

export function getInterviewsByEmployer(employerId: string): Interview[] {
  return interviews.filter((interview) => interview.employerId === employerId)
}

export const interviews: Interview[] = []

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