import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  GraduationCap,
  Award,
  Laptop,
  Megaphone,
  Banknote,
  HeartPulse,
  Wrench,
  Truck,
  UtensilsCrossed,
  ArrowUpRight,
  Search,
  Filter,
  MapPin,
} from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button, ButtonLink, Card, Badge, Skeleton, SearchInput, Select } from '../../components/ui'
import { Pagination } from '../../components/common/Pagination'
import { jobService } from '../../services/jobService'
import { jobCategoryBySlug } from '../../data/jobCategories'
import { JOB_SORT_OPTIONS } from '../../types/jobs'
import type { Job, JobFilters as JobFiltersType, EmploymentType, ExperienceLevel } from '../../types/jobs'

const ITEMS_PER_PAGE = 10

const CATEGORY_ICONS: Record<string, ReactNode> = {
  'information-technology': <Laptop size={24} />,
  'sales-marketing': <Megaphone size={24} />,
  'accounting-finance': <Banknote size={24} />,
  'healthcare': <HeartPulse size={24} />,
  'education': <GraduationCap size={24} />,
  'engineering': <Wrench size={24} />,
  'driving-logistics': <Truck size={24} />,
  'hospitality': <UtensilsCrossed size={24} />,
}

const POPULAR_CATEGORY_SLUGS = [
  'information-technology',
  'sales-marketing',
  'accounting-finance',
  'healthcare',
  'education',
  'engineering',
  'driving-logistics',
  'hospitality',
] as const

const POPULAR_CATEGORIES = POPULAR_CATEGORY_SLUGS.map((slug) => ({
  slug,
  name: jobCategoryBySlug(slug)?.name ?? slug,
  icon: CATEGORY_ICONS[slug] ?? <Briefcase size={24} />,
}))

const EMPLOYMENT_TYPES: EmploymentType[] = ['full-time', 'part-time', 'contract', 'internship', 'apprenticeship']

export function JobsListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const filters: JobFiltersType = useMemo(
    () => ({
      query: searchParams.get('q') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      location: searchParams.get('location') ?? undefined,
      area: searchParams.get('area') ?? undefined,
      employmentType: (searchParams.get('employmentType') ?? undefined) as
        | EmploymentType
        | undefined,
      experienceLevel: (searchParams.get('experienceLevel') ?? undefined) as
        | ExperienceLevel
        | undefined,
      salaryMin: searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
      featured: searchParams.get('featured') === 'true',
      sort: searchParams.get('sort') ?? undefined,
    }),
    [searchParams],
  )

  const sortBy = searchParams.get('sort') ?? 'newest'
  const activeType = (filters.employmentType ?? '') as EmploymentType | ''

  const [results, setResults] = useState<Job[]>([])
  const [totalItems, setTotalItems] = useState(0)

  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [allJobs, setAllJobs] = useState<Job[]>([])

  useEffect(() => {
    setCurrentPage(1)
    const loadResults = async () => {
      setLoading(true)
      try {
        const jobs = await jobService.search(filters)
        setResults(jobs)
        setTotalItems(jobs.length)
      } catch {
        setResults([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [filters, sortBy])

  useEffect(() => {
    let mounted = true
    const loadSupporting = async () => {
      setFeaturedLoading(true)
      try {
        const [featured, all] = await Promise.all([
          jobService.getFeatured(),
          jobService.getActive(),
        ])
        if (mounted) {
          setFeaturedJobs(featured)
          setAllJobs(all)
        }
      } catch {
        if (mounted) {
          setFeaturedJobs([])
          setAllJobs([])
        }
      } finally {
        if (mounted) setFeaturedLoading(false)
      }
    }
    loadSupporting()
    return () => {
      mounted = false
    }
  }, [])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return {
      items: results.slice(start, end),
      totalPages: Math.ceil(results.length / ITEMS_PER_PAGE),
      totalItems: results.length,
    }
  }, [results, currentPage])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allJobs.forEach((job) => {
      counts[job.categorySlug] = (counts[job.categorySlug] ?? 0) + 1
    })
    return counts
  }, [allJobs])

  const updateFilters = (newFilters: Partial<JobFiltersType>) => {
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

  const hasAnyFilters =
    !!filters.query ||
    !!filters.category ||
    !!filters.location ||
    !!filters.area ||
    !!filters.employmentType ||
    !!filters.experienceLevel ||
    !!filters.salaryMin ||
    !!filters.featured

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.query) count++
    if (filters.category) count++
    if (filters.location) count++
    if (filters.employmentType) count++
    if (filters.experienceLevel) count++
    if (filters.salaryMin) count++
    if (filters.featured) count++
    return count
  }, [filters])

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const handleSearch = (value: string) => {
    if (value.trim()) {
      updateFilters({ query: value.trim() })
    } else {
      updateFilters({ query: undefined })
    }
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

  return (
    <>
      {/* Hero Section */}
      <section className="jobs-hero">
        <div className="jobs-hero__content">
          <span className="jobs-hero__eyebrow">WORK & OPPORTUNITIES</span>
          <h1 className="jobs-hero__title">
            Find Your <span className="jobs-hero__accent">Next Opportunity</span>
          </h1>
          <p className="jobs-hero__subtitle">
            Discover jobs, internships, apprenticeships and local opportunities across
            Oyo State.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="jobs-search-section">
        <div className="container">
          <div className="jobs-search-form">
            <div className="jobs-search-form__field">
              <label htmlFor="job-search" className="visually-hidden">Search jobs</label>
              <SearchInput
                id="job-search"
                value={filters.query ?? ''}
                onChange={(v) => updateFilters({ query: v || undefined })}
                onSearch={handleSearch}
                placeholder="Job title, keyword or company"
                ariaLabel="Search jobs"
              />
            </div>

            <div className="jobs-search-form__field">
              <label htmlFor="job-location" className="visually-hidden">Location</label>
              <Select
                id="job-location"
                value={filters.location ?? ''}
                onChange={(v) => updateFilters({ location: v || undefined, area: undefined })}
                placeholder="All Oyo State"
                icon={<MapPin size={18} />}
                options={[
                  { value: '', label: 'All Oyo State' },
                  ...['Ibadan', 'Oyo', 'Ogboroso', 'Saki', 'Kisi', 'Igboho', 'Eruwa', 'Lanlate'].map((loc) => ({
                    value: loc,
                    label: loc,
                  })),
                ]}
              />
            </div>

            <button
              type="button"
              className="jobs-search-form__filter-btn"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
            >
              <Filter size={18} aria-hidden="true" />
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="jobs-filter-badge">{activeFiltersCount}</span>}
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="jobs-filter-drawer">
              <div className="jobs-filter-drawer__backdrop" onClick={() => setShowFilters(false)} />
              <aside className="jobs-filter-drawer__panel" role="dialog" aria-label="Job filters">
                <div className="jobs-filter-drawer__header">
                  <h3>Filters</h3>
                  <button
                    type="button"
                    className="jobs-filter-drawer__close"
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="jobs-filter-drawer__body">
                  <div className="jobs-filter-group">
                    <label htmlFor="filter-employment" className="jobs-filter-label">Employment Type</label>
                    <Select
                      id="filter-employment"
                      value={activeType}
                      onChange={(v) => updateFilters({ employmentType: (v || undefined) as EmploymentType | undefined })}
                      placeholder="All types"
                      options={[
                        { value: '', label: 'All types' },
                        ...EMPLOYMENT_TYPES.map((type) => ({
                          value: type,
                          label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
                        })),
                      ]}
                    />
                  </div>

                  <div className="jobs-filter-group">
                    <label htmlFor="filter-category" className="jobs-filter-label">Category</label>
                    <Select
                      id="filter-category"
                      value={filters.category ?? ''}
                      onChange={(v) => updateFilters({ category: v || undefined })}
                      placeholder="All categories"
                      options={[
                        { value: '', label: 'All categories' },
                        ...POPULAR_CATEGORIES.map((cat) => ({
                          value: cat.slug,
                          label: cat.name,
                        })),
                      ]}
                    />
                  </div>

                  <div className="jobs-filter-group">
                    <label htmlFor="filter-sort" className="jobs-filter-label">Sort By</label>
                    <Select
                      id="filter-sort"
                      value={sortBy}
                      onChange={(v) => updateFilters({ sort: v })}
                      placeholder="Newest first"
                      options={JOB_SORT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                    />
                  </div>

                  {hasAnyFilters && (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      fullWidth
                      className="jobs-filter-drawer__clear"
                      onClick={clearAllFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* Employment Type Pills (Desktop) */}
          <div className="jobs-type-pills">
            {EMPLOYMENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`jobs-type-pill ${activeType === type ? 'active' : ''}`}
                onClick={() => updateFilters({ employmentType: type })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="jobs-section">
        <div className="container">
          <header className="jobs-section__header">
            <div>
              <h2 className="jobs-section__title">Featured Opportunities</h2>
              <p className="jobs-section__subtitle">Hand-picked opportunities from top employers</p>
            </div>
            <Link to="/jobs" className="jobs-section__link">
              View all <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </header>

          {featuredLoading ? (
            <div className="jobs-grid" role="status" aria-label="Loading featured jobs">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} variant="skeleton" className="jobs-skeleton-card">
                  <div />
                </Card>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="jobs-grid" role="list" aria-label="Featured jobs">
              {featuredJobs.slice(0, 3).map((job) => (
                <article key={job.id} className="jobs-card" role="listitem">
                  <div className="jobs-card__header">
                    <span className="jobs-card__type">{job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1).replace('-', ' ')}</span>
                    {job.featured && <Badge variant="brand" size="sm">Featured</Badge>}
                  </div>
                  <h3 className="jobs-card__title">{job.title}</h3>
                  <div className="jobs-card__company">
                    <Building2 size={16} aria-hidden="true" />
                    <span>{job.employerName}</span>
                  </div>
                  <div className="jobs-card__meta">
                    <span className="jobs-card__location">
                      <MapPin size={14} aria-hidden="true" />
                      {job.location.town}, {job.location.lga}
                    </span>
                    {job.salary?.min && (
                      <span className="jobs-card__salary">
                        ₦{job.salary.min.toLocaleString()}+
                      </span>
                    )}
                  </div>
                  <ButtonLink to={`/jobs/${job.id}`} variant="primary" size="sm" fullWidth className="jobs-card__btn">
                    View Job
                  </ButtonLink>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Briefcase size={48} />}
              title="No featured jobs at the moment."
              description="Be the first to showcase a great opportunity!"
              action={
                <ButtonLink to="/jobs/post" variant="outline" size="sm">
                  Post the First Job
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      {/* All Jobs */}
      <section className="jobs-section jobs-section--tinted">
        <div className="container">
          <header className="jobs-section__header">
            <div>
              <h2 className="jobs-section__title">All Jobs</h2>
              <p className="jobs-section__subtitle">Search and filter thousands of opportunities across Oyo State.</p>
            </div>
          </header>

          {!loading && (
            <div className="jobs-results-toolbar">
              <span className="jobs-results-summary">
                {totalItems > 0
                  ? `Showing ${startIndex}–${endIndex} of ${totalItems} jobs`
                  : hasAnyFilters
                    ? '0 jobs found'
                    : 'No jobs posted yet'}
              </span>
            </div>
          )}

          {loading ? (
            <div className="jobs-grid" role="status" aria-label="Loading jobs">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} variant="skeleton" className="jobs-skeleton-card">
                  <div />
                </Card>
              ))}
            </div>
          ) : totalItems > 0 ? (
            <>
              <div className="jobs-grid" role="list" aria-label="Job listings">
                {paginated.items.map((job) => (
                  <article key={job.id} className="jobs-card" role="listitem">
                    <div className="jobs-card__header">
                      <span className="jobs-card__type">{job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1).replace('-', ' ')}</span>
                      {job.featured && <Badge variant="brand" size="sm">Featured</Badge>}
                    </div>
                    <h3 className="jobs-card__title">{job.title}</h3>
                    <div className="jobs-card__company">
                      <Building2 size={16} aria-hidden="true" />
                      <span>{job.employerName}</span>
                    </div>
                    <div className="jobs-card__meta">
                      <span className="jobs-card__location">
                        <MapPin size={14} aria-hidden="true" />
                        {job.location.town}, {job.location.lga}
                      </span>
                      {job.salary?.min && (
                        <span className="jobs-card__salary">
                          ₦{job.salary.min.toLocaleString()}+
                        </span>
                      )}
                    </div>
                    <ButtonLink to={`/jobs/${job.id}`} variant="primary" size="sm" fullWidth className="jobs-card__btn">
                      View Job
                    </ButtonLink>
                  </article>
                ))}
              </div>
              {paginated.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginated.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={<Briefcase size={36} />}
              title={hasAnyFilters ? 'No jobs match your search' : 'No jobs posted yet'}
              description={
                hasAnyFilters
                  ? 'Try a different keyword, clear some filters, or explore all jobs.'
                  : 'Be the first to post a job on OyoConnect.'
              }
              action={
                <ButtonLink
                  to={hasAnyFilters ? '/jobs' : '/jobs/post'}
                  variant="primary"
                  size="sm"
                >
                  {hasAnyFilters ? 'Clear all filters' : 'Post a job'}
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="jobs-section">
        <div className="container">
          <header className="jobs-section__header">
            <div>
              <span className="jobs-section__eyebrow">BROWSE BY CATEGORY</span>
              <h2 className="jobs-section__title">Popular Job Categories</h2>
              <p className="jobs-section__subtitle">Explore opportunities by category</p>
            </div>
          </header>
          <div className="jobs-category-grid" role="list" aria-label="Job categories">
            {POPULAR_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={`/jobs?category=${category.slug}`}
                className="jobs-category-card"
                role="listitem"
              >
                <span className="jobs-category-card__icon" aria-hidden="true">
                  {category.icon}
                </span>
                <div className="jobs-category-card__content">
                  <span className="jobs-category-card__name">{category.name}</span>
                  <span className="jobs-category-card__count">
                    {categoryCounts[category.slug] ?? 0} jobs
                  </span>
                </div>
                <ArrowUpRight size={18} className="jobs-category-card__arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default JobsListing