import { useState, useEffect, FormEvent } from 'react'
import { Search, MapPin } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Reuse the project's existing locations data
import { locations } from '@/data/locations'

export function Hero() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setLocation(searchParams.get('location') || '')
  }, [searchParams])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }

    if (location) {
      params.set('location', location)
    } else {
      params.delete('location')
    }

    const qs = params.toString()

    navigate(qs ? `/search?${qs}` : '/search')
  }

  return (
    <section className="oyo-hero">
      <div className="oyo-hero__content">
        <div className="oyo-hero__eyebrow">
          <MapPin className="oyo-hero__eyebrow-icon" aria-hidden="true" /> <span>OYO STATE, NIGERIA</span>
        </div>

        <h1 className="oyo-hero__title">Together for a better Oyo</h1>

        <p className="oyo-hero__text">
          Discover local services, jobs, businesses and community updates near you.
        </p>

        <form className="oyo-hero__search" onSubmit={handleSubmit}>
          <svg
            aria-hidden="true"
            className="oyo-hero__search svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.5 2.25a.75.75 0 0 0-.186-.053L12 9.236 2.383 2.055a.75.75 0 1 0-1.083-.041L10.096 4.085a.48.48 0 0 1-.028.316l-1.655 3.75L5.986 2.055a.75.75 0 1 0-1.083-.041L4.18 7.555 9.03 11.753a.23.23 0 0 1-.018.36l3.328 1.873L5.786 21.75a1.125 1.125 0 0 1-1.024.089l-.334.578L2.337 2.5a.75.75 0 0 0-.468 1.173l2.087 6.435a1.125 1.125 0 0 1-.097.908l-.397.643L5.786 21.75a1.125 1.125 0 0 1-1.024.089l-.334.578L2.337 2.5a.75.75 0 0 0-.468 1.173l2.087 6.435a1.125 1.125 0 0 1-.097.908l-.397.643L5.786 21.75a1.125 1.125 0 0 1-1.024.089l-.334.578L2.337 2.5a.75.75 0 0 0-.468 1.173l2.087 6.435a1.125 1.125 0 0 1-.097.908l-.397.643L5.786 21.75a1.125 1.125 0 0 1-1.024.089l-.334.578L2.337 2.5a.75.75 0 0 0-.468 1.173l2.087 6.435"/>
          </svg>

          <input
            type="search"
            name="q"
            placeholder="Search for places, services, jobs, businesses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            className="oyo-hero__search input"
          />

          <select
            name="location"
            onChange={(e) => setLocation(e.target.value)}
            className="oyo-hero__search select"
          >
            <option value="">All Oyo State</option>
            {locations.map((location) => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="oyo-hero__search button"
            aria-label="Search"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  )
}