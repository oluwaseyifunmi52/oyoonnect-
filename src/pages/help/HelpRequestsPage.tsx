import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import type { SupportRequest, HelpCategoryType, HelpFilters } from '../../types/help'
import { HELP_CATEGORIES } from '../../types/help'
import {
  SupportRequestCard,
  LoadingState,
  ErrorState,
  HelpEmptyState,
} from '../../components/help'
import { SearchInput } from '../../components/ui/SearchInput'
import { Select } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { helpService } from '../../services/helpService'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Posted' },
  { value: 'almost-funded', label: 'Closing Soon' },
  { value: 'most-supported', label: 'Most Supported' },
  { value: 'verified', label: 'Verified' },
  { value: 'urgent', label: 'Urgent' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...HELP_CATEGORIES.map((c) => ({ value: c.id, label: c.name, icon: c.icon })),
]

export function HelpRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState('all')

  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || 'all'
  const sortParam = (searchParams.get('sort') as HelpFilters['sort']) || 'recent'

  const loadRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await helpService.search({
        category: categoryParam !== 'all' ? (categoryParam as HelpCategoryType) : undefined,
        sort: sortParam,
        limit: 20,
      })
      setRequests(data)
    } catch {
      setError('Failed to load support requests. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [categoryParam, sortParam])

  const locationOptions = useMemo(() => {
    const unique = Array.from(
      new Set(requests.map((r) => r.requesterLocation).filter(Boolean)),
    )
    return unique.sort((a, b) => a.localeCompare(b))
  }, [requests])

  const filteredRequests = useMemo(() => {
    let result = [...requests]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.fullStory.toLowerCase().includes(q),
      )
    }

    if (selectedLocation !== 'all') {
      result = result.filter((r) => r.requesterLocation === selectedLocation)
    }

    return result
  }, [requests, query, selectedLocation])

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set('q', value)
      } else {
        prev.delete('q')
      }
      return prev
    })
  }

  const handleCategoryChange = (value: string) => {
    setSearchParams((prev) => {
      if (value && value !== 'all') {
        prev.set('category', value)
      } else {
        prev.delete('category')
      }
      return prev
    })
  }

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set('sort', value)
      return prev
    })
  }

  const clearFilters = () => {
    setSelectedLocation('all')
    setSearchParams({})
  }

  const hasActiveFilters =
    query !== '' || categoryParam !== 'all' || sortParam !== 'recent' || selectedLocation !== 'all'

  const skeletonCards = Array(6).fill(0).map((_, i) => (
    <Card key={i} variant="skeleton" className="skeleton-card">
      <Skeleton className="skeleton--media" />
      <div className="card__body">
        <Skeleton className="skeleton--text skeleton--wide" />
        <Skeleton className="skeleton--text skeleton--mid" />
        <Skeleton className="skeleton--text" />
        <div className="card__actions">
          <Skeleton className="skeleton--btn" />
          <Skeleton className="skeleton--btn" />
        </div>
      </div>
    </Card>
  ))

  const requestCards = filteredRequests.map((request) => (
    <SupportRequestCard
      key={request.id}
      request={request}
      onSupportClick={(req) => {
        window.location.href = `/help/requests/${req.id}?support=true`
      }}
    />
  ))

  return (
    <div className="help-requests-page">
      <div className="help-page__container">
        <div className="help-requests-page__header">
          <h1 className="help-requests-page__title">Support Requests</h1>
          <p className="help-requests-page__subtitle">
            Verified requests that currently need community support.
          </p>

          <div className="help-requests__controls">
            <div className="help-requests__search-wrapper">
              <SearchInput
                value={query}
                onChange={handleSearch}
                placeholder="Search support requests..."
                ariaLabel="Search support requests"
              />
            </div>

            <div className="help-requests__filters">
              <Select
                value={categoryParam}
                onChange={handleCategoryChange}
                aria-label="Filter by category"
                className="help-requests__category-select"
                options={CATEGORY_OPTIONS}
              />

              <Select
                value={selectedLocation}
                onChange={setSelectedLocation}
                aria-label="Filter by location"
                className="help-requests__sort-select"
                options={[
                  { value: 'all', label: 'All Locations' },
                  ...locationOptions.map((loc) => ({ value: loc, label: loc })),
                ]}
              />

              <Select
                value={sortParam}
                onChange={handleSortChange}
                aria-label="Sort requests"
                className="help-requests__sort-select"
                options={SORT_OPTIONS}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  className="help-requests__clear-filters"
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
<div className="help-requests__grid" role="list" aria-label="Support requests">
          {isLoading ? (
            <>{skeletonCards}</>
          ) : error ? (
            <ErrorState title="Unable to Load Requests" message={error} onRetry={loadRequests} />
          ) : filteredRequests.length === 0 ? (
            <HelpEmptyState
              title={query || categoryParam !== 'all' || selectedLocation !== 'all' ? 'No requests match your search' : 'No active support requests'}
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters to find more requests.'
                  : 'No support requests are currently available. Check back soon.'
              }
              primaryAction={{ label: 'Request Help', to: '/help/request' }}
              secondaryAction={{ label: 'Clear Filters', to: '/help/requests' }}
            />
          ) : (
            <>{requestCards}</>
          )}
        </div>
      </div>

      {filteredRequests.length > 0 && <>{requestCards}</>}
    </div>
  )
}

export default HelpRequestsPage