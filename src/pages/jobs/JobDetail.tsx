import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, MessageCircle, Phone, Share2, Heart, CheckCircle2, AlertCircle, Calendar, User, Building2, Star, ExternalLink, MessageSquare, Loader2, X } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Rating } from '../../components/ui/Rating'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/jobService'
import { savedJobsService } from '../../services/jobService'
import { formatSalary, getEmploymentTypeLabel, getExperienceLevelLabel, getApplicationMethodLabel } from '../../types/jobs'
import type { Job, JobApplication } from '../../types/jobs'
import { useAuth } from '../../context/AuthContext'
import { AuthRequiredModal } from '../../components/common/AuthRequiredModal'

function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const [job, setJob] = useState<Job | undefined>()
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'apply' | 'save' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    cvFile: null as File | null,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [applyingSuccess, setApplyingSuccess] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (id) {
      const loadJob = async () => {
        try {
          const jobData = await jobService.getById(id)
          setJob(jobData)
          if (jobData && isAuthenticated) {
            setIsSaved(savedJobsService.isSaved(jobData.id))
          }
        } catch {
          setJob(undefined)
        } finally {
          setLoading(false)
        }
      }
      loadJob()
    }
  }, [id, isAuthenticated])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }))
    }
  }, [user])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Full name is required'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    else if (!/^(\+234|0)[789][01]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid Nigerian phone number'
    }
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email'
    if (!formData.message.trim()) errors.message = 'Please add a brief message'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !job || !user) return

    setApplying(true)
    try {
      await applicationService.add({
        jobId: job.id,
        applicantId: user.id,
        applicantName: formData.name.trim(),
        applicantPhone: formData.phone.replace(/\s/g, ''),
        applicantEmail: formData.email.trim(),
        applicantMessage: formData.message.trim(),
        cvUrl: undefined,
      })
      setApplyingSuccess(true)
      setShowApplyForm(false)
    } catch (err) {
      console.error('Failed to apply:', err)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      setPendingAction('save')
      setShowAuthModal(true)
      return
    }
    if (!job) return
    const newSaved = savedJobsService.toggle(job.id)
    setIsSaved(newSaved)
  }

  const handleContactClick = (method: Job['applicationMethod'], contact?: string) => {
    if (method === 'whatsapp' && contact) {
      const message = encodeURIComponent(`Hello, I'm interested in the ${job?.title} position at ${job?.employerName}.`)
      window.open(`https://wa.me/${contact.replace(/\D/g, '')}?text=${message}`, '_blank')
    } else if (method === 'email' && contact) {
      window.location.href = `mailto:${contact}?subject=${encodeURIComponent(`Application: ${job?.title}`)}`
    } else if (method === 'phone' && contact) {
      window.location.href = `tel:${contact}`
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', marginBottom: '16px' }} />
            <div className="skeleton skeleton--text" style={{ width: '60%', marginBottom: '24px' }} />
            <div className="skeleton-row" style={{ marginBottom: '24px' }}>
              <div className="skeleton skeleton--text" style={{ width: '120px', height: '16px' }} />
              <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
              <div className="skeleton skeleton--text" style={{ width: '100px', height: '16px' }} />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="page container">
        <EmptyState
          icon={<AlertCircle size={36} />}
          title="Job not found"
          description="This job posting may have been removed or the link is incorrect."
          action={
            <ButtonLink to="/jobs" variant="primary">
              Browse all jobs
            </ButtonLink>
          }
        />
      </main>
    )
  }

  if (applyingSuccess) {
    return (
      <main className="page">
        <div className="container">
          <div className="application-success">
            <div className="success-icon">
              <CheckCircle2 size={64} />
            </div>
            <h1>Application Submitted!</h1>
            <p>Your application for <strong>{job.title}</strong> at <strong>{job.employerName}</strong> has been received.</p>
            <p className="success-note">The employer will review your application and contact you if shortlisted.</p>
            <div className="success-actions">
              <ButtonLink to="/jobs" variant="outline">
                Browse more jobs
              </ButtonLink>
              <ButtonLink to="/job-seeker/applications" variant="primary">
                View my applications
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const salaryDisplay = job.salary ? formatSalary(job.salary) : 'Negotiable'
  const deadlineDisplay = job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Not specified'

  return (
    <main className="page job-detail-page">
      <div className="container">
        <Link to="/jobs" className="back-link">
          <ArrowLeft size={16} /> Back to jobs
        </Link>

        <header className="job-detail__header">
          <div className="job-detail__header-main">
            <div className="job-detail__employer">
              {job.employerLogo && (
                <img src={job.employerLogo} alt={job.employerName} className="job-detail__employer-logo" />
              )}
              <div>
                <p className="job-detail__employer-name">{job.employerName}</p>
                <p className="job-detail__posted">
                  Posted {formatDate(job.createdAt)} · {job.views} views · {job.applicationCount} applications
                </p>
              </div>
            </div>
            <div className="job-detail__badges">
              {job.featured && (
                <span className="badge badge--featured">
                  <Star size={14} aria-hidden="true" />
                  Featured
                </span>
              )}
              <span className={`badge badge--${job.employmentType}`}>
                {getEmploymentTypeLabel(job.employmentType)}
              </span>
              <span className={`badge badge--status badge--${job.status}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
          </div>

          <h1 className="job-detail__title">{job.title}</h1>

          <div className="job-detail__meta">
            <span className="job-detail__meta-item">
              <MapPin size={16} aria-hidden="true" />
              {job.location.town}, {job.location.lga}, {job.location.state}
            </span>
            <span className="job-detail__meta-item">
              <Briefcase size={16} aria-hidden="true" />
              {job.category}
            </span>
            <span className="job-detail__meta-item">
              <Clock size={16} aria-hidden="true" />
              {getEmploymentTypeLabel(job.employmentType)}
            </span>
            <span className="job-detail__meta-item">
              <User size={16} aria-hidden="true" />
              {getExperienceLevelLabel(job.experienceLevel)}
            </span>
            {job.salary && (
              <span className="job-detail__meta-item job-detail__meta-item--salary">
                <DollarSign size={16} aria-hidden="true" />
                {salaryDisplay}
              </span>
            )}
          </div>

          <div className="job-detail__actions">
            <button
              type="button"
              className={`job-detail__save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveToggle}
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Heart size={20} aria-hidden="true" />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              type="button"
              className="job-detail__share-btn"
              onClick={() => navigator.share?.({ title: job.title, text: job.description, url: window.location.href })}
            >
              <Share2 size={20} aria-hidden="true" />
              Share
            </button>
            <Button
              className="job-detail__apply-btn"
              onClick={() => {
                if (!isAuthenticated) {
                  setPendingAction('apply')
                  setShowAuthModal(true)
                  return
                }
                setShowApplyForm(true)
              }}
              disabled={job.status !== 'active'}
            >
              <MessageSquare size={18} aria-hidden="true" />
              {job.status === 'active' ? 'Apply Now' : 'Applications Closed'}
            </Button>
          </div>
        </header>

        <div className="job-detail__content">
          <section className="job-detail__section" aria-labelledby="description-heading">
            <h2 id="description-heading" className="job-detail__section-title">Job Description</h2>
            <div className="job-detail__description">
              {job.description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {job.responsibilities && (
            <section className="job-detail__section" aria-labelledby="responsibilities-heading">
              <h2 id="responsibilities-heading" className="job-detail__section-title">Key Responsibilities</h2>
              <ul className="job-detail__list">
                {job.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                  <li key={i}>
                    <CheckCircle2 size={18} className="job-detail__list-icon" aria-hidden="true" />
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && (
            <section className="job-detail__section" aria-labelledby="requirements-heading">
              <h2 id="requirements-heading" className="job-detail__section-title">Requirements</h2>
              <ul className="job-detail__list">
                {job.requirements.split('\n').filter(Boolean).map((item, i) => (
                  <li key={i}>
                    <CheckCircle2 size={18} className="job-detail__list-icon" aria-hidden="true" />
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills.length > 0 && (
            <section className="job-detail__section" aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="job-detail__section-title">Required Skills</h2>
              <div className="job-detail__skills">
                {job.skills.map((skill) => (
                  <span key={skill} className="job-detail__skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}

          <section className="job-detail__section" aria-labelledby="details-heading">
            <h2 id="details-heading" className="job-detail__section-title">Job Details</h2>
            <dl className="job-detail__details">
              <div className="job-detail__detail-row">
                <dt>Employment Type</dt>
                <dd>{getEmploymentTypeLabel(job.employmentType)}</dd>
              </div>
              <div className="job-detail__detail-row">
                <dt>Experience Level</dt>
                <dd>{getExperienceLevelLabel(job.experienceLevel)}</dd>
              </div>
              <div className="job-detail__detail-row">
                <dt>Salary</dt>
                <dd>{salaryDisplay}{job.salary?.negotiable ? ' (Negotiable)' : ''}</dd>
              </div>
              <div className="job-detail__detail-row">
                <dt>Application Method</dt>
                <dd>{getApplicationMethodLabel(job.applicationMethod)}</dd>
              </div>
              <div className="job-detail__detail-row">
                <dt>Application Deadline</dt>
                <dd>{deadlineDisplay}</dd>
              </div>
              <div className="job-detail__detail-row">
                <dt>Location</dt>
                <dd>{job.location.address}, {job.location.town}, {job.location.lga}, {job.location.state}</dd>
              </div>
            </dl>
          </section>

          {job.applicationMethod !== 'platform' && job.applicationContact && (
            <section className="job-detail__section job-detail__section--apply" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="job-detail__section-title">Apply Directly</h2>
              <p className="job-detail__apply-note">This employer accepts applications via {getApplicationMethodLabel(job.applicationMethod)}.</p>
              <Button
                className="job-detail__direct-apply-btn"
                onClick={() => handleContactClick(job.applicationMethod, job.applicationContact)}
              >
                {job.applicationMethod === 'whatsapp' && (
                  <MessageCircle size={18} aria-hidden="true" />
                )}
                {job.applicationMethod === 'email' && (
                  <MessageSquare size={18} aria-hidden="true" />
                )}
                {job.applicationMethod === 'phone' && (
                  <Phone size={18} aria-hidden="true" />
                )}
                Apply via {getApplicationMethodLabel(job.applicationMethod)}
              </Button>
            </section>
          )}

          <section className="job-detail__section" aria-labelledby="employer-heading">
            <h2 id="employer-heading" className="job-detail__section-title">About {job.employerName}</h2>
            <div className="job-detail__employer-info">
              {job.employerLogo && (
                <img src={job.employerLogo} alt={job.employerName} className="job-detail__employer-logo-lg" />
              )}
              <div>
                <h3>{job.employerName}</h3>
                <p>{job.description.split('\n')[0]}...</p>
                <div className="job-detail__employer-meta">
                  <span>
                    <Building2 size={14} aria-hidden="true" />
                    {job.location.town}, {job.location.lga}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          actionLabel={pendingAction === 'save' ? 'save this job' : 'apply for this job'}
        />

        {showApplyForm && (
          <div className="job-apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
            <div className="job-apply-modal__overlay" onClick={() => setShowApplyForm(false)} />
            <div className="job-apply-modal__content">
              <header className="job-apply-modal__header">
                <h2 id="apply-modal-title">Apply for {job.title}</h2>
                <button
                  type="button"
                  className="job-apply-modal__close"
                  onClick={() => setShowApplyForm(false)}
                  aria-label="Close application form"
                >
                  <X size={24} />
                </button>
              </header>
              <form onSubmit={handleSubmit} className="job-apply-form" noValidate>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="apply-name">Full Name <span className="required">*</span></label>
                    <input
                      id="apply-name"
                      type="text"
                      className={`input ${formErrors.name ? 'input--error' : ''}`}
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    {formErrors.name && <span className="field__error">{formErrors.name}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="apply-phone">Phone Number <span className="required">*</span></label>
                    <input
                      id="apply-phone"
                      type="tel"
                      className={`input ${formErrors.phone ? 'input--error' : ''}`}
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                    {formErrors.phone && <span className="field__error">{formErrors.phone}</span>}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="apply-email">Email Address <span className="required">*</span></label>
                  <input
                    id="apply-email"
                    type="email"
                    className={`input ${formErrors.email ? 'input--error' : ''}`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  {formErrors.email && <span className="field__error">{formErrors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="apply-message">Cover Message <span className="required">*</span></label>
                  <textarea
                    id="apply-message"
                    className={`input textarea ${formErrors.message ? 'input--error' : ''}`}
                    rows={4}
                    placeholder="Briefly explain why you're a great fit for this role..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  {formErrors.message && <span className="field__error">{formErrors.message}</span>}
                </div>
                <div className="field">
                  <label htmlFor="apply-cv">CV/Resume (Optional)</label>
                  <input
                    id="apply-cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="input"
                  />
                  <span className="field__hint">PDF, DOC, or DOCX format. Max 5MB.</span>
                </div>
                <div className="job-apply-form__actions">
                  <Button type="button" variant="ghost" onClick={() => setShowApplyForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={applying}>
                    {applying ? (
                      <>
                        <Loader2 size={18} className="spinning" aria-hidden="true" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default JobDetail