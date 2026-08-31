import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX, Compass, Filter, ChevronDown, ChevronUp, X } from 'lucide-react'
import { SearchBar } from '../../components/search/SearchBar'
import { PropertyGrid } from '../../components/property/PropertyGrid'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Pagination } from '../../components/common/Pagination'
import { propertyService } from '../../services/propertyService'
import { PROPERTY_SORT_OPTIONS, PROPERTY_TYPES, LISTING_TYPES } from '../../types/rental'
import type { PropertyFilters, Property, PropertyType, ListingType } from '../../types/rental'
import { locations, getAreasForLocation, getBusStopsForLocation } from '../../data/locations'

const ITEMS_PER_PAGE = 12

function PropertyListings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filters: PropertyFilters = useMemo(() => ({
    query: searchParams.get('q') ?? undefined,
    propertyType: (searchParams.get('propertyType') ?? undefined) as PropertyType | undefined,
    listingType: (searchParams.get('listingType') ?? undefined) as ListingType | undefined,
    location: searchParams.get('location') ?? undefined,
    area: searchParams.get('area') ?? undefined,
    busStop: searchParams.get('busStop') ?? undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!, 10) : undefined,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!, 10) : undefined,
    verified: searchParams.get('verified') === '1',
    furnished: searchParams.get('furnished') === '1',
    sort: searchParams.get('sort') ?? 'newest',
  }), [searchParams])

  const [results, setResults] = useState<Property[]>([])
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    const loadResults = async () => {
      setLoading(true)
      try {
        const properties = await propertyService.search(filters)
        setResults(properties)
        setTotalItems(properties.length)
      } catch {
        setResults([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [filters])

  const paginated = useMemo(() => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return {
      items: results.slice(start, end),
      totalPages,
      totalItems,
    }
  }, [results, currentPage, totalItems])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.query) count++
    if (filters.propertyType) count++
    if (filters.listingType) count++
    if (filters.location) count++
    if (filters.area) count++
    if (filters.busStop) count++
    if (filters.minPrice !== undefined) count++
    if (filters.maxPrice !== undefined) count++
    if (filters.bedrooms !== undefined) count++
    if (filters.bathrooms !== undefined) count++
    if (filters.verified) count++
    if (filters.furnished) count++
    return count
  }, [filters])

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
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

  const hasAnyFilters = filters.query || filters.propertyType || filters.listingType || filters.location || filters.area || filters.busStop || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.bedrooms !== undefined || filters.bathrooms !== undefined || filters.verified || filters.furnished

  const locationName = filters.location || ''
  const selectedLocation = locations.find(l => l.name === locationName)
  const availableAreas = selectedLocation ? getAreasForLocation(selectedLocation.id) : []
  const availableBusStops = selectedLocation ? getBusStopsForLocation(selectedLocation.id) : []

  return (
    <main className="search-page">
      <div className="container search-page__top">
        <div className="search-page__header">
          <h1 className="search-page__title">Verified Rentals</h1>
          <p className="search-page__subtitle">
            {totalItems > 0
              ? `${totalItems} propert${totalItems === 1 ? 'y' : 'ies'} found`
              : hasAnyFilters
                ? 'No properties match your search.'
                : 'No properties listed yet.'}
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
              value={filters.sort || 'newest'}
              onChange={(value) => updateFilters({ sort: value })}
              className="sort-select"
              options={PROPERTY_SORT_OPTIONS}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      <div className="container search-page__body">
        <aside
          className={`search-filters-sidebar ${showMobileFilters ? 'open' : ''}`}
          aria-label="Property filters"
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

          <div className="filters__heading">
            <Filter size={18} aria-hidden="true" />
            <h2>Filters</h2>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="filters__clear"
                onClick={clearAllFilters}
                aria-label="Clear all filters"
              >
                <X size={16} />
                Clear all
              </button>
            )}
          </div>

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-property-type">
              Property Type
            </label>
            <Select
              label="Property Type"
              id="filter-property-type"
              value={filters.propertyType || ''}
              onChange={(value) => updateFilters({ propertyType: (value || undefined) as PropertyType | undefined })}
              options={PROPERTY_TYPES.map((pt) => ({ value: pt.value, label: pt.label }))}
              placeholder="All types"
            />
          </div>

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-listing-type">
              Listing Type
            </label>
            <Select
              label="Listing Type"
              id="filter-listing-type"
              value={filters.listingType || ''}
              onChange={(value) => updateFilters({ listingType: (value || undefined) as ListingType | undefined })}
              options={LISTING_TYPES.map((lt) => ({ value: lt.value, label: lt.label }))}
              placeholder="All listings"
            />
          </div>

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-location">
              Location
            </label>
            <Select
              label="Location"
              id="filter-location"
              value={filters.location || ''}
              onChange={(value) => {
                updateFilters({ location: value || undefined, area: undefined, busStop: undefined })
              }}
              options={locations.map((l) => ({ value: l.name, label: l.name }))}
              placeholder="All Oyo State"
            />
          </div>

          {selectedLocation && availableAreas.length > 0 && (
            <div className="filters__group">
              <label className="filters__label" htmlFor="filter-area">
                Area / Town
              </label>
              <Select
                label="Area / Town"
                id="filter-area"
                value={filters.area || ''}
                onChange={(value) => updateFilters({ area: value || undefined, busStop: undefined })}
                options={availableAreas.map((a) => ({ value: a, label: a }))}
                placeholder="All areas"
              />
            </div>
          )}

          {selectedLocation && filters.area && availableBusStops.length > 0 && (
            <div className="filters__group">
              <label className="filters__label" htmlFor="filter-bus-stop">
                Bus Stop
              </label>
              <Select
                label="Bus Stop"
                id="filter-bus-stop"
                value={filters.busStop || ''}
                onChange={(value) => updateFilters({ busStop: value || undefined })}
                options={availableBusStops.map((b) => ({ value: b, label: b }))}
                placeholder="All bus stops"
              />
            </div>
          )}

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-bedrooms">
              Bedrooms
            </label>
            <Select
              label="Bedrooms"
              id="filter-bedrooms"
              value={filters.bedrooms !== undefined ? String(filters.bedrooms) : ''}
              onChange={(value) => updateFilters({ bedrooms: value ? parseInt(value, 10) : undefined })}
              options={[
                { value: '', label: 'Any' },
                { value: '1', label: '1+' },
                { value: '2', label: '2+' },
                { value: '3', label: '3+' },
                { value: '4', label: '4+' },
                { value: '5', label: '5+' },
              ]}
              placeholder="Any"
            />
          </div>

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-bathrooms">
              Bathrooms
            </label>
            <Select
              label="Bathrooms"
              id="filter-bathrooms"
              value={filters.bathrooms !== undefined ? String(filters.bathrooms) : ''}
              onChange={(value) => updateFilters({ bathrooms: value ? parseInt(value, 10) : undefined })}
              options={[
                { value: '', label: 'Any' },
                { value: '1', label: '1+' },
                { value: '2', label: '2+' },
                { value: '3', label: '3+' },
                { value: '4', label: '4+' },
              ]}
              placeholder="Any"
            />
          </div>

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-min-price">
              Min Price (₦)
            </label>
            <input
              id="filter-min-price"
              type="number"
              className="input"
              placeholder="Min price"
              value={filters.minPrice ?? ''}
              onChange={(e) => updateFilters({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>

          <div className="filters__group">
            <label className="filters__label" htmlFor="filter-max-price">
              Max Price (₦)
            </label>
            <input
              id="filter-max-price"
              type="number"
              className="input"
              placeholder="Max price"
              value={filters.maxPrice ?? ''}
              onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>

          <div className="filters__group">
            <label className="filters__checkbox">
              <input
                type="checkbox"
                checked={filters.verified || false}
                onChange={(e) => updateFilters({ verified: e.target.checked || undefined })}
              />
              <span>Verified only</span>
            </label>
          </div>

          <div className="filters__group">
            <label className="filters__checkbox">
              <input
                type="checkbox"
                checked={filters.furnished || false}
                onChange={(e) => updateFilters({ furnished: e.target.checked || undefined })}
              />
              <span>Furnished</span>
            </label>
          </div>
        </aside>

        <div className="search-page__results">
          {loading ? (
            <PropertyGrid properties={[]} loading />
          ) : paginated.totalItems > 0 ? (
            <>
              <PropertyGrid properties={paginated.items} />
              <Pagination
                currentPage={currentPage}
                totalPages={paginated.totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              icon={<SearchX size={36} />}
              title={hasAnyFilters ? 'No properties match your search' : 'No properties listed yet'}
              description={hasAnyFilters
                ? 'Try a different keyword, clear some filters, or explore all rentals.'
                : 'Be the first to list a verified property in Oyo State.'}
              action={
                <ButtonLink to={hasAnyFilters ? '/rentals' : '/owner/properties/new'} variant="primary">
                  {hasAnyFilters ? 'Clear all filters' : 'List a property'}
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

export default PropertyListings
