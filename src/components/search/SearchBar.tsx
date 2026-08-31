import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { LocationSelector } from './LocationSelector'

interface SearchBarProps {
  initialQuery?: string
  initialLocation?: string
  size?: 'md' | 'lg'
}

export function SearchBar({
  initialQuery = '',
  initialLocation = '',
  size = 'lg',
}: SearchBarProps) {
  const navigate = useNavigate()

  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (query.trim()) {
      params.set('q', query.trim())
    }

    if (location) {
      params.set('location', location)
    }

    const qs = params.toString()

    navigate(qs ? `/search?${qs}` : '/search')
  }

  return (
    <form
      className={`search-bar search-bar--${size}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <label className="search-bar__field search-bar__field--query">
        <Search size={20} aria-hidden="true" />

        <input
          type="search"
          className="search-bar__input"
          placeholder="What service or business are you looking for?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search for a service or business"
        />
      </label>

      <span
        className="search-bar__divider"
        aria-hidden="true"
      />

      <label className="search-bar__field search-bar__field--location">
        <LocationSelector
          id="search-location"
          value={location}
          onChange={setLocation}
          placeholder="All Oyo State"
          ariaLabel="Choose a location"
        />
      </label>

      <button
        type="submit"
        className="search-bar__submit"
      >
        <Search size={18} aria-hidden="true" />
        <span>Search</span>
        <ArrowRight
          size={16}
          className="search-bar__submit-arrow"
          aria-hidden="true"
        />
      </button>
    </form>
  )
}