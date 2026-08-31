import type {
  Job,
  JobApplication,
  JobSeekerProfile,
  JobFormData,
  JobFilters,
  JobStatus,
} from '../types/jobs'
import {
  jobs,
  jobById,
  getJobsByEmployer,
  getActiveJobs,
  getFeaturedJobs,
  getJobsByCategory,
  searchJobs,
  sortJobs,
  paginateJobs,
  applications,
  getApplicationsByApplicant,
  jobSeekerProfiles,
  getProfileByUserId,
  savedJobs,
  getSavedJobIds,
  getSavedJobs,
} from '../data/jobs'

const STORAGE_SAVED_KEY = 'saved_jobs'

export const jobService = {
  async create(data: Partial<Job> | JobFormData): Promise<Job> {
    const partial = data as JobFormData & Partial<Job>
    const newJob: Job = {
      id: `job-${Date.now()}`,
     title: partial.title || 'Untitled Job',
      category: partial.category || '',
      categorySlug: partial.categorySlug || partial.category || '',
      employerId: partial.employerId || '',
      employerName: partial.employerName || '',
      employerLogo: partial.employerLogo,
      description: partial.description || '',
      responsibilities: partial.responsibilities || '',
      requirements: partial.requirements || '',
      skills: partial.skills ? (Array.isArray(partial.skills) ? partial.skills : (partial.skills as string).split(',').map((s: string) => s.trim())) : [],
      employmentType: partial.employmentType || 'full-time',
      experienceLevel: partial.experienceLevel || 'entry',
      salary: partial.salary,
      location: partial.location || {
        state: 'Oyo',
        lga: partial.lga || '',
        town: partial.town || '',
        area: partial.area || '',
        busStop: partial.busStop || '',
        address: partial.address || '',
        latitude: partial.latitude,
        longitude: partial.longitude,
        placeId: partial.placeId,
        formattedAddress: partial.formattedAddress,
      },
      applicationMethod: partial.applicationMethod || 'platform',
      applicationContact: partial.applicationContact,
      applicationDeadline: partial.applicationDeadline,
      status: 'pending' as JobStatus,
      featured: partial.featured ?? false,
      views: 0,
      applicationCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postedBy: partial.postedBy || '',
    }
    jobs.push(newJob)
    return newJob
  },

  async getByEmployer(employerId: string): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getJobsByEmployer(employerId))
      }, 100)
    })
  },

  async getById(id: string): Promise<Job | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(jobById(id))
      }, 100)
    })
  },

  async getActive(): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getActiveJobs())
      }, 100)
    })
  },

  async getFeatured(): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFeaturedJobs())
      }, 100)
    })
  },

  async getByCategory(categorySlug: string): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getJobsByCategory(categorySlug))
      }, 100)
    })
  },

  async search(filters: JobFilters): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const query = filters.query || ''
        const result = searchJobs(query, {
          category: filters.category,
          location: filters.location,
          employmentType: filters.employmentType,
          experienceLevel: filters.experienceLevel,
        })

        if (filters.featured !== undefined) {
          return resolve(result.filter((j) => j.featured === filters.featured))
        }
        resolve(result)
      }, 100)
    })
  },

  async update(id: string, data: Partial<Job>): Promise<Job> {
    const job = jobById(id)
    if (!job) {
      throw new Error(`Job with id ${id} not found`)
    }
    const updated = { ...job, ...data, updatedAt: new Date().toISOString() }
    const idx = jobs.findIndex((j) => j.id === id)
    if (idx !== -1) {
      jobs[idx] = updated
    }
    return updated
  },

  async close(id: string): Promise<void> {
    await this.update(id, { status: 'closed' })
  },

  async delete(id: string): Promise<void> {
    const idx = jobs.findIndex((j) => j.id === id)
    if (idx !== -1) {
      jobs.splice(idx, 1)
    }
  },

  async submitForReview(id: string): Promise<void> {
    await this.update(id, { status: 'pending' })
  },

  async incrementViews(id: string): Promise<void> {
    const job = jobs.find((j) => j.id === id)
    if (job) {
      job.views += 1
      job.updatedAt = new Date().toISOString()
    }
  },
}

export const applicationService = {
  async getByApplicant(applicantId: string): Promise<JobApplication[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getApplicationsByApplicant(applicantId))
      }, 100)
    })
  },

  async add(application: Omit<JobApplication, 'id' | 'status' | 'appliedAt'> & {
    applicantId: string
    applicantName: string
    applicantPhone: string
    applicantEmail: string
    applicantMessage?: string
    cvUrl?: string
  }): Promise<JobApplication> {
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: application.jobId,
      applicantId: application.applicantId,
      applicantName: application.applicantName,
      applicantPhone: application.applicantPhone,
      applicantEmail: application.applicantEmail,
      applicantMessage: application.applicantMessage,
      cvUrl: application.cvUrl,
      status: 'submitted' as const,
      appliedAt: new Date().toISOString(),
    }
    applications.push(newApplication)

    const job = jobs.find((j) => j.id === application.jobId)
    if (job) {
      job.applicationCount += 1
    }

    return newApplication
  },

  async getById(id: string): Promise<JobApplication | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(applications.find((a) => a.id === id))
      }, 100)
    })
  },

  async updateStatus(id: string, status: JobApplication['status']): Promise<void> {
    const application = applications.find((a) => a.id === id)
    if (application) {
      application.status = status
      if (status === 'reviewing') {
        application.reviewedAt = new Date().toISOString()
      }
    }
  },
}

export const profileService = {
  async getProfile(userId: string): Promise<JobSeekerProfile | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getProfileByUserId(userId))
      }, 100)
    })
  },

  async updateProfile(userId: string, data: Partial<JobSeekerProfile>): Promise<JobSeekerProfile> {
    const profile = jobSeekerProfiles.find((p) => p.userId === userId)
    if (!profile) {
      throw new Error(`Profile not found for user ${userId}`)
    }
    Object.assign(profile, data, { updatedAt: new Date().toISOString() })
    return profile
  },

  async createProfile(profile: JobSeekerProfile): Promise<JobSeekerProfile> {
    jobSeekerProfiles.push(profile)
    return profile
  },
}

export const savedJobsService = {
  isSaved(jobId: string): boolean {
    const stored = localStorage.getItem(STORAGE_SAVED_KEY)
    let savedIds: string[] = []
    if (stored) {
      try {
        savedIds = JSON.parse(stored)
      } catch {
        savedIds = []
      }
    }
    return savedIds.includes(jobId) || savedJobs.includes(jobId)
  },

  toggle(jobId: string): boolean {
    const stored = localStorage.getItem(STORAGE_SAVED_KEY)
    let savedIds: string[] = []
    if (stored) {
      try {
        savedIds = JSON.parse(stored)
      } catch {
        savedIds = []
      }
    }

    const existingIdx = savedIds.indexOf(jobId)
    if (existingIdx !== -1) {
      savedIds.splice(existingIdx, 1)
    } else {
      savedIds.push(jobId)
    }
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedIds))
    return existingIdx === -1
  },

  async getSavedJobDetails(): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_SAVED_KEY)
        let savedIds: string[] = []
        if (stored) {
          try {
            savedIds = JSON.parse(stored)
          } catch {
            savedIds = []
          }
        }
        const allIds = [...new Set([...savedIds, ...savedJobs])]
        resolve(jobs.filter((job) => allIds.includes(job.id)))
      }, 100)
    })
  },

  remove(jobId: string): void {
    const stored = localStorage.getItem(STORAGE_SAVED_KEY)
    if (!stored) return
    let savedIds: string[] = []
    try {
      savedIds = JSON.parse(stored)
    } catch {
      return
    }
    const idx = savedIds.indexOf(jobId)
    if (idx !== -1) {
      savedIds.splice(idx, 1)
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedIds))
    }
  },
}
