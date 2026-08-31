import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX, Compass, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { SearchBar } from '../components/search/SearchBar'
import { SearchFilters } from '../components/search/SearchFilters'
import { BusinessGrid } from '../components/business/BusinessGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { Pagination } from '../components/common/Pagination'
import { businessService } from '../services/businessService'
import { SORT_OPTIONS } from '../types/business'
import type { BusinessFilters, Business } from '../types/business'

const ITEMS_PER_PAGE = 12

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filters: BusinessFilters = useMemo(() => ({
    query: searchParams.get('q') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    location: searchParams.get('location') ?? undefined,
    area: searchParams.get('area') ?? undefined,
    busStop: searchParams.get('busStop') ?? undefined,
    verified: searchParams.get('verified') === '1',
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
    priceRange: searchParams.get('priceRange') ?? undefined,
    openNow: searchParams.get('openNow') === '1',
  }), [searchParams])

  const sortBy = searchParams.get('sort') ?? 'rating'

  const [results, setResults] = useState<Business[]>([])
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    const loadResults = async () => {
      setLoading(true)
      try {
        const businesses = await businessService.search(filters)
        const sorted = businessService.sort(businesses, sortBy)
        setResults(sorted)
        setTotalItems(sorted.length)
      } catch {
        setResults([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [filters, sortBy])

  const paginated = useMemo(() => {
    return businessService.paginate(results, currentPage, ITEMS_PER_PAGE)
  }, [results, currentPage])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.query) count++
    if (filters.category) count++
    if (filters.location) count++
    if (filters.area) count++
    if (filters.busStop) count++
    if (filters.verified) count++
    if (filters.minRating) count++
    if (filters.priceRange) count++
    if (filters.openNow) count++
    return count
  }, [filters])

  const updateFilters = (newFilters: Partial<BusinessFilters>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === false) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })
    params.delete('page')
    setSearchParams(params)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (filters.query) params.set('q', filters.query)
    setSearchParams(params)
  }

  const hasAnyFilters = filters.query || filters.category || filters.location || filters.area || filters.busStop || filters.verified || filters.minRating || filters.priceRange || filters.openNow

  return (
    <main className="search-page">
      <div className="container search-page__top">
        <div className="search-page__header">
          <h1 className="search-page__title">Explore businesses</h1>
          <p className="search-page__subtitle">
            {totalItems > 0
              ? `${totalItems} result${totalItems === 1 ? '' : 's'} found`
              : hasAnyFilters
                ? 'No businesses match your search.'
                : 'No businesses listed yet. Be the first to add yours!'}
          </p>
        </div>

        <SearchBar
          size="md"
          initialQuery={filters.query ?? ''}
          initialLocation={filters.location ?? ''}
        />

        <div className="search-page__toolbar">
          <div className="search-page__results-info">
            {totalItems > 0 && (
              <span className="results-count">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} results
              </span>
            )}
            {totalItems === 0 && hasAnyFilters && (
              <span className="results-count">
                0 results found
              </span>
            )}
          </div>

          <div className="search-page__controls">
            <div className="mobile-filter-toggle" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <Filter size={18} aria-hidden="true" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
              {showMobileFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            <Select
              label="Sort"
              value={sortBy}
              onChange={(value) => updateFilters({ sort: value })}
              className="sort-select"
              options={SORT_OPTIONS}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      <div className="container search-page__body">
        <aside
          className={`search-filters-sidebar ${showMobileFilters ? 'open' : ''}`}
          aria-label="Search filters"
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
          <SearchFilters
            filters={filters}
            onChange={updateFilters}
            activeCount={activeFiltersCount}
            onClearAll={clearAllFilters}
          />
        </aside>

        <div className="search-page__results">
          {loading ? (
            <BusinessGrid businesses={[]} loading />
          ) : totalItems > 0 ? (
            <>
              <BusinessGrid businesses={paginated.items} />
              <Pagination
                currentPage={currentPage}
                totalPages={paginated.totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={<SearchX size={36} />}
              title={hasAnyFilters ? 'No businesses match your search' : 'No businesses listed yet'}
              description={hasAnyFilters
                ? 'Try a different keyword, clear some filters, or explore the full directory.'
                : 'Be the first to add a business in Oyo State.'}
              action={
                <ButtonLink to={hasAnyFilters ? '/search' : '/owner/add-business'} variant="primary">
                  {hasAnyFilters ? 'Clear all filters' : 'List your business'}
                </ButtonLink>
              }
            />
          )}

          {!loading && totalItems > 0 && (
            <p className="search-page__helper">
              <Compass size={15} aria-hidden="true" />
              Results are updated live as you adjust the filters.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

export default SearchResults