import type { ReactNode, HTMLAttributes, ForwardRefExoticComponent, RefAttributes } from 'react'
import { Search } from 'lucide-react'
import { SearchInput } from './SearchInput'
import './Hero.css'

export type HeroVariant = 'default' | 'businesses' | 'community' | 'jobs' | 'dashboard'

interface HeroProps extends HTMLAttributes<HTMLElement> {
  variant?: HeroVariant
  eyebrow?: string
  title: string
  description?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (event: React.FormEvent) => void
  locationOptions?: { value: string; label: string }[]
  selectedLocation?: string
  onLocationChange?: (value: string) => void
  children?: ReactNode
}

export const Hero = Object.assign(
  (function Hero({
    variant = 'default',
    eyebrow,
    title,
    description,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    locationOptions,
    selectedLocation,
    onLocationChange,
    children,
    className = '',
    ...props
  }: HeroProps) {
    const hasSearch = searchPlaceholder || searchValue || onSearchChange || onSearchSubmit
    const hasLocation = locationOptions && locationOptions.length > 0

    const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onLocationChange?.(event.target.value)
    }

    const handleSearchChange = (value: string) => {
      onSearchChange?.(value)
    }

    return (
      <section className={`hero hero--${variant} ${className}`} {...props}>
        <div className="hero__image" aria-hidden="true">
          <img src="/images/oyo-hero.jpg" alt="" loading="eager" />
          <div className="hero__gradient" />
        </div>
        <div className="hero__content">
          {eyebrow && <span className="hero__eyebrow">{eyebrow}</span>}
          <h1 className="hero__title">{title}</h1>
          {description && <p className="hero__description">{description}</p>}
          {hasSearch && (
            <form className="hero__search" onSubmit={onSearchSubmit}>
              {hasLocation && (
                <div className="hero__search-location">
                  <label htmlFor="hero-location-select" className="visually-hidden">Location</label>
                  <select
                    id="hero-location-select"
                    value={selectedLocation || ''}
                    onChange={handleLocationChange}
                    className="hero__location-select"
                    aria-label="Choose location"
                  >
                    <option value="">All Oyo State</option>
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="hero__search-main">
                <SearchInput
                  value={searchValue || ''}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder || 'Search...'}
                  className="hero__search-input"
                  ariaLabel={searchPlaceholder}
                />
                {onSearchSubmit && (
                  <button type="submit" className="hero__search-btn">
                    <Search size={18} aria-hidden="true" />
                    <span>Search</span>
                  </button>
                )}
              </div>
            </form>
          )}
          {children && <div className="hero__extra">{children}</div>}
        </div>
      </section>
    )
  }) as ForwardRefExoticComponent<HeroProps & RefAttributes<HTMLElement>>,
  { displayName: 'Hero' }
)

export default Hero