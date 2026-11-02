import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Check, Clock3,
  Heart, MapPin, Search, Users, type LucideIcon,
} from 'lucide-react'
import { Button, SearchInput } from '../../components/ui'
import { Select } from '../../components/ui/Input'
import { Pagination } from '../../components/common/Pagination'
import { useAuth } from '../../context/AuthContext'
import { jobCategories } from '../../data/jobCategories'
import { sortJobs } from '../../data/jobs'
import { applicationService, jobService, savedJobsService } from '../../services/jobService'
import type { Job, JobFilters, EmploymentType, ExperienceLevel } from '../../types/jobs'
import './JobsListing.css'

const ITEMS_PER_PAGE = 10
const EMPLOYMENT_FILTERS: { label: string; value: EmploymentType | '' }[] = [
  { label: 'All jobs', value: '' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Internship', value: 'internship' },
  { label: 'Remote', value: 'remote' },
]
const LOCATION_OPTIONS = ['Ibadan', 'Oyo', 'Ogbomoso', 'Saki', 'Kisi', 'Igboho', 'Eruwa', 'Lanlate']
const LOGO_COLORS = ['#e5f3e9', '#e3f1f5', '#fcefdc', '#eee8f7', '#e5f0f7']

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 60) return `${minutes || 1}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'OC'
}

function salaryLabel(job: Job) {
  const { min, max, period, negotiable } = job.salary ?? {}
  if (min == null && max == null) return 'Salary not stated'
  const formatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
  const interval = period ? ` / ${period.replace('annually', 'year').replace('monthly', 'month').replace('hourly', 'hour').replace('daily', 'day')}` : ''
  const amount = min != null && max != null
    ? `${formatter.format(min)} – ${formatter.format(max)}`
    : min != null ? `${formatter.format(min)}+` : `Up to ${formatter.format(max!)}`
  return `${amount}${interval}${negotiable ? ' · Negotiable' : ''}`
}

function LogoTile({ job }: { job: Job }) {
  const colorIndex = Array.from(job.employerName).reduce((sum, character) => sum + character.charCodeAt(0), 0) % LOGO_COLORS.length
  return job.employerLogo ? (
    <span className="jobs-redesign-logo"><img src={job.employerLogo} alt="" /></span>
  ) : (
    <span className="jobs-redesign-logo jobs-redesign-logo--initials" style={{ background: LOGO_COLORS[colorIndex] }} aria-hidden="true">
      {initials(job.employerName)}
    </span>
  )
}

function CategoryIcon({ categorySlug }: { categorySlug: string }) {
  const icons: Record<string, LucideIcon> = {
    administration: BriefcaseBusiness,
    'information-technology': Building2,
    'sales-marketing': ArrowUpRight,
    education: Users,
  }
  const Icon = icons[categorySlug] ?? BriefcaseBusiness
  return <Icon size={17} aria-hidden="true" />
}

export function JobsListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isBusinessOwner } = useAuth()
  const filters = useMemo<JobFilters>(() => ({
    query: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    area: searchParams.get('area') || undefined,
    employmentType: (searchParams.get('employmentType') || undefined) as EmploymentType | undefined,
    experienceLevel: (searchParams.get('experienceLevel') || undefined) as ExperienceLevel | undefined,
    salaryMin: searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    sort: searchParams.get('sort') || 'newest',
  }), [searchParams])

  const [jobs, setJobs] = useState<Job[]>([])
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set())
  const [applicationCounts, setApplicationCounts] = useState({ applied: 0, reviewing: 0, saved: 0 })
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [loading, setLoading] = useState(true)
  const [supportLoading, setSupportLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const updateFilters = useCallback((updates: Partial<JobFilters>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === false) next.delete(key)
      else next.set(key, String(value))
    })
    next.delete('page')
    setSearchParams(next)
    setCurrentPage(1)
  }, [searchParams, setSearchParams])

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const found = await jobService.search(filters)
      setJobs(sortJobs(found, filters.sort || 'newest'))
    } catch (caught) {
      setJobs([])
      setError(caught instanceof Error ? caught.message : 'We could not load jobs right now.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { void loadJobs() }, [loadJobs])

  useEffect(() => { setSearchInput(searchParams.get('q') ?? '') }, [searchParams])

  useEffect(() => {
    let mounted = true
    Promise.all([jobService.getActive(), jobService.getFeatured()]).then(([active, featured]) => {
      if (mounted) { setAllJobs(active); setFeaturedJobs(featured) }
    }).catch(() => {
      if (mounted) { setAllJobs([]); setFeaturedJobs([]) }
    }).finally(() => { if (mounted) setSupportLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setApplicationCounts({ applied: 0, reviewing: 0, saved: 0 })
      setSavedIds(new Set())
      return
    }
    let mounted = true
    setApplicationsLoading(true)
    Promise.all([applicationService.getByApplicant(user.id), savedJobsService.getSavedJobDetails()]).then(([applications, saved]) => {
      if (!mounted) return
      setApplicationCounts({ applied: applications.length, reviewing: applications.filter((application) => application.status === 'reviewing').length, saved: saved.length })
      setSavedIds(new Set(saved.map((job) => job.id)))
    }).catch(() => {
      if (mounted) setApplicationCounts({ applied: 0, reviewing: 0, saved: 0 })
    }).finally(() => { if (mounted) setApplicationsLoading(false) })
    return () => { mounted = false }
  }, [user, isAuthenticated])

  const categoryCounts = useMemo(() => allJobs.reduce<Record<string, number>>((counts, job) => {
    counts[job.categorySlug] = (counts[job.categorySlug] ?? 0) + 1
    return counts
  }, {}), [allJobs])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return { items: jobs.slice(start, start + ITEMS_PER_PAGE), totalPages: Math.ceil(jobs.length / ITEMS_PER_PAGE) }
  }, [jobs, currentPage])

  const toggleSaved = (event: React.MouseEvent, job: Job) => {
    event.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs')
      return
    }
    const isNowSaved = savedJobsService.toggle(job.id)
    setSavedIds((current) => {
      const next = new Set(current)
      if (isNowSaved) next.add(job.id)
      else next.delete(job.id)
      return next
    })
    setApplicationCounts((current) => ({ ...current, saved: Math.max(0, current.saved + (isNowSaved ? 1 : -1)) }))
  }

  const openJob = (jobId: string) => navigate(`/jobs/${jobId}`)
  const onCardKeyDown = (event: KeyboardEvent<HTMLElement>, jobId: string) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openJob(jobId) }
  }

  const activeEmployment = filters.employmentType ?? ''
  const hasFilters = !!(filters.query || filters.category || filters.location || filters.employmentType || filters.area || filters.experienceLevel || filters.salaryMin || filters.featured)

  return (
    <div className="jobs-redesign">
      <div className="jobs-redesign-layout">
        <div className="jobs-redesign-main">
          <section className="jobs-hero-redesign" aria-labelledby="jobs-hero-title">
            <img className="jobs-hero-redesign__image" src="/images/oyo-hero.jpg" alt="" />
            <div className="jobs-hero-redesign__overlay" />
            <div className="jobs-hero-redesign__content">
              <span className="jobs-hero-redesign__eyebrow">OYO STATE, NIGERIA</span>
              <h1 id="jobs-hero-title">Find your next job in Oyo</h1>
              <p>Browse local jobs, internships and career opportunities near you.</p>
              <form className="jobs-hero-search" onSubmit={(event) => { event.preventDefault(); updateFilters({ query: searchInput.trim() || undefined }) }} role="search">
                <SearchInput className="jobs-hero-search__query" value={searchInput} onChange={setSearchInput} onSearch={(value) => updateFilters({ query: value.trim() || undefined })} placeholder="Job title, skill or company" ariaLabel="Job title, skill or company" />
                <span className="jobs-hero-search__divider" />
                <label className="jobs-hero-search__location">
                  <MapPin size={16} aria-hidden="true" />
                  <select aria-label="Job location" value={filters.location ?? ''} onChange={(event) => updateFilters({ location: event.target.value || undefined })}>
                    <option value="">All Oyo State</option>
                    {LOCATION_OPTIONS.map((location) => <option value={location} key={location}>{location}</option>)}
                  </select>
                </label>
                <button type="submit">Search jobs <ArrowRight size={16} aria-hidden="true" /></button>
              </form>
            </div>
          </section>

          <section className="jobs-redesign-results" aria-labelledby="jobs-results-title">
            <div className="jobs-redesign-filterbar">
              <div className="jobs-redesign-chips" aria-label="Filter by job type">
                {EMPLOYMENT_FILTERS.map(({ label, value }) => (
                  <button key={label} type="button" className={`jobs-redesign-chip${activeEmployment === value ? ' is-active' : ''}`} aria-pressed={activeEmployment === value} onClick={() => updateFilters({ employmentType: value || undefined })}>{label}</button>
                ))}
              </div>
              <div className="jobs-redesign-selects">
                <Select aria-label="Filter by category" className="jobs-redesign-select" value={filters.category ?? ''} onChange={(value) => updateFilters({ category: value || undefined })} options={[{ value: '', label: 'All categories' }, ...jobCategories.map(({ slug, name }) => ({ value: slug, label: name }))]} placeholder="Category" />
                <Select aria-label="Filter by location" className="jobs-redesign-select" value={filters.location ?? ''} onChange={(value) => updateFilters({ location: value || undefined })} options={LOCATION_OPTIONS.map((location) => ({ value: location, label: location }))} placeholder="Location" />
                <Select aria-label="Sort jobs" className="jobs-redesign-select jobs-redesign-select--sort" value={filters.sort ?? 'newest'} onChange={(value) => updateFilters({ sort: value })} options={[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'salary-high', label: 'Highest salary' }, { value: 'salary-low', label: 'Lowest salary' }, { value: 'title', label: 'Title A-Z' }]} />
              </div>
            </div>

            <div className="jobs-redesign-list-heading">
              <div><span className="jobs-redesign-eyebrow">LOCAL OPPORTUNITIES</span><h2 id="jobs-results-title">Jobs in Oyo State</h2></div>
              <p>{loading ? 'Finding matching jobs…' : `Showing ${jobs.length} jobs in Oyo State`}</p>
            </div>

            {error ? (
              <div className="jobs-redesign-state jobs-redesign-state--error" role="alert"><BriefcaseBusiness size={25} /><strong>We couldn’t load these jobs.</strong><span>{error}</span><Button type="button" size="sm" onClick={() => void loadJobs()}>Try again</Button></div>
            ) : loading ? (
              <div className="jobs-redesign-list" role="status" aria-label="Loading jobs">{Array.from({ length: 5 }).map((_, index) => <div className="jobs-redesign-skeleton" key={index}><span /><div><i /><i /><i /></div><span /><span /></div>)}</div>
            ) : jobs.length ? (
              <>
                <div className="jobs-redesign-list" role="list" aria-label="Jobs in Oyo State">
                  {paginated.items.map((job) => {
                    const saved = savedIds.has(job.id)
                    return (
                      <article className="jobs-redesign-card" key={job.id} role="link" tabIndex={0} aria-label={`${job.title} at ${job.employerName}`} onClick={() => openJob(job.id)} onKeyDown={(event) => onCardKeyDown(event, job.id)}>
                        <div className="jobs-redesign-card__identity">
                          <LogoTile job={job} />
                          <div className="jobs-redesign-card__title"><Link to={`/jobs/${job.id}`} onClick={(event) => event.stopPropagation()}>{job.title}</Link><span><Building2 size={14} aria-hidden="true" />{job.employerName}</span><small><MapPin size={13} aria-hidden="true" />{[job.location.town, job.location.lga].filter(Boolean).join(', ')}</small></div>
                        </div>
                        <div className="jobs-redesign-card__tags"><span className="jobs-redesign-tag jobs-redesign-tag--type">{job.employmentType.replace('-', ' ')}</span><span className="jobs-redesign-tag">{job.category}</span>{job.employmentType === 'remote' && <span className="jobs-redesign-tag jobs-redesign-tag--remote">Remote</span>}</div>
                        <div className="jobs-redesign-card__actions"><div className="jobs-redesign-card__meta"><strong>{salaryLabel(job)}</strong><span><Clock3 size={13} aria-hidden="true" />{timeAgo(job.createdAt)}</span></div><div className="jobs-redesign-card__buttons"><Button type="button" variant={saved ? 'secondary' : 'outline'} size="sm" aria-pressed={saved} aria-label={saved ? 'Remove saved job' : 'Save job'} onClick={(event) => toggleSaved(event, job)}>{saved ? <Check size={15} aria-hidden="true" /> : <Heart size={15} aria-hidden="true" />}{saved ? 'Saved' : 'Save'}</Button><Button type="button" size="sm" onClick={(event) => { event.stopPropagation(); navigate(`/jobs/${job.id}?apply=1`) }}>Apply <ArrowUpRight size={14} aria-hidden="true" /></Button></div></div>
                      </article>
                    )
                  })}
                </div>
                {paginated.totalPages > 1 && <Pagination currentPage={currentPage} totalPages={paginated.totalPages} onPageChange={setCurrentPage} />}
              </>
            ) : (
              <div className="jobs-redesign-state"><Search size={25} /><strong>{hasFilters ? 'No jobs match your search' : 'No jobs posted yet'}</strong><span>{hasFilters ? 'Try another keyword or clear some filters to see more opportunities.' : 'New local opportunities will appear here when employers post them.'}</span>{hasFilters && <Button type="button" variant="outline" size="sm" onClick={() => setSearchParams(new URLSearchParams())}>Clear filters</Button>}</div>
            )}
          </section>
        </div>

        <aside className="jobs-redesign-rail" aria-label="Job seeker tools">
          {isBusinessOwner && <section className="jobs-redesign-hiring"><span><BriefcaseBusiness size={18} aria-hidden="true" /></span><h2>Hiring in Oyo State?</h2><p>Reach local talent and find the right people for your team.</p><Link to="/jobs/post">Post a Job <ArrowRight size={15} aria-hidden="true" /></Link></section>}

          <section className="jobs-redesign-rail-card"><div className="jobs-redesign-rail-heading"><div><span className="jobs-redesign-eyebrow">EXPLORE</span><h2>Browse by category</h2></div><BriefcaseBusiness size={17} aria-hidden="true" /></div><div className="jobs-redesign-category-list">{jobCategories.slice(0, 8).map((category) => <button type="button" key={category.slug} onClick={() => updateFilters({ category: category.slug })} className={filters.category === category.slug ? 'is-active' : ''}><span className="jobs-redesign-category-icon"><CategoryIcon categorySlug={category.slug} /></span><span>{category.name}</span><small>{supportLoading ? '—' : categoryCounts[category.slug] ?? 0}</small></button>)}</div></section>

          {isAuthenticated && <section className="jobs-redesign-rail-card jobs-redesign-applications"><div className="jobs-redesign-rail-heading"><div><span className="jobs-redesign-eyebrow">YOUR ACTIVITY</span><h2>Your applications</h2></div><Users size={17} aria-hidden="true" /></div><div className="jobs-redesign-application-stats"><div><strong>{applicationsLoading ? '—' : applicationCounts.applied}</strong><span>Applied</span></div><div><strong>{applicationsLoading ? '—' : applicationCounts.reviewing}</strong><span>In review</span></div><div><strong>{applicationsLoading ? '—' : applicationCounts.saved}</strong><span>Saved</span></div></div><Link className="jobs-redesign-view-all" to="/job-seeker#applications">View all <ArrowRight size={14} aria-hidden="true" /></Link></section>}

          {!supportLoading && featuredJobs.length > 0 && <section className="jobs-redesign-rail-card jobs-redesign-featured"><div className="jobs-redesign-rail-heading"><div><span className="jobs-redesign-eyebrow">HIGHLIGHTED</span><h2>Featured jobs</h2></div><Check size={17} aria-hidden="true" /></div>{featuredJobs.slice(0, 3).map((job) => <Link className="jobs-redesign-featured-link" key={job.id} to={`/jobs/${job.id}`}><strong>{job.title}</strong><small>{job.employerName} · {job.location.town}</small></Link>)}<button type="button" className="jobs-redesign-view-all-button" onClick={() => updateFilters({ featured: true })}>Browse featured <ArrowRight size={14} aria-hidden="true" /></button></section>}
        </aside>
      </div>
    </div>
  )
}

export default JobsListing
