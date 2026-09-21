import { apiClient } from './apiClient'
import type { Business, BusinessFilters, Category, Location, BusinessStats } from '../types/business'
import type { Job, JobFilters } from '../types/jobs'
import type { SupportRequest, HelpFilters } from '../types/help'
import type { CommunityReport, CommunityFilters } from '../types/community'
import type { AuthUser, Capability } from '../services/authService'

export interface AdminDashboardStats {
  totalUsers: number | null
  totalBusinesses: number | null
  pendingVerifications: number | null
  verifiedBusinesses: number | null
  activeJobs: number | null
  pendingJobReviews: number | null
  communityReports: number | null
  pendingHelpRequests: number | null
}

export interface AdminPendingAction {
  id: string
  type: 'business_verification' | 'job_review' | 'community_report' | 'help_request' | 'payout'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  actionUrl: string
}

export interface AdminSystemStatus {
  authentication: 'operational' | 'degraded' | 'offline'
  api: 'operational' | 'degraded' | 'offline'
  maps: 'operational' | 'degraded' | 'offline'
  backend: 'operational' | 'degraded' | 'offline'
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const response = await apiClient.get<AdminDashboardStats>('/admin/stats')
      return response.data
    } catch {
      return {
        totalUsers: null,
        totalBusinesses: null,
        pendingVerifications: null,
        verifiedBusinesses: null,
        activeJobs: null,
        pendingJobReviews: null,
        communityReports: null,
        pendingHelpRequests: null,
      }
    }
  },

  async getPendingActions(): Promise<AdminPendingAction[]> {
    try {
      const response = await apiClient.get<AdminPendingAction[]>('/admin/pending-actions')
      return response.data
    } catch {
      return []
    }
  },

  async getSystemStatus(): Promise<AdminSystemStatus> {
    try {
      const response = await apiClient.get<AdminSystemStatus>('/admin/system-status')
      return response.data
    } catch {
      return {
        authentication: 'offline',
        api: 'offline',
        maps: 'offline',
        backend: 'offline',
      }
    }
  },

  async getRecentActivity(limit: number = 20): Promise<AdminPendingAction[]> {
    try {
      const response = await apiClient.get<AdminPendingAction[]>(`/admin/activity?limit=${limit}`)
      return response.data
    } catch {
      return []
    }
  },

  async searchUsers(filters: { page?: number; limit?: number; search?: string; role?: string; status?: string }): Promise<{ items: AuthUser[]; total: number }> {
    try {
      const params = new URLSearchParams()
      if (filters.page) params.set('page', String(filters.page))
      if (filters.limit) params.set('limit', String(filters.limit))
      if (filters.search) params.set('search', filters.search)
      if (filters.role) params.set('role', filters.role)
      if (filters.status) params.set('status', filters.status)

      const response = await apiClient.get<{ items: AuthUser[]; total: number }>(`/admin/users?${params.toString()}`)
      return response.data
    } catch {
      return { items: [], total: 0 }
    }
  },

  async updateUserRole(userId: string, role: AuthUser['role']): Promise<AuthUser> {
    const response = await apiClient.patch<AuthUser>(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  async suspendUser(userId: string): Promise<void> {
    await apiClient.post<void>(`/admin/users/${userId}/suspend`, {})
  },

  async activateUser(userId: string): Promise<void> {
    await apiClient.post<void>(`/admin/users/${userId}/activate`, {})
  },

  async getBusinesses(filters: BusinessFilters & { page?: number; limit?: number }): Promise<{ items: Business[]; total: number }> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, String(value))
        }
      })
      const response = await apiClient.get<{ items: Business[]; total: number }>(`/admin/businesses?${params.toString()}`)
      return response.data
    } catch {
      return { items: [], total: 0 }
    }
  },

  async approveBusiness(id: string): Promise<Business> {
    const response = await apiClient.post<Business>(`/admin/businesses/${id}/approve`, {})
    return response.data
  },

  async rejectBusiness(id: string, reason: string): Promise<Business> {
    const response = await apiClient.post<Business>(`/admin/businesses/${id}/reject`, { reason })
    return response.data
  },

  async verifyBusiness(id: string): Promise<Business> {
    const response = await apiClient.post<Business>(`/admin/businesses/${id}/verify`, {})
    return response.data
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/admin/categories')
      return response.data
    } catch {
      return []
    }
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const response = await apiClient.post<Category>('/admin/categories', category)
    return response.data
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await apiClient.patch<Category>(`/admin/categories/${id}`, category)
    return response.data
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<void>(`/admin/categories/${id}`)
  },

  async getJobs(filters: JobFilters & { page?: number; limit?: number }): Promise<{ items: Job[]; total: number }> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, String(value))
        }
      })
      const response = await apiClient.get<{ items: Job[]; total: number }>(`/admin/jobs?${params.toString()}`)
      return response.data
    } catch {
      return { items: [], total: 0 }
    }
  },

  async approveJob(id: string): Promise<Job> {
    const response = await apiClient.post<Job>(`/admin/jobs/${id}/approve`, {})
    return response.data
  },

  async rejectJob(id: string, reason: string): Promise<Job> {
    const response = await apiClient.post<Job>(`/admin/jobs/${id}/reject`, { reason })
    return response.data
  },

  async getCommunityReports(filters: CommunityFilters & { page?: number; limit?: number }): Promise<{ items: CommunityReport[]; total: number }> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, String(value))
        }
      })
      const response = await apiClient.get<{ items: CommunityReport[]; total: number }>(`/admin/community/reports?${params.toString()}`)
      return response.data
    } catch {
      return { items: [], total: 0 }
    }
  },

  async moderateReport(id: string, action: 'approve' | 'reject' | 'dismiss', note?: string): Promise<CommunityReport> {
    const response = await apiClient.post<CommunityReport>(`/admin/community/reports/${id}/moderate`, { action, note })
    return response.data
  },

  async getHelpRequests(filters: HelpFilters & { page?: number; limit?: number }): Promise<{ items: SupportRequest[]; total: number }> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, String(value))
        }
      })
      const response = await apiClient.get<{ items: SupportRequest[]; total: number }>(`/admin/help/requests?${params.toString()}`)
      return response.data
    } catch {
      return { items: [], total: 0 }
    }
  },

  async getAuditLogs(filters: Record<string, string | number | boolean | undefined>): Promise<{ items: AdminAuditLog[]; total: number }> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, String(value))
        }
      })
      const response = await apiClient.get<{ items: AdminAuditLog[]; total: number }>(`/admin/audit-logs?${params.toString()}`)
      return response.data
    } catch {
      return { items: [], total: 0 }
    }
  },
}

export interface AdminAuditLog {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  entityType: string
  entityId: string
  metadata: Record<string, unknown>
  createdAt: string
}