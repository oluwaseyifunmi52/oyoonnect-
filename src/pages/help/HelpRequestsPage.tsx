import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock3, HandHeart, MapPin, Plus, ShieldCheck, WalletCards } from 'lucide-react'
import type { HelpCategoryValue, SupportRequest, SupportRequestStatus } from '../../types/help'
import { HELP_CATEGORIES } from '../../types/help'
import { SupportRequestCard } from '../../components/help'
import { SearchInput } from '../../components/ui/SearchInput'
import { Select } from '../../components/ui'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { helpService } from '../../services/helpService'
import './HelpRequestsPage.css'

const PAGE_SIZE = 12

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'closed', label: 'Closed' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Posted' },
  { value: 'deadline', label: 'Closing Soon' },
  { value: 'verified', label: 'Verified First' },
  { value: 'almost-funded', label: 'Almost Funded' },
]

function readFilter(params: URLSearchParams, key: string, allowedValues: string[], fallback: string) {
  const value = params.get(key)
  return value && allowedValues.includes(value) ? value : fallback
}

export function HelpRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [hasAnyRequests, setHasAnyRequests] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const loadMoreControllerRef = useRef<AbortController | null>(null)

  const query = searchParams.get('q') ?? ''
  const category = readFilter(searchParams, 'category', HELP_CATEGORIES.map((item) => item.value), 'all')
  const status = readFilter(searchParams, 'status', STATUS_OPTIONS.map((item) => item.value), 'all')
  const sort = readFilter(searchParams, 'sort', SORT_OPTIONS.map((item) => item.value), 'recent')
  const location = searchParams.get('location') ?? 'all'

  const loadRequests = useCallback(async (signal: AbortSignal) => {
    loadMoreControllerRef.current?.abort()
    loadMoreControllerRef.current = null
    setIsLoading(true)
    setIsLoadingMore(false)
    setError(null)
    setLoadMoreError(null)
    setRequests([])
    setPage(1)
    setHasAnyRequests(false)

    try {
      const result = await helpService.searchPublicRequests({
        category: category === 'all' ? undefined : category as HelpCategoryValue,
        location: location === 'all' ? undefined : location,
        status: status === 'all' ? undefined : status as SupportRequestStatus,
        sort: sort as 'recent' | 'almost-funded' | 'verified' | 'deadline',
        page: 1,
        limit: PAGE_SIZE,
        signal,
      })
      if (signal.aborted) return
      setRequests(result.items)
      setLocationOptions((current) => Array.from(new Set([
        ...current,
        ...result.items.map((request) => request.requesterLocation.trim()).filter(Boolean),
      ])).sort((first, second) => first.localeCompare(second)))
      setTotal(result.total)
      setHasMore(result.hasMore)
      if (result.total > 0) {
        setHasAnyRequests(true)
      } else if (category !== 'all' || location !== 'all' || status !== 'all') {
        const unfiltered = await helpService.searchPublicRequests({ sort: 'recent', page: 1, limit: 1, signal })
        if (!signal.aborted) setHasAnyRequests(unfiltered.total > 0)
      } else {
        setHasAnyRequests(false)
      }
    } catch (loadError) {
      if (signal.aborted || (loadError instanceof DOMException && loadError.name === 'AbortError')) return
      setError(loadError instanceof Error ? loadError.message : 'Unable to load support requests. Please try again.')
    } finally {
      if (!signal.aborted) setIsLoading(false)
    }
  }, [category, location, sort, status])

  useEffect(() => {
    const controller = new AbortController()
    void loadRequests(controller.signal)
    return () => {
      controller.abort()
      loadMoreControllerRef.current?.abort()
    }
  }, [loadRequests, retryCount])

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return requests
    return requests.filter((request) => [request.title, request.description, request.fullStory, request.requesterLocation]
      .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)))
  }, [query, requests])

  const updateFilter = useCallback((key: string, value: string, defaultValue = 'all') => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (!value || value === defaultValue) next.delete(key)
      else next.set(key, value)
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    setLoadMoreError(null)
    loadMoreControllerRef.current?.abort()
    const controller = new AbortController()
    loadMoreControllerRef.current = controller
    try {
      const result = await helpService.searchPublicRequests({
        category: category === 'all' ? undefined : category as HelpCategoryValue,
        location: location === 'all' ? undefined : location,
        status: status === 'all' ? undefined : status as SupportRequestStatus,
        sort: sort as 'recent' | 'almost-funded' | 'verified' | 'deadline',
        page: page + 1,
        limit: PAGE_SIZE,
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      setRequests((current) => [...current, ...result.items])
      setLocationOptions((current) => Array.from(new Set([
        ...current,
        ...result.items.map((request) => request.requesterLocation.trim()).filter(Boolean),
      ])).sort((first, second) => first.localeCompare(second)))
      setPage(result.page)
      setTotal(result.total)
      setHasMore(result.hasMore)
    } catch (loadError) {
      if (!controller.signal.aborted) {
        setLoadMoreError(loadError instanceof Error ? loadError.message : 'Unable to load more requests.')
      }
    } finally {
      if (loadMoreControllerRef.current === controller) {
        loadMoreControllerRef.current = null
        setIsLoadingMore(false)
      }
    }
  }, [category, hasMore, isLoadingMore, location, page, sort, status])

  const clearFilters = () => setSearchParams({}, { replace: true })
  const hasActiveFilters = Boolean(query.trim()) || category !== 'all' || location !== 'all' || status !== 'all' || sort !== 'recent'
  const hasNoMatchingRequests = filteredRequests.length === 0 && hasActiveFilters && hasAnyRequests

  const skeletonCards = Array.from({ length: 6 }, (_, index) => (
    <article className="support-request-skeleton" key={index} aria-hidden="true">
      <Skeleton className="support-request-skeleton__eyebrow" />
      <Skeleton className="support-request-skeleton__title" />
      <Skeleton className="support-request-skeleton__copy" />
      <Skeleton className="support-request-skeleton__copy support-request-skeleton__copy--short" />
      <Skeleton className="support-request-skeleton__progress" />
      <Skeleton className="support-request-skeleton__action" />
    </article>
  ))

  return (
    <main className="help-requests-page">
      <div className="help-requests-page__container">
        <nav className="help-requests-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/community/help">Community</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Support Requests</span>
        </nav>

        <header className="help-requests-page__intro">
          <div className="help-requests-page__intro-copy">
            <span className="help-requests-page__eyebrow">Community Support</span>
            <h1 className="help-requests-page__title">Support Requests</h1>
            <p className="help-requests-page__subtitle">
              Discover verified requests from people and families in Oyo State who need a helping hand. Every contribution, no matter how small, can make a difference.
            </p>
          </div>
          <ButtonLink to="/community/help/request" variant="primary" size="lg" className="help-requests-page__request-button">
            <Plus size={18} aria-hidden="true" /> Request Help
          </ButtonLink>
        </header>

        <section className="help-requests-page__impact" aria-label="How community support works">
          <div className="help-requests-page__impact-item">
            <span className="help-requests-page__impact-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
            <div><h2>Verified Requests</h2><p>Requests are reviewed before being published.</p></div>
          </div>
          <div className="help-requests-page__impact-item">
            <span className="help-requests-page__impact-icon"><WalletCards size={20} aria-hidden="true" /></span>
            <div><h2>Transparent Support</h2><p>Only contribute through official OyoConnect payment options when available.</p></div>
          </div>
          <div className="help-requests-page__impact-item">
            <span className="help-requests-page__impact-icon"><HandHeart size={20} aria-hidden="true" /></span>
            <div><h2>Stronger Communities</h2><p>Help individuals, families and small businesses across Oyo State.</p></div>
          </div>
        </section>

        <section className="help-requests-page__filter-panel" aria-label="Search and filter support requests">
          <div className="help-requests-page__search">
            <SearchInput
              value={query}
              onChange={(value) => updateFilter('q', value, '')}
              placeholder="Search title, story or location"
              ariaLabel="Search requests by title, description or location"
            />
          </div>
          <div className="help-requests-page__filters">
            <Select
              value={category}
              onChange={(value) => updateFilter('category', value)}
              aria-label="Filter by category"
              label="Category"
              options={[{ value: 'all', label: 'All Categories' }, ...HELP_CATEGORIES.map(({ value, label }) => ({ value, label }))]}
              placeholder=""
            />
            <Select
              value={status}
              onChange={(value) => updateFilter('status', value)}
              aria-label="Filter by status"
              label="Status"
              options={STATUS_OPTIONS}
              placeholder=""
            />
            <Select
              value={location}
              onChange={(value) => updateFilter('location', value)}
              aria-label="Filter by location"
              label="Location"
              options={[{ value: 'all', label: 'All Locations' }, ...locationOptions.map((value) => ({ value, label: value }))]}
              placeholder=""
            />
            <Select
              value={sort}
              onChange={(value) => updateFilter('sort', value, 'recent')}
              aria-label="Sort support requests"
              label="Sort by"
              options={SORT_OPTIONS}
              placeholder=""
            />
          </div>
          {hasActiveFilters && (
            <div className="help-requests-page__filter-footer">
              <span>Filters are applied to the request list.</span>
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </section>

        <div className="help-requests-page__results-heading">
          <div>
            <h2>Community requests</h2>
            {!isLoading && !error && <p>{filteredRequests.length === requests.length ? `${total} requests` : `${filteredRequests.length} matching loaded requests`}</p>}
          </div>
          {hasActiveFilters && <span className="help-requests-page__active-filter"><MapPin size={14} aria-hidden="true" /> Filtered results</span>}
        </div>

        {isLoading ? (
          <div className="help-requests-page__grid" aria-label="Loading support requests">{skeletonCards}</div>
        ) : error ? (
          <section className="help-requests-page__state help-requests-page__state--error" role="alert">
            <span className="help-requests-page__state-icon"><Clock3 size={24} aria-hidden="true" /></span>
            <h2>We couldn’t load requests</h2>
            <p>{error}</p>
            <Button type="button" variant="primary" onClick={() => setRetryCount((count) => count + 1)}>Retry</Button>
          </section>
        ) : filteredRequests.length === 0 ? (
          <section className="help-requests-page__state" aria-live="polite">
            <span className="help-requests-page__state-icon"><HandHeart size={28} aria-hidden="true" /></span>
            <h2>{hasNoMatchingRequests ? 'No requests match your filters.' : 'No Support Requests Yet'}</h2>
            <p>{hasNoMatchingRequests
              ? 'Try changing your search or filters to see more community requests.'
              : hasActiveFilters
                ? 'There are currently no public support requests available. New verified requests will appear here as community members submit them.'
                : 'There are currently no support requests available. New verified requests will appear here as community members submit them.'}</p>
            {hasMore && query.trim() && (
              <Button type="button" variant="outline" onClick={handleLoadMore} loading={isLoadingMore}>
                Search more requests
              </Button>
            )}
            {loadMoreError && <p className="help-requests-page__load-error" role="alert">{loadMoreError}</p>}
            <div className="help-requests-page__state-actions">
              <Button type="button" variant="outline" onClick={clearFilters}>Browse All Requests</Button>
              <ButtonLink to="/community/help/request" variant="primary">Request Help <ArrowRight size={16} aria-hidden="true" /></ButtonLink>
            </div>
          </section>
        ) : (
          <>
            <div className="help-requests-page__grid" role="list" aria-label="Support requests">
              {filteredRequests.map((request) => (
                <SupportRequestCard key={request.id} request={request} />
              ))}
            </div>
            {loadMoreError && <p className="help-requests-page__load-error" role="alert">{loadMoreError}</p>}
            {hasMore && (
              <div className="help-requests-page__load-more">
                <Button type="button" variant="outline" onClick={handleLoadMore} loading={isLoadingMore}>
                  {isLoadingMore ? 'Loading requests…' : 'Load more requests'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default HelpRequestsPage
