import { Link } from 'react-router-dom'
import { Briefcase, ArrowRight, Search, Plus, MapPin, Star, Clock, DollarSign } from 'lucide-react'
import { jobService } from '../../services/jobService'
import { getFeaturedJobs } from '../../data/jobs'
import { SectionHeading } from '../ui/SectionHeading'
import { JobCard } from '../../components/jobs/JobCard'
import { ButtonLink } from '../ui/Button'
import { useEffect, useState } from 'react'
import type { Job } from '../../types/jobs'

function JobsCTA() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await getFeaturedJobs()
        setFeaturedJobs(jobs.slice(0, 3))
      } catch {
        setFeaturedJobs([])
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  return (
    <section className="section jobs-cta-section" aria-labelledby="jobs-cta-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Work & Opportunities"
          title="Find Your Next Opportunity"
          subtitle="Discover jobs, internships, apprenticeships and local opportunities across Oyo State."
        />

        <div className="jobs-cta__content">
          <div className="jobs-cta__featured">
            <div className="jobs-cta__featured-header">
              <h3>Featured Opportunities</h3>
              <Link to="/jobs" className="jobs-cta__view-all">
                View all jobs <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <div className="jobs-cta__grid" role="status" aria-label="Loading featured jobs">
                {Array.from({ length: 3 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : featuredJobs.length > 0 ? (
              <div className="jobs-cta__grid" role="list" aria-label="Featured jobs">
                {featuredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    variant="featured"
                    showEmployer={true}
                  />
                ))}
              </div>
            ) : (
              <div className="jobs-cta__empty">
                <Briefcase size={48} aria-hidden="true" />
                <p>No featured jobs at the moment. <Link to="/jobs/post">Post the first one!</Link></p>
              </div>
            )}
          </div>

          <div className="jobs-cta__actions">
            <div className="jobs-cta__action-card">
              <div className="jobs-cta__action-icon">
                <Search size={28} aria-hidden="true" />
              </div>
              <h3>Browse All Jobs</h3>
              <p>Search and filter thousands of opportunities across Oyo State.</p>
              <Link to="/jobs" className="btn btn--primary">
                <Search size={18} aria-hidden="true" />
                Browse Jobs
              </Link>
            </div>

            <div className="jobs-cta__action-card">
              <div className="jobs-cta__action-icon">
                <Plus size={28} aria-hidden="true" />
              </div>
              <h3>Post a Job</h3>
              <p>Hire the best talent. Free to post, reaches thousands of seekers.</p>
              <Link to="/jobs/post" className="btn btn--outline">
                <Plus size={18} aria-hidden="true" />
                Post a Job
              </Link>
            </div>
          </div>

          <div className="jobs-cta__categories">
            <h3>Popular Job Categories</h3>
            <div className="jobs-cta__category-grid" role="list" aria-label="Job categories">
              {[
                { name: 'Information Technology', icon: '💻', slug: 'information-technology' },
                { name: 'Sales & Marketing', icon: '📈', slug: 'sales-marketing' },
                { name: 'Accounting & Finance', icon: '💰', slug: 'accounting-finance' },
                { name: 'Healthcare', icon: '🏥', slug: 'healthcare' },
                { name: 'Education', icon: '📚', slug: 'education' },
                { name: 'Engineering', icon: '⚙️', slug: 'engineering' },
                { name: 'Driving & Logistics', icon: '🚚', slug: 'driving-logistics' },
                { name: 'Hospitality', icon: '🏨', slug: 'hospitality' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/jobs?category=${cat.slug}`}
                  className="jobs-cta__category-card"
                  role="listitem"
                >
                  <span className="jobs-cta__category-icon" aria-hidden="true">{cat.icon}</span>
                  <span className="jobs-cta__category-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function JobCardSkeleton() {
  return (
    <article className="job-card job-card--featured skeleton-card">
      <div className="job-card__header skeleton-row">
        <div className="skeleton skeleton--circle" style={{ width: '50px', height: '50px' }} />
        <div className="skeleton skeleton--text" style={{ width: '150px', height: '18px' }} />
      </div>
      <div className="skeleton skeleton--text skeleton--wide" style={{ marginTop: '16px' }} />
      <div className="skeleton-row" style={{ marginTop: '16px' }}>
        <div className="skeleton skeleton--text" style={{ width: '120px', height: '16px' }} />
        <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
        <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
      </div>
      <div className="job-card__footer skeleton-row" style={{ marginTop: '20px', justifyContent: 'space-between' }}>
        <div className="skeleton skeleton--text" style={{ width: '80px', height: '16px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="skeleton skeleton--circle" style={{ width: '40px', height: '40px' }} />
          <div className="skeleton" style={{ width: '100px', height: '40px', borderRadius: '8px' }} />
        </div>
      </div>
    </article>
  )
}

export { JobsCTA }