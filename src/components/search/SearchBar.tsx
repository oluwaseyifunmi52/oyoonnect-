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

  const pillStyles = {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '9999px',
    boxShadow: '0 10px 30px rgba(2, 44, 34, 0.12), 0 4px 12px rgba(2, 44, 34, 0.08)',
    padding: '6px 8px',
    transition: 'box-shadow 0.2s ease',
    maxWidth: size === 'lg' ? '680px' : '640px',
    width: '100%',
  }

  const fieldStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    flex: 1,
    minWidth: 0,
    color: '#64748b',
  }

  const inputStyles = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    fontSize: '15px',
    color: '#0f172a',
  }

  const dividerStyles = {
    width: '1px',
    height: '24px',
    background: '#e2e8f0',
    margin: '0 4px',
  }

  const submitStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '9999px',
    background: '#022c22',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.18s ease, transform 0.05s ease',
  }

  return (
    <form
      style={pillStyles}
      role="search"
      onSubmit={handleSubmit}
    >
      <label style={fieldStyles}>
        <Search size={20} aria-hidden="true" style={{ color: '#64748b', flexShrink: 0 }} />

        <input
          type="search"
          style={inputStyles}
          placeholder="What service or business are you looking for?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search for a service or business"
        />
      </label>

      <span style={dividerStyles} aria-hidden="true" />

      <label style={fieldStyles}>
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
        style={submitStyles}
        onMouseDown={() => {}}
      >
        <span>Search</span>
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  )
}