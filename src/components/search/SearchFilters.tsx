import { SlidersHorizontal, X } from 'lucide-react'
import { categories } from '../../data/categories'
import { getAreasForLocation, getBusStopsForLocation, locations } from '../../data/locations'
import { LocationSelector } from './LocationSelector'
import { Select } from '../ui/Input'
import { PRICE_RANGES } from '../../types/business'

interface SearchFilters {
  query?: string
  category?: string
  location?: string
  area?: string
  busStop?: string
  verified?: boolean
  minRating?: number
  priceRange?: string
  openNow?: boolean
}

interface SearchFiltersProps {
  filters: SearchFilters
  onChange: (filters: Partial<SearchFilters>) => void
  activeCount: number
  onClearAll: () => void
}

export function SearchFilters({
  filters,
  onChange,
  activeCount,
  onClearAll,
}: SearchFiltersProps) {
  const category = filters.category ?? ''
  const location = filters.location ?? ''
  const area = filters.area ?? ''
  const busStop = filters.busStop ?? ''
  const verified = filters.verified ?? false
  const minRating = filters.minRating ?? 0
  const priceRange = filters.priceRange ?? ''
  const openNow = filters.openNow ?? false

  const availableAreas = location ? getAreasForLocation(location) : []
  const availableBusStops = location ? getBusStopsForLocation(locations.find((l) => l.name === location)?.id ?? '') : []

  return (
    <aside className="filters" aria-label="Search filters">
      <div className="filters__heading">
        <SlidersHorizontal size={18} aria-hidden="true" />
        <h2>Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            className="filters__clear"
            onClick={onClearAll}
            aria-label="Clear all filters"
          >
            <X size={16} />
            Clear all
          </button>
        )}
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-category">
          Category
        </label>
        <Select
          label="Category"
          id="filter-category"
          value={category}
          onChange={(value) => onChange({ category: value || undefined })}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          placeholder="All categories"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-location">
          Location
        </label>

        <LocationSelector
          id="filter-location"
          value={location}
          onChange={(value) =>
            onChange({
              location: value || undefined,
              area: undefined,
              busStop: undefined,
            })
          }
          ariaLabel="Filter by location"
          placeholder="All Oyo State"
        />
      </div>

      {location && availableAreas.length > 0 && (
        <div className="filters__group">
          <label className="filters__label" htmlFor="filter-area">
            Area
          </label>
          <Select
            label="Area"
            id="filter-area"
            value={area}
            onChange={(value) =>
              onChange({
                area: value || undefined,
                busStop: undefined,
              })
            }
            options={availableAreas.map((a) => ({ value: a, label: a }))}
            placeholder="All areas"
          />
        </div>
      )}

      {location && availableBusStops.length > 0 && (
        <div className="filters__group">
          <label className="filters__label" htmlFor="filter-bus-stop">
            Bus Stop / Landmark
          </label>
          <Select
            label="Bus Stop / Landmark"
            id="filter-bus-stop"
            value={busStop}
            onChange={(value) => onChange({ busStop: value || undefined })}
            options={availableBusStops.map((b) => ({ value: b, label: b }))}
            placeholder="All landmarks"
          />
        </div>
      )}

      <div className="filters__group filters__group--inline">
        <input
          id="filter-verified"
          type="checkbox"
          className="filters__checkbox"
          checked={verified}
          onChange={(event) => onChange({ verified: event.target.checked })}
        />
        <label className="filters__label filters__label--check" htmlFor="filter-verified">
          Verified only
        </label>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-rating">
          Minimum rating
        </label>
        <Select
          label="Minimum rating"
          id="filter-rating"
          value={minRating.toString()}
          onChange={(value) => onChange({ minRating: value ? parseFloat(value) : undefined })}
          options={[
            { value: '0', label: 'Any rating' },
            { value: '4.5', label: '4.5 & up' },
            { value: '4.0', label: '4.0 & up' },
            { value: '3.5', label: '3.5 & up' },
            { value: '3.0', label: '3.0 & up' },
          ]}
          placeholder="Any rating"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-price">
          Price range
        </label>
        <Select
          label="Price range"
          id="filter-price"
          value={priceRange}
          onChange={(value) => onChange({ priceRange: value || undefined })}
          options={PRICE_RANGES}
          placeholder="Any price"
        />
      </div>

      <div className="filters__group filters__group--inline">
        <input
          id="filter-open-now"
          type="checkbox"
          className="filters__checkbox"
          checked={openNow}
          onChange={(event) => onChange({ openNow: event.target.checked })}
        />
        <label className="filters__label filters__label--check" htmlFor="filter-open-now">
          Open now
        </label>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-query">
          Keyword
        </label>
        <input
          id="filter-query"
          className="input"
          type="search"
          placeholder="e.g. tyres, braids, jollof"
          value={filters.query ?? ''}
          onChange={(event) => onChange({ query: event.target.value || undefined })}
          aria-describedby="filter-query-hint"
        />
        <span id="filter-query-hint" className="field__hint">
          Search within current results
        </span>
      </div>
    </aside>
  )
}