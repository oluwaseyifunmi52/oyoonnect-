import { Search, MapPin } from 'lucide-react'
import { getAllLocationNames } from '../../data/locations'

interface JobsSearchRowProps {
  query: string
  location: string
  onQueryChange: (value: string) => void
  onLocationChange: (value: string) => void
}

const LOCATION_OPTIONS = [
  { value: '', label: 'All Oyo State' },
  ...getAllLocationNames().map((name) => ({ value: name, label: name })),
]

export function JobsSearchRow({
  query,
  location,
  onQueryChange,
  onLocationChange,
}: JobsSearchRowProps) {
  return (
    <form
      className="jobs-search-row"
      role="search"
      aria-label="Search jobs"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="input-wrapper jobs-search-row__field">
        <Search size={18} className="input-icon" aria-hidden="true" />
        <input
          type="search"
          className="input jobs-search-row__keyword"
          placeholder="Job title, keyword or company"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Job title, keyword or company"
        />
      </div>

      <div className="input-wrapper jobs-search-row__field">
        <MapPin size={18} className="input-icon" aria-hidden="true" />
        <select
          className="input input--select jobs-search-row__location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          aria-label="Location"
        >
          {LOCATION_OPTIONS.map((option) => (
            <option key={option.value || 'all-locations'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn--primary jobs-search-row__btn">
        Search Jobs
      </button>
    </form>
  )
}
