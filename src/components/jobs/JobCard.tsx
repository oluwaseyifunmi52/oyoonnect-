import { MapPin, Briefcase, Clock, DollarSign, Heart, Share2, MessageCircle, Phone, ExternalLink, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatSalary, getEmploymentTypeLabel, getExperienceLevelLabel, getApplicationMethodLabel } from '../../types/jobs'
import type { Job } from '../../types/jobs'
import { savedJobsService } from '../../services/jobService'
import { useState, useEffect } from 'react'

interface JobCardProps {
  job: Job
  variant?: 'default' | 'compact' | 'featured'
  showEmployer?: boolean
  onSaveToggle?: (jobId: string, isSaved: boolean) => void
}

export function JobCard({ job, variant = 'default', showEmployer = true, onSaveToggle }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setIsSaved(savedJobsService.isSaved(job.id))
  }, [job.id])

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newSaved = savedJobsService.toggle(job.id)
    setIsSaved(newSaved)
    onSaveToggle?.(job.id, newSaved)
  }

  const salaryDisplay = job.salary ? formatSalary(job.salary) : 'Negotiable'

  if (variant === 'compact') {
    return (
      <Link to={`/jobs/${job.id}`} className="job-card job-card--compact">
        <div className="job-card__main">
          <h3 className="job-card__title">{job.title}</h3>
          {showEmployer && (
            <p className="job-card__employer">{job.employerName}</p>
          )}
        </div>
        <div className="job-card__meta">
          <span className="job-card__location">
            <MapPin size={14} aria-hidden="true" />
            {job.location.town}, {job.location.lga}
          </span>
          <span className="job-card__type">{getEmploymentTypeLabel(job.employmentType)}</span>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <article className="job-card job-card--featured">
        <div className="job-card__header">
          <div className="job-card__employer-info">
            {job.employerLogo && (
              <img src={job.employerLogo} alt={job.employerName} className="job-card__employer-logo" />
            )}
            <div>
              <p className="job-card__employer-name">{job.employerName}</p>
              <p className="job-card__posted">Posted {formatDate(job.createdAt)}</p>
            </div>
          </div>
          <span className={`job-card__badge job-card__badge--${job.employmentType}`}>
            {getEmploymentTypeLabel(job.employmentType)}
          </span>
        </div>
        <Link to={`/jobs/${job.id}`} className="job-card__title-link">
          <h2 className="job-card__title">{job.title}</h2>
        </Link>
        <div className="job-card__details">
          <span className="job-card__detail">
            <MapPin size={16} aria-hidden="true" />
            {job.location.town}, {job.location.lga}
          </span>
          <span className="job-card__detail">
            <Briefcase size={16} aria-hidden="true" />
            {job.category}
          </span>
          {job.salary && (
            <span className="job-card__detail job-card__detail--salary">
              <DollarSign size={16} aria-hidden="true" />
              {salaryDisplay}
            </span>
          )}
        </div>
        <div className="job-card__footer">
          <span className="job-card__experience">
            <Clock size={14} aria-hidden="true" />
            {getExperienceLevelLabel(job.experienceLevel)}
          </span>
          <div className="job-card__actions">
            <button
              type="button"
              className={`job-card__save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveToggle}
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Heart size={18} aria-hidden="true" />
            </button>
            <Link to={`/jobs/${job.id}`} className="btn btn--primary btn--sm">
              View Details
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="job-card">
      <header className="job-card__header">
        <div className="job-card__employer-row">
          {job.employerLogo && (
            <img src={job.employerLogo} alt={job.employerName} className="job-card__employer-logo-sm" />
          )}
          <div className="job-card__employer-info">
            {showEmployer && (
              <p className="job-card__employer-name">{job.employerName}</p>
            )}
            <p className="job-card__posted-date">Posted {formatDate(job.createdAt)}</p>
          </div>
        </div>
        {job.featured && (
          <span className="job-card__featured-badge">
            <Star size={12} aria-hidden="true" />
            Featured
          </span>
        )}
      </header>

      <Link to={`/jobs/${job.id}`} className="job-card__title-link">
        <h2 className="job-card__title">{job.title}</h2>
      </Link>

      <div className="job-card__meta">
        <span className="job-card__meta-item">
          <MapPin size={14} aria-hidden="true" />
          {job.location.town}, {job.location.lga}
        </span>
        <span className="job-card__meta-item">
          <Briefcase size={14} aria-hidden="true" />
          {job.category}
        </span>
        <span className="job-card__meta-item">
          <Clock size={14} aria-hidden="true" />
          {getEmploymentTypeLabel(job.employmentType)}
        </span>
        {job.salary && (
          <span className="job-card__meta-item job-card__meta-item--salary">
            <DollarSign size={14} aria-hidden="true" />
            {salaryDisplay}
          </span>
        )}
      </div>

      <div className="job-card__skills">
        {job.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="job-card__skill-tag">{skill}</span>
        ))}
        {job.skills.length > 4 && (
          <span className="job-card__skill-tag more">+{job.skills.length - 4} more</span>
        )}
      </div>

      <footer className="job-card__footer">
        <div className="job-card__stats">
          <span className="job-card__stat">
            <Heart size={14} aria-hidden="true" />
            {job.views} views
          </span>
          <span className="job-card__stat">
            <MessageCircle size={14} aria-hidden="true" />
            {job.applicationCount} applications
          </span>
        </div>
        <div className="job-card__actions">
          <button
            type="button"
            className={`job-card__save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveToggle}
            aria-label={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Heart size={18} aria-hidden="true" />
          </button>
          <Link to={`/jobs/${job.id}`} className="btn btn--outline btn--sm">
            View Details
          </Link>
        </div>
      </footer>
    </article>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })
}