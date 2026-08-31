import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import { SearchX, Filter, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Pagination } from '../../components/common/Pagination'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { CommunityReportCard } from '../../components/community/CommunityReportCard'
import { CommunityFilters as CommunityFilterPanel } from '../../components/community/CommunityFilters'
import { communityCategories, communityCategoryBySlug } from '../../data/communityCategories'
import { communityReportsService } from '../../services/communityReportsService'
import { COMMUNITY_SORT_OPTIONS } from '../../types/community'
import type { CommunityFilters, CommunityReport, CommunityReportListResult, CommunityCategory } from '../../types/community'

const ITEMS_PER_PAGE = 12

export function CommunityCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const category = communityCategoryBySlug(categorySlug || '')

  const filters: CommunityFilters = useMemo(() => {
    const status = searchParams.get('status') as CommunityFilters['status'] | null
    const verified = searchParams.get('verified') === 'true'
    const sort = (searchParams.get('sort') ?? 'newest') as CommunityFilters['sort']
    return {
      category: (categorySlug || undefined) as CommunityCategory | undefined,
      status: status ?? undefined,
      verified: verified || undefined,
      sort,
    }
  }, [searchParams, categorySlug])

  const [result, setResult] = useState<CommunityReportListResult | null>(null)

  useEffect(() => {
    setCurrentPage(1)
    const loadResults = async () => {
      setLoading(true)
      try {
        const res = await communityReportsService.searchPaginated(filters, 1, ITEMS_PER_PAGE)
        setResult(res)
      } catch {
        setResult(null)
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [filters])

  useEffect(() => {
    if (currentPage > 1) {
      const loadPage = async () => {
        setLoading(true)
        try {
          const res = await communityReportsService.searchPaginated(filters, currentPage, ITEMS_PER_PAGE)
          setResult(res)
        } catch {
          setResult(null)
        } finally {
          setLoading(false)
        }
      }
      loadPage()
    }
  }, [currentPage, filters])

  const hasAnyFilters = filters.status || filters.verified

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.status) count++
    if (filters.verified) count++
    if (filters.sort && filters.sort !== 'newest') count++
    return count
  }, [filters])

  const updateFilters = (newFilters: Partial<CommunityFilters>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === false) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })
    setSearchParams(params)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  if (!category) {
    return (
      <main className="page community-category-page container">
        <EmptyState
          icon={<SearchX size={36} />}
          title="Category not found"
          description="The requested community category does not exist."
          action={<ButtonLink to="/community" variant="primary">Back to Community</ButtonLink>}
        />
      </main>
    )
  }

  return (
    <main className="page community-category-page">
      <div className="container community-category-page__top">
        <div className="community-category-page__header">
          <div className="community-category-page__category-badge">
            <MapPin size={24} aria-hidden="true" style={{ color: category.color }} />
            <span>{category.name}</span>
          </div>
          <h1 className="community-category-page__title">{category.name}</h1>
          <p className="community-category-page__subtitle">{category.description}</p>
          <p className="community-category-page__count">
            {result
              ? `${result.total} report${result.total === 1 ? '' : 's'} found`
              : hasAnyFilters
                ? 'No reports match your filters.'
                : 'No reports in this category yet.'}
          </p>
        </div>

        <div className="community-category-page__body">
          <aside
            className={`community-filters-sidebar ${showMobileFilters ? 'open' : ''}`}
            aria-label="Community report filters"
          >
            {showMobileFilters && (
              <button
                className="sidebar-close"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
              >
                <SearchX size={20} />
              </button>
            )}
            <CommunityFilterPanel
              filters={filters}
              onChange={updateFilters}
              onClearAll={clearAllFilters}
            />
          </aside>

          <div className="community-category-page__results">
            <div className="community-category-page__toolbar">
              <div className="mobile-filter-toggle" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                <Filter size={18} aria-hidden="true" />
                <span>Filters</span>
                {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
                {showMobileFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {loading ? (
              <div className="community-reports-skeleton" role="status" aria-label="Loading reports">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="report-card skeleton-card" />
                ))}
              </div>
            ) : result && result.reports.length > 0 ? (
              <>
                <div
                  className="community-reports"
                  role="list"
                  aria-label={`${category.name} reports`}
                >
                  {result.reports.map((report) => (
                    <CommunityReportCard key={report.id} report={report} />
                  ))}
                </div>
                {result.hasMore && result.total > ITEMS_PER_PAGE && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(result.total / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <EmptyState
                icon={<MapPin size={36} />}
                title={hasAnyFilters ? 'No reports match your filters' : `No ${category.name.toLowerCase()} reports yet`}
                description={hasAnyFilters
                  ? 'Try a different location, clear some filters, or explore all reports.'
                  : `Be the first to report a ${category.name.toLowerCase()} issue in your area.`}
                action={
                  <ButtonLink to="/community/report" variant="primary">
                    {hasAnyFilters ? 'Clear all filters' : 'Report an Issue'}
                  </ButtonLink>
                }
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default CommunityCategoryPage
