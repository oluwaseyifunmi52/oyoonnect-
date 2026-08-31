import type {
  CommunityReport,
  CommunityReportFormData,
  CommunityFilters,
  CommunityComment,
  CommunityReportStats,
  CommunityReportListResult,
} from '../types/community'

const API_BASE = '/api/community'

let cachedStats: CommunityReportStats | null = null
let cachedStatsTime = 0

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : ({} as T)
}

export const communityReportsService = {
  async search(filters: CommunityFilters): Promise<CommunityReport[]> {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    if (filters.status) params.set('status', filters.status)
    if (filters.verified !== undefined) params.set('verified', String(filters.verified))
    if (filters.sort) params.set('sort', filters.sort)

    return fetchApi<CommunityReport[]>(`/reports?${params.toString()}`)
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

    return fetchApi<CommunityReportListResult>(`/reports/paginated?${params.toString()}`)
  },

  async getRecent(limit: number = 10): Promise<CommunityReport[]> {
    return fetchApi<CommunityReport[]>(`/reports/recent?limit=${limit}`)
  },

  async getById(id: string): Promise<CommunityReport | undefined> {
    return fetchApi<CommunityReport | undefined>(`/reports/${id}`)
  },

  async getStats(): Promise<CommunityReportStats> {
    const now = Date.now()
    if (cachedStats && now - cachedStatsTime < 30000) {
      return cachedStats
    }

    const stats = await fetchApi<CommunityReportStats>('/reports/stats')
    cachedStats = stats
    cachedStatsTime = now
    return stats
  },

  async getCategoryReportCount(categorySlug: string): Promise<number> {
    const reports = await this.search({ category: categorySlug as CommunityFilters['category'] })
    return reports.length
  },

  async upvote(id: string): Promise<void> {
    await fetchApi<void>(`/reports/${id}/upvote`, { method: 'POST' })
  },

  async downvote(id: string): Promise<void> {
    await fetchApi<void>(`/reports/${id}/downvote`, { method: 'POST' })
  },

  async create(data: CommunityReportFormData & { authorId?: string; authorName?: string; authorAvatar?: string }): Promise<CommunityReport> {
    return fetchApi<CommunityReport>('/reports', {
      method: 'POST',
      body: JSON.stringify({
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
      }),
    })
  },
}

export const communityCommentsService = {
  async getByReport(reportId: string): Promise<CommunityComment[]> {
    return fetchApi<CommunityComment[]>(`/reports/${reportId}/comments`)
  },

  async create(reportId: string, authorId: string, content: string): Promise<CommunityComment> {
    return fetchApi<CommunityComment>(`/reports/${reportId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ authorId, content }),
    })
  },
}
