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
} from 'lucide-react'
import { JobGrid } from '../../components/jobs/JobGrid'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import { Pagination } from '../../components/common/Pagination'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { jobService } from '../../services/jobService'
import { jobCategoryBySlug } from '../../data/jobCategories'
import { JOB_SORT_OPTIONS } from '../../types/jobs'
import type { Job, JobFilters as JobFiltersType, EmploymentType, ExperienceLevel } from '../../types/jobs'

import { JobsHero } from '../../components/jobs/JobsHero'
import { OpportunityTypeCard } from '../../components/jobs/OpportunityTypeCard'
import { CreateOpportunityCard } from '../../components/jobs/CreateOpportunityCard'
import { JobsSearchRow } from '../../components/jobs/JobsSearchRow'
import { JobFilterPills } from '../../components/jobs/JobFilterPills'
import { JobCategoryCard } from '../../components/jobs/JobCategoryCard'
import { JobsNotificationBanner } from '../../components/jobs/JobsNotificationBanner'

const ITEMS_PER_PAGE = 12

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

export function JobsListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

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

  const onFilterPillsChange = (value: EmploymentType | '') => {
    updateFilters({ employmentType: value || undefined })
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

  return (
    <main className="jobs-landing">
      <JobsHero />

      <section className="opportunities-section" aria-label="Opportunity types">
        <div className="container">
          <div className="opportunities-grid">
            <OpportunityTypeCard
              icon={<Briefcase size={28} />}
              title="Find Jobs"
              description="Search thousands of job opportunities"
              to="/jobs"
            />
            <OpportunityTypeCard
              icon={<GraduationCap size={28} />}
              title="Internships"
              description="Kickstart your career with real experience"
              to="/jobs?employmentType=internship"
            />
            <OpportunityTypeCard
              icon={<Award size={28} />}
              title="Apprenticeships"
              description="Learn, earn and grow in your field"
              to="/jobs?employmentType=apprenticeship"
            />
            <OpportunityTypeCard
              icon={<Building2 size={28} />}
              title="Local Opportunities"
              description="Discover opportunities near you"
              to="/jobs?location=Ibadan"
            />
            <CreateOpportunityCard />
          </div>
        </div>
      </section>

      <section className="jobs-content-section" aria-label="Browse opportunities">
        <div className="container">
          <div className="jobs-content-layout">
            <div className="jobs-featured-card jobs-card">
              <div className="jobs-card__head">
                <h2 className="jobs-card__title">Featured Opportunities</h2>
                <Link to="/jobs" className="jobs-card__link">
                  <span>View all jobs</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {featuredLoading ? (
                <JobGrid variant="featured" columns={3} loading />
              ) : featuredJobs.length > 0 ? (
                <JobGrid variant="featured" columns={3} jobs={featuredJobs} />
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

            <div className="jobs-browse-card jobs-card">
              <SectionHeading
                align="left"
                title="Browse All Jobs"
                subtitle="Search and filter thousands of opportunities across Oyo State."
              />

              <JobsSearchRow
                query={filters.query ?? ''}
                location={filters.location ?? ''}
                onQueryChange={(q) => updateFilters({ query: q || undefined })}
                onLocationChange={(l) =>
                  updateFilters({ location: l || undefined, area: undefined })
                }
              />

              <JobFilterPills activeType={activeType} onChange={onFilterPillsChange} />

              <div className="jobs-results-toolbar">
                {!loading && (
                  <span className="results-summary">
                    {totalItems > 0
                      ? `Showing ${startIndex}–${endIndex} of ${totalItems} jobs`
                      : hasAnyFilters
                        ? '0 jobs found'
                        : 'No jobs posted yet'}
                  </span>
                )}
                <label htmlFor="jobs-sort" className="visually-hidden">
                  Sort by
                </label>
                <select
                  id="jobs-sort"
                  className="input input--select jobs-results-toolbar__sort"
                  value={sortBy}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  aria-label="Sort by"
                >
                  {JOB_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <JobGrid columns={3} loading />
              ) : totalItems > 0 ? (
                <>
                  <JobGrid columns={3} jobs={paginated.items} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={paginated.totalPages}
                    onPageChange={setCurrentPage}
                  />
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
          </div>
        </div>
      </section>

      <section className="jobs-categories-section" aria-label="Popular job categories">
        <div className="container">
          <SectionHeading
            align="center"
            title="Popular Job Categories"
            subtitle="Explore opportunities by category"
            eyebrow="BROWSE BY CATEGORY"
          />
          <div className="job-categories-grid">
            {POPULAR_CATEGORIES.map((category) => (
              <JobCategoryCard
                key={category.slug}
                category={{
                  id: category.slug,
                  name: category.name,
                  slug: category.slug,
                  icon: '',
                  description: '',
                }}
                icon={category.icon}
                jobCount={categoryCounts[category.slug] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      <JobsNotificationBanner />
    </main>
  )
}

export default JobsListing
