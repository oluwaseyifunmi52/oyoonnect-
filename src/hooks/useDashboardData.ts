import { useEffect, useState } from 'react'
import type { AuthUser } from '../services/authService'
import { favoritesService } from '../services/businessService'
import { applicationService, interviewService, savedJobsService } from '../services/jobService'
import { helpService } from '../services/helpService'
import { notificationService } from '../services/notificationService'
import { businessService } from '../services/businessService'
import type { Business, BusinessStats } from '../types/business'
import type { Job, JobApplication, Interview } from '../types/jobs'
import type { SupportRequest } from '../types/help'
import type { Notification } from '../types/notifications'
import { jobService } from '../services/jobService'

export interface DashboardSectionState<T> {
  data: T
  loading: boolean
  error: string | null
}

export interface DashboardData {
  savedBusinesses: DashboardSectionState<Business[]>
  savedJobs: DashboardSectionState<Job[]>
  applications: DashboardSectionState<JobApplication[]>
  helpRequests: DashboardSectionState<SupportRequest[]>
  interviews: DashboardSectionState<Interview[]>
  notifications: DashboardSectionState<Notification[]>
  businesses: DashboardSectionState<Business[]>
  businessStats: DashboardSectionState<BusinessStats | null>
  jobMap: DashboardSectionState<Map<string, Job>>
}

function initialState<T>(data: T): DashboardSectionState<T> {
  return { data, loading: true, error: null }
}

function createInitialState(): DashboardData {
  return {
    savedBusinesses: initialState([]),
    savedJobs: initialState([]),
    applications: initialState([]),
    helpRequests: initialState([]),
    interviews: initialState([]),
    notifications: initialState([]),
    businesses: initialState([]),
    businessStats: initialState(null),
    jobMap: initialState(new Map()),
  }
}

export function useDashboardData(user: AuthUser | null) {
  const [data, setData] = useState<DashboardData>(createInitialState)
  const [loaded, setLoaded] = useState(false)

  const userId = user?.id ?? null
  const isBusinessOwner = user?.role === 'business_owner' || user?.role === 'admin'
  const isServiceProvider = user?.role === 'service_provider' || user?.role === 'admin'

  useEffect(() => {
    if (!userId) return

    let mounted = true
    const results: Partial<DashboardData> = {}

    async function load() {
      const tasks: Promise<void>[] = []

      // Always load notifications
      tasks.push(
        (async () => {
          try {
            const notifs = await notificationService.fetchFromApi()
            if (mounted) results.notifications = { data: notifs, loading: false, error: null }
          } catch {
            const notifs = notificationService.getNotifications()
            if (mounted) results.notifications = { data: notifs, loading: false, error: null }
          }
        })()
      )

      // Load all jobs for lookup (job titles, employer names, etc.)
      tasks.push(
        (async () => {
          try {
            const jobs = await jobService.search({})
            const map = new Map<string, Job>()
            jobs.forEach((j) => map.set(j.id, j))
            if (mounted) results.jobMap = { data: map, loading: false, error: null }
          } catch (e) {
            if (mounted)
              results.jobMap = {
                data: new Map(),
                loading: false,
                error: e instanceof Error ? e.message : 'Failed to load jobs',
              }
          }
        })()
      )

      // Saved businesses
      tasks.push(
        (async () => {
          try {
            const favs = await favoritesService.getFavoriteBusinesses()
            if (mounted) results.savedBusinesses = { data: favs, loading: false, error: null }
          } catch (e) {
            if (mounted)
              results.savedBusinesses = {
                data: [],
                loading: false,
                error: e instanceof Error ? e.message : 'Failed to load saved businesses',
              }
          }
        })()
      )

      // Saved jobs
      tasks.push(
        (async () => {
          try {
            const jobs = await savedJobsService.getSavedJobDetails()
            if (mounted) results.savedJobs = { data: jobs, loading: false, error: null }
          } catch (e) {
            if (mounted)
              results.savedJobs = {
                data: [],
                loading: false,
                error: e instanceof Error ? e.message : 'Failed to load saved jobs',
              }
          }
        })()
      )

      // Job applications (only if user could be a job seeker)
      if (isServiceProvider || user?.role === 'user' || user?.role === 'customer' || user?.role === 'admin') {
        tasks.push(
          (async () => {
            try {
              const apps = await applicationService.getByApplicant(userId!)
              if (mounted) results.applications = { data: apps, loading: false, error: null }
            } catch (e) {
              if (mounted)
                results.applications = {
                  data: [],
                  loading: false,
                  error: e instanceof Error ? e.message : 'Failed to load applications',
                }
            }
          })()
        )

        // Interviews for this candidate
        tasks.push(
          (async () => {
            try {
              const ints = await interviewService.getByCandidate(userId!)
              if (mounted) results.interviews = { data: ints, loading: false, error: null }
            } catch (e) {
              if (mounted)
                results.interviews = {
                  data: [],
                  loading: false,
                  error: e instanceof Error ? e.message : 'Failed to load interviews',
                }
            }
          })()
        )
      }

      // Help requests — filter by requester
      tasks.push(
        (async () => {
          try {
            const all = await helpService.search({ sort: 'recent' })
            const mine = all.filter((r) => r.requesterId === userId)
            if (mounted) results.helpRequests = { data: mine, loading: false, error: null }
          } catch (e) {
            if (mounted)
              results.helpRequests = {
                data: [],
                loading: false,
                error: e instanceof Error ? e.message : 'Failed to load help requests',
              }
          }
        })()
      )

      // Business owner data
      if (isBusinessOwner) {
        tasks.push(
          (async () => {
            try {
              const owned = await businessService.getMyBusinesses()
              if (mounted) results.businesses = { data: owned, loading: false, error: null }
            } catch (e) {
              if (mounted)
                results.businesses = {
                  data: [],
                  loading: false,
                  error: e instanceof Error ? e.message : 'Failed to load businesses',
                }
            }
          })()
        )

        tasks.push(
          (async () => {
            try {
              const stats = await businessService.getStats(userId!)
              if (mounted) results.businessStats = { data: stats, loading: false, error: null }
            } catch (e) {
              if (mounted)
                results.businessStats = {
                  data: null,
                  loading: false,
                  error: e instanceof Error ? e.message : 'Failed to load business stats',
                }
            }
          })()
        )
      }

      await Promise.all(tasks)
      if (mounted) {
        setData((prev) => ({ ...prev, ...results }))
        setLoaded(true)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [userId, isBusinessOwner, isServiceProvider, user?.role])

  const isFullyLoading = !loaded
  const overallError = data.savedBusinesses.error || data.savedJobs.error || data.applications.error || data.helpRequests.error || data.notifications.error || data.businesses.error || data.businessStats.error || data.jobMap.error

  return {
    data,
    loading: isFullyLoading,
    error: overallError,
  }
}
