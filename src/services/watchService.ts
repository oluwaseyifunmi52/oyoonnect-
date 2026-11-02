import { apiClient } from './apiClient'

export type WatchMediaType = 'movie' | 'series'
export type WatchSort = 'trending' | 'popular' | 'latest'

export interface WatchGenre {
  id: number
  name: string
}

export interface WatchTitle {
  id: number
  mediaType: WatchMediaType
  title: string
  overview: string
  posterUrl?: string
  backdropUrl?: string
  releaseDate?: string
  voteAverage: number
  voteCount?: number
  genreIds?: number[]
  genres?: WatchGenre[]
  runtime?: number
  numberOfSeasons?: number
  trailer?: { url?: string; name?: string; site?: string } | null
  streamingRightsProvided?: boolean
}

interface WatchListResponse {
  success: boolean
  data: WatchTitle[]
  meta?: { page: number; totalPages: number; totalResults: number; hasMore: boolean }
}

interface WatchGenresResponse {
  success: boolean
  data: { movies: WatchGenre[]; series: WatchGenre[] }
}

interface WatchSearchResponse {
  success: boolean
  data: { movies: WatchTitle[]; series: WatchTitle[] }
}

interface WatchDetailsResponse {
  success: boolean
  data: WatchTitle
}

function withMediaType(titles: WatchTitle[], mediaType: WatchMediaType): WatchTitle[] {
  return titles.map((title) => ({ ...title, mediaType: title.mediaType || mediaType }))
}

export const watchService = {
  async list(mediaType: WatchMediaType, sort: WatchSort): Promise<WatchTitle[]> {
    const path = mediaType === 'movie' ? 'movies' : 'series'
    const response = await apiClient.get<WatchListResponse['data']>(`/watch/${path}/${sort}?page=1`)
    return withMediaType(response.data, mediaType)
  },

  async search(query: string, mediaType?: WatchMediaType): Promise<WatchTitle[]> {
    const encodedQuery = encodeURIComponent(query)
    if (mediaType) {
      const path = mediaType === 'movie' ? 'movies' : 'series'
      const response = await apiClient.get<WatchListResponse['data']>(`/watch/${path}/search?q=${encodedQuery}&page=1`)
      return withMediaType(response.data, mediaType)
    }

    const response = await apiClient.get<WatchSearchResponse['data']>(`/watch/search?q=${encodedQuery}&page=1`)
    return [
      ...withMediaType(response.data.movies, 'movie'),
      ...withMediaType(response.data.series, 'series'),
    ]
  },

  async genres(): Promise<{ movies: WatchGenre[]; series: WatchGenre[] }> {
    const response = await apiClient.get<WatchGenresResponse['data']>('/watch/genres')
    return response.data
  },

  async details(mediaType: WatchMediaType, id: string): Promise<WatchTitle> {
    const path = mediaType === 'movie' ? 'movies' : 'series'
    const response = await apiClient.get<WatchDetailsResponse['data']>(`/watch/${path}/${encodeURIComponent(id)}`)
    return { ...response.data, mediaType }
  },
}
