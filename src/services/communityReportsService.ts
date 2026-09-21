import type {
  CommunityReport,
  CommunityReportFormData,
  CommunityFilters,
  CommunityComment,
  CommunityReportStats,
  CommunityReportListResult,
} from '../types/community'
import { apiClient } from './apiClient'

let cachedStats: CommunityReportStats | null = null
let cachedStatsTime = 0

export const communityReportsService = {
  async search(filters: CommunityFilters): Promise<CommunityReport[]> {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    if (filters.status) params.set('status', filters.status)
    if (filters.verified !== undefined) params.set('verified', String(filters.verified))
    if (filters.sort) params.set('sort', filters.sort)

    const response = await apiClient.get<CommunityReport[]>(`/community/reports?${params.toString()}`)
    return response.data
  },

  async searchPaginated(
    filters: CommunityFilters,
    page: number = 1,
    limit: number = 12,
  ): Promise<CommunityReportListResult> {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    if (filters.status) params.set('status', filters.status)
    if (filters.verified !== undefined) params.set('verified', String(filters.verified))
    if (filters.sort) params.set('sort', filters.sort)
    params.set('page', String(page))
    params.set('limit', String(limit))

    const response = await apiClient.get<CommunityReportListResult>(`/community/reports/paginated?${params.toString()}`)
    return response.data
  },

  async getRecent(limit: number = 10): Promise<CommunityReport[]> {
    const response = await apiClient.get<CommunityReport[]>(`/community/reports/recent?limit=${limit}`)
    return response.data
  },

  async getById(id: string): Promise<CommunityReport | undefined> {
    const response = await apiClient.get<CommunityReport | undefined>(`/community/reports/${id}`)
    return response.data
  },

  async getStats(): Promise<CommunityReportStats> {
    const now = Date.now()
    if (cachedStats && now - cachedStatsTime < 30000) {
      return cachedStats
    }

    const response = await apiClient.get<CommunityReportStats>('/community/reports/stats')
    cachedStats = response.data
    cachedStatsTime = now
    return response.data
  },

  async getCategoryReportCount(categorySlug: string): Promise<number> {
    const reports = await this.search({ category: categorySlug as CommunityFilters['category'] })
    return reports.length
  },

  async upvote(id: string): Promise<void> {
    await apiClient.post<void>(`/community/reports/${id}/upvote`, {})
  },

  async downvote(id: string): Promise<void> {
    await apiClient.post<void>(`/community/reports/${id}/downvote`, {})
  },

  async create(data: CommunityReportFormData & { authorId?: string; authorName?: string; authorAvatar?: string }): Promise<CommunityReport> {
    const response = await apiClient.post<CommunityReport>('/community/reports', {
      title: data.title,
      description: data.description,
      category: data.category,
      lga: data.lga,
      town: data.town,
      area: data.area,
      busStop: data.busStop,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      placeId: data.placeId,
      formattedAddress: data.formattedAddress,
      authorId: data.authorId,
      authorName: data.authorName,
      authorAvatar: data.authorAvatar,
    })
    return response.data
  },
}

export const communityCommentsService = {
  async getByReport(reportId: string): Promise<CommunityComment[]> {
    const response = await apiClient.get<CommunityComment[]>(`/community/reports/${reportId}/comments`)
    return response.data
  },

  async create(reportId: string, authorId: string, content: string): Promise<CommunityComment> {
    const response = await apiClient.post<CommunityComment>(`/community/reports/${reportId}/comments`, { authorId, content })
    return response.data
  },
}
