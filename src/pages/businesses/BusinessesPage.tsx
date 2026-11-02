import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Building2, MapPin, MessageCircle, Search, SlidersHorizontal } from 'lucide-react'
import { businessService } from '../../services/businessService'
import type { Business, Category, Location } from '../../types/business'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import { telHref } from '../../utils/phone'
import { whatsappHref } from '../../utils/whatsapp'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { FormField } from '../../components/ui/FormField'
import { Rating } from '../../components/ui/Rating'
import './BusinessesPage.css'

const filtersFromParams = (params: URLSearchParams) => ({
  query: params.get('q') || undefined,
  category: params.get('category') || undefined,
  location: params.get('location') || undefined,
  verified: params.get('verified') === '1' ? true : undefined,
  openNow: params.get('openNow') === '1' ? true : undefined,
  minRating: Number(params.get('minRating')) || undefined,
})

export default function BusinessesPage() {
  const [params, setParams] = useSearchParams()
  const { user } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [queryInput, setQueryInput] = useState(params.get('q') || '')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [directory, setDirectory] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => setQueryInput(params.get('q') || ''), [params])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [items, allItems, categoryItems, locationItems] = await Promise.all([
          businessService.search({ ...filtersFromParams(params), ...(import.meta.env.DEV ? { location: undefined } : {}) }),
          businessService.search({}),
          businessService.fetchCategories().catch(() => []),
          businessService.fetchLocations().catch(() => []),
        ])
        if (!mounted) return
        const sorted = businessService.sort(items, params.get('sort') || 'newest')
        const selectedLga = params.get('location')?.toLowerCase()
        setBusinesses(selectedLga
          ? sorted.filter((business) => [business.locationData?.lga, business.location, business.state].some((location) => location?.toLowerCase() === selectedLga))
          : sorted)
        setDirectory(allItems)
        setCategories(categoryItems)
        setLocations(locationItems)
      } catch (cause) {
        if (mounted) setError(cause instanceof Error ? cause.message : 'Businesses could not be loaded.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => { mounted = false }
  }, [params])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    directory.forEach((business) => counts.set(business.category, (counts.get(business.category) || 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [directory])

  const lgaCounts = useMemo(() => {
    const counts = new Map<string, number>()
    directory.forEach((business) => {
      const lga = business.locationData?.lga
      if (lga) counts.set(lga, (counts.get(lga) || 0) + 1)
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [directory])

  const categoryOptions = categories.length
    ? categories.map((category) => ({ value: category.name, label: category.name }))
    : [...new Set(directory.map((business) => business.category).filter(Boolean))].map((name) => ({ value: name, label: name }))

  const lgas = [...new Set(directory.map((business) => business.locationData?.lga).filter((value): value is string => Boolean(value)))]
  const locationOptions = lgas.length
    ? lgas.map((name) => ({ value: name, label: name }))
    : locations.map((location) => ({ value: location.name, label: location.name }))

  const setFilter = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    setFilter('q', queryInput.trim() || undefined)
  }

  const handleChipClick = (key: string) => {
    const next = new URLSearchParams(params)
    if (key === 'all') {
      next.delete('verified')
      next.delete('openNow')
    } else if (params.get(key) === '1') {
      next.delete(key)
    } else {
      next.set(key, '1')
    }
    setParams(next)
  }

  return (
    <div className="biz-dir">
      <div className="biz-dir__frame">
        <section className="biz-dir-hero" aria-label="Business search">
          <div className="biz-dir-hero__copy">
            <span className="biz-dir-kicker">LOCAL DIRECTORY · OYO STATE</span>
            <h1>Find trusted businesses in Oyo</h1>
            <p>Discover local services and businesses, with details from their OyoConnect listings.</p>
            <form className="biz-dir-search" onSubmit={submitSearch}>
              <SearchInput
                value={queryInput}
                onChange={setQueryInput}
                placeholder="Business, service or keyword"
                ariaLabel="Search businesses"
                className="biz-dir-search__query"
              />
              <FormField
                label="Location"
                htmlFor="location-select"
                className="biz-dir-search__location"
              >
                <select
                  id="location-select"
                  value={params.get('location') || ''}
                  onChange={(event) => setFilter('location', event.target.value || undefined)}
                  aria-label="Choose location"
                  className="biz-dir-search__select"
                >
                  <option value="">All Oyo State</option>
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </FormField>
              <Button type="submit" variant="primary" size="md" fullWidth className="biz-dir-search__btn">
                <Search size={16} /> Search
              </Button>
            </form>
          </div>
        </section>

        <div className="biz-dir__columns">
          <section className="biz-dir__results" aria-label="Business results">
            <div className="biz-dir-toolbar">
              <div className="biz-dir-chips" aria-label="Quick filters" role="group">
                <Button
                  variant={!params.has('verified') && !params.has('openNow') ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleChipClick('all')}
                  className="biz-dir-chip"
                >
                  All
                </Button>
                <Button
                  variant={params.get('verified') === '1' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleChipClick('verified')}
                  className="biz-dir-chip"
                >
                  <BadgeCheck size={12} /> Verified
                </Button>
                <Button
                  variant={params.get('openNow') === '1' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleChipClick('openNow')}
                  className="biz-dir-chip"
                >
                  Open now
                </Button>
              </div>
              <div className="biz-dir-dropdowns">
                <FormField
                  label="Category"
                  htmlFor="category-select"
                  className="biz-dir-dropdown"
                >
                  <select
                    id="category-select"
                    value={params.get('category') || ''}
                    onChange={(event) => setFilter('category', event.target.value || undefined)}
                    className="biz-dir-select"
                  >
                    <option value="">All categories</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="LGA"
                  htmlFor="lga-select"
                  className="biz-dir-dropdown"
                >
                  <select
                    id="lga-select"
                    value={params.get('location') || ''}
                    onChange={(event) => setFilter('location', event.target.value || undefined)}
                    className="biz-dir-select"
                  >
                    <option value="">All LGAs</option>
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Rating"
                  htmlFor="rating-select"
                  className="biz-dir-dropdown"
                >
                  <select
                    id="rating-select"
                    value={params.get('minRating') || ''}
                    onChange={(event) => setFilter('minRating', event.target.value || undefined)}
                    className="biz-dir-select"
                  >
                    <option value="">Any rating</option>
                    <option value="4">4★ & up</option>
                    <option value="3">3★ & up</option>
                  </select>
                </FormField>
                <FormField
                  label="Sort"
                  htmlFor="sort-select"
                  className="biz-dir-dropdown biz-dir-sort"
                >
                  <select
                    id="sort-select"
                    value={params.get('sort') || 'newest'}
                    onChange={(event) => setFilter('sort', event.target.value)}
                    className="biz-dir-select"
                  >
                    <option value="newest">Newest</option>
                    <option value="rating">Top rated</option>
                    <option value="reviews">Most reviewed</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </FormField>
              </div>
            </div>

            <div className="biz-dir-count">
              <strong>{businesses.length} businesses</strong>
              <span>listed in Oyo State</span>
              <SlidersHorizontal size={16} aria-hidden="true" />
            </div>

            {loading ? (
              <div className="biz-dir-grid" aria-label="Loading businesses" role="status">
                {Array.from({ length: 6 }, (_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : error ? (
              <Card variant="default" padding="lg" className="biz-dir-state biz-dir-state--error">
                <div className="biz-dir-state__icon">
                  <Building2 size={25} />
                </div>
                <strong>Businesses didn't load</strong>
                <p>{error}</p>
                <Button variant="primary" size="sm" onClick={() => setParams(new URLSearchParams(params))}>
                  Try again
                </Button>
              </Card>
            ) : businesses.length ? (
              <div className="biz-dir-grid" role="list">
                {businesses.map((business) => {
                  const image = business.logo || business.image
                  const favorite = isFavorite(business.id)
                  return (
                    <article className="biz-dir-card" key={business.id} role="listitem">
                      <Link to={`/business/${business.id}`} className="biz-dir-card__media" aria-label={`View ${business.name}`}>
                        {image ? (
                          <img src={image} alt="" loading="lazy" />
                        ) : (
                          <span className="biz-dir-card__placeholder">
                            {business.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                          </span>
                        )}
                        {business.verified && (
                          <span className="biz-dir-card__verified">
                            <BadgeCheck size={13} /> Verified
                          </span>
                        )}
                      </Link>
                      <CardBody className="biz-dir-card__body">
                        <div className="biz-dir-card__meta">
                          <Badge variant="brand" size="sm" className="biz-dir-card__category">
                            {business.category}
                          </Badge>
                        </div>
                        <h2 className="biz-dir-card__title">
                          <Link to={`/business/${business.id}`}>{business.name}</Link>
                        </h2>
                        <p className="biz-dir-card__place">
                          <MapPin size={14} />
                          {[business.area, business.locationData?.lga || business.location].filter(Boolean).join(', ')}
                        </p>
                        <div className="biz-dir-card__rating">
                          <Rating value={business.rating} reviewCount={business.reviewCount} size="sm" />
                        </div>
                        <div className="biz-dir-card__actions">
                          <ButtonLink
                            to={`/business/${business.id}`}
                            variant="outline"
                            size="sm"
                            className="biz-dir-card__action-btn"
                          >
                            <ArrowUpRight size={15} /> View
                          </ButtonLink>
                          <a
                            href={business.whatsapp
                              ? whatsappHref(business.whatsapp, `Hello ${business.name}, I found you on OyoConnect.`)
                              : telHref(business.phone)}
                            target={business.whatsapp ? '_blank' : undefined}
                            rel={business.whatsapp ? 'noopener noreferrer' : undefined}
                            className="btn btn--whatsapp btn--sm biz-dir-card__action-btn"
                          >
                            <MessageCircle size={15} />
                            Contact
                          </a>
                          <button
                            type="button"
                            className={`biz-dir-card__favorite ${favorite ? 'is-favorite' : ''}`}
                            aria-label={`${favorite ? 'Remove from' : 'Add to'} favorites: ${business.name}`}
                            onClick={() => toggleFavorite(business.id)}
                          >
                            <span aria-hidden="true">{favorite ? '♥' : '♡'}</span>
                          </button>
                        </div>
                      </CardBody>
                    </article>
                  )
                })}
              </div>
            ) : (
              <Card variant="default" padding="lg" className="biz-dir-state">
                <div className="biz-dir-state__icon">
                  <Building2 size={25} />
                </div>
                <strong>No businesses match your search</strong>
                <p>Try another business name, category or location.</p>
                <Button variant="outline" size="sm" onClick={() => { setParams(new URLSearchParams()); setQueryInput('') }}>
                  Clear filters
                </Button>
              </Card>
            )}
          </section>

          <aside className="biz-dir__aside">
            <Card variant="default" padding="lg" className="biz-dir-promo">
              <div className="biz-dir-promo__icon">
                <BriefcaseBusiness size={18} />
              </div>
              <h2>Own a business?</h2>
              <p>Help more people in Oyo discover your business.</p>
              <ButtonLink
                to={user?.role === 'business_owner' ? '/business/register' : '/list-business'}
                variant="primary"
                size="sm"
                className="biz-dir-promo__btn"
              >
                List Your Business <ArrowUpRight size={15} />
              </ButtonLink>
            </Card>

            <Card variant="default" padding="md" className="biz-dir-list-card">
              <CardHeader>
                <h2>Popular categories</h2>
                <span>{directory.length}</span>
              </CardHeader>
              <CardBody>
                {categoryCounts.length ? (
                  categoryCounts.map(([name, count]) => (
                    <button
                      key={name}
                      className="biz-dir-list-row"
                      onClick={() => setFilter('category', name)}
                    >
                      <span>{name}</span>
                      <Badge variant="neutral" size="sm">{count}</Badge>
                    </button>
                  ))
                ) : (
                  <p className="biz-dir-aside-empty">Category counts will appear with listings.</p>
                )}
              </CardBody>
            </Card>

            <Card variant="default" padding="md" className="biz-dir-list-card">
              <CardHeader>
                <h2>Browse by LGA</h2>
                <MapPin size={15} />
              </CardHeader>
              <CardBody>
                {lgaCounts.length ? (
                  lgaCounts.map(([name, count]) => (
                    <button
                      key={name}
                      className="biz-dir-list-row"
                      onClick={() => setFilter('location', name)}
                    >
                      <span>{name}</span>
                      <Badge variant="neutral" size="sm">{count}</Badge>
                    </button>
                  ))
                ) : (
                  <p className="biz-dir-aside-empty">LGA counts will appear with listings.</p>
                )}
              </CardBody>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}