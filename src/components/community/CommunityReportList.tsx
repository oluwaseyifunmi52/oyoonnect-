import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, List, Map as MapIcon } from 'lucide-react'
import { CommunityReportCard } from './CommunityReportCard'
import { EmptyState } from '../ui/EmptyState'
import { Pagination } from '../common/Pagination'
import { ButtonLink } from '../ui/Button'
import { communityReportsService } from '../../services/communityReportsService'
import type { CommunityReport, CommunityFilters } from '../../types/community'

interface ReportListProps {
  category?: string
  limit?: number
}

const ITEMS_PER_PAGE = 9

export function CommunityReportList({ category, limit }: ReportListProps) {
  const [reports, setReports] = useState<CommunityReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const filters: CommunityFilters = useMemo(() => ({
    ...(category && { category: category as CommunityFilters['category'] }),
    ...(activeFilter !== 'all' && activeFilter !== 'urgent' && { status: activeFilter as CommunityFilters['status'] }),
  }), [category, activeFilter])

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      setError(null)
      try {
        if (searchQuery) {
          const results = await communityReportsService.search({ ...filters, location: searchQuery })
          setReports(results)
        } else {
          const results = await communityReportsService.search(filters)
          setReports(results)
        }
      } catch (err) {
        setError('Failed to load reports. Please try again.')
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [filters, searchQuery])

  const filtered = useMemo(() => {
    let result = reports
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.lga.toLowerCase().includes(q) ||
          r.location.town.toLowerCase().includes(q),
      )
    }
    return result
  }, [reports, searchQuery])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + (limit || ITEMS_PER_PAGE)
    const items = limit ? filtered.slice(0, limit) : filtered.slice(start, start + ITEMS_PER_PAGE)
    return {
      items,
      totalPages: Math.ceil((limit ? filtered.length : Math.min(filtered.length, 100)) / (limit || ITEMS_PER_PAGE)),
      totalItems: filtered.length,
    }
  }, [filtered, currentPage, limit])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setActiveFilter('all')
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="report-list__error">
        <p>{error}</p>
        <ButtonLink to="/community" variant="outline">
          Reload
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="report-list">
      <div className="report-list__toolbar">
        <div className="report-list__search">
          <div className="search-wrapper">
            <Search size={18} className="search-wrapper__icon" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search community reports..."
              aria-label="Search community reports"
              className="search-input"
            />
          </div>
        </div>

        <div className="report-list__controls">
          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle__btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`view-toggle__btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              <MapIcon size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-pill ${activeFilter === 'urgent' ? 'active' : ''}`}
              onClick={() => handleFilterChange('urgent')}
            >
              Urgent
            </button>
            <button
              type="button"
              className={`filter-pill ${activeFilter === 'under-review' ? 'active' : ''}`}
              onClick={() => handleFilterChange('under-review')}
            >
              Under Review
            </button>
            <button
              type="button"
              className={`filter-pill ${activeFilter === 'verified' ? 'active' : ''}`}
              onClick={() => handleFilterChange('verified')}
            >
              Verified
            </button>
            <button
              type="button"
              className={`filter-pill ${activeFilter === 'resolved' ? 'active' : ''}`}
              onClick={() => handleFilterChange('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="report-list__skeleton" role="status" aria-label="Loading reports">
          {Array.from({ length: limit || ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="report-card report-card--skeleton" />
          ))}
        </div>
      ) : paginated.items.length > 0 ? (
        <>
          <div
            className="report-list__grid"
            role="list"
            aria-label={category ? `${category} reports` : 'Community reports'}
          >
            {paginated.items.map((report) => (
              <CommunityReportCard key={report.id} report={report} />
            ))}
          </div>
          {!limit && paginated.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginated.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={<Search size={48} />}
          title={searchQuery ? 'No reports match your search' : 'No community reports yet'}
          description={
            searchQuery
              ? 'Try a different search term or clear your filters.'
              : 'Be the first person to report an issue in your area.'
          }
          action={
            <ButtonLink to="/community/report" variant="primary">
              <Plus size={18} />
              Report an Issue
            </ButtonLink>
          }
        />
      )}
    </div>
  )
}
