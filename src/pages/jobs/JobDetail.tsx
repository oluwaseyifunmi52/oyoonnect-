import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  MessageCircle,
  Phone,
  Share2,
  Heart,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Building2,
  Star,
  MessageSquare,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  ButtonLink,
  Badge,
} from '../../components/ui'
import { BackButton } from '../../components/ui/BackButton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Avatar } from '../../components/profile/Avatar'
import { JobDetailSkeleton } from '../../components/jobs/JobDetailSkeleton'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/jobService'
import { savedJobsService } from '../../services/jobService'
import { formatSalary, getEmploymentTypeLabel, getExperienceLevelLabel, getApplicationMethodLabel } from '../../types/jobs'
import type { Job } from '../../types/jobs'
import { useAuth } from '../../context/AuthContext'
import { AuthRequiredModal } from '../../components/common/AuthRequiredModal'

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

function getCompanyInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function statusVariant(status: Job['status']): 'success' | 'warning' | 'error' | 'neutral' {
  switch (status) {
    case 'active':
      return 'success'
    case 'closed':
    case 'expired':
      return 'error'
    case 'draft':
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'error'
    default:
      return 'neutral'
  }
}

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
      setFormData((prev) => ({
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: job?.description,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleContactClick = (method: Job['applicationMethod'], contact?: string) => {
    if (!job || !contact) return
    if (method === 'whatsapp') {
      const message = encodeURIComponent(`Hello, I'm interested in the ${job.title} position at ${job.employerName}.`)
      window.open(`https://wa.me/${contact.replace(/\D/g, '')}?text=${message}`, '_blank')
    } else if (method === 'email') {
      window.location.href = `mailto:${contact}?subject=${encodeURIComponent(`Application: ${job.title}`)}`
    } else if (method === 'phone') {
      window.location.href = `tel:${contact}`
    } else if (method === 'external') {
      window.open(contact, '_blank')
    }
  }

  if (loading) {
    return <JobDetailSkeleton />
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
            <p>
              Your application for <strong>{job.title}</strong> at <strong>{job.employerName}</strong> has been received.
            </p>
            <p className="success-note">The employer will review your application and contact you if shortlisted.</p>
            <div className="success-actions">
              <ButtonLink to="/jobs" variant="outline">
                Browse more jobs
              </ButtonLink>
              <ButtonLink to="/job-seeker" variant="primary">
                View my applications
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const salaryDisplay = job.salary ? formatSalary(job.salary) : 'Negotiable'
  const deadlineDisplay = job.applicationDeadline
    ? formatDate(job.applicationDeadline)
    : 'Not specified'

  const descriptionParagraphs = job.description
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <main className="page job-detail-page">
      <div className="container container--narrow">
        <BackButton fallback="/jobs" label="Back to Jobs" variant="ghost" size="sm" className="page-back-link" />

        <article className="job-detail-card">
          <Card variant="elevated">
            <CardBody>
              <header className="job-detail-card__header">
                <div className="job-detail-card__top">
                  <Avatar
                    src={job.employerLogo || undefined}
                    alt={job.employerName}
                    initials={getCompanyInitials(job.employerName)}
                    size="md"
                    variant={job.employerLogo ? 'image' : 'gradient'}
                  />
                  <div className="job-detail-card__title-wrap">
                    <h1 className="job-detail-card__title">{job.title}</h1>
                    <p className="job-detail-card__employer">{job.employerName}</p>
                  </div>
                  <div className="job-detail-card__badges">
                    {job.featured && (
                      <Badge variant="brand" size="sm">
                        <Star size={14} aria-hidden="true" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={statusVariant(job.status)} size="sm">
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="job-detail-card__meta">
                  <span className="job-detail-card__meta-item">
                    <MapPin size={16} aria-hidden="true" />
                    {job.location.town}, {job.location.lga}
                  </span>
                  <span className="job-detail-card__meta-item">
                    <Briefcase size={16} aria-hidden="true" />
                    {job.category}
                  </span>
                  <span className="job-detail-card__meta-item">
                    <Clock size={16} aria-hidden="true" />
                    {getEmploymentTypeLabel(job.employmentType)}
                  </span>
                  <span className="job-detail-card__meta-item">
                    <User size={16} aria-hidden="true" />
                    {getExperienceLevelLabel(job.experienceLevel)}
                  </span>
                  {job.salary && (
                    <span className="job-detail-card__meta-item">
                      <DollarSign size={16} aria-hidden="true" />
                      {salaryDisplay}
                    </span>
                  )}
                </div>

                <p className="job-detail-card__posted">
                  Posted {formatDate(job.createdAt)}
                  {' · '}
                  {job.views} views
                  {' · '}
                  {job.applicationCount} applications
                </p>

                <div className="job-detail-card__actions">
                  <Button
                    variant="primary"
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
                  <Button
                    type="button"
                    variant={isSaved ? 'secondary' : 'outline'}
                    onClick={handleSaveToggle}
                    aria-label={isSaved ? 'Remove from saved' : 'Save job'}
                  >
                    <Heart size={20} aria-hidden="true" />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleShare}
                    aria-label="Share this job"
                  >
                    <Share2 size={20} aria-hidden="true" />
                    Share
                  </Button>
                </div>
              </header>
            </CardBody>
          </Card>
        </article>

        <div className="job-detail-content">
          <section aria-labelledby="description-heading">
            <Card variant="default">
              <CardHeader>
                <h2 id="description-heading" className="job-detail__section-title">
                  Job Description
                </h2>
              </CardHeader>
              <CardBody>
                <div className="job-detail__description">
                  {descriptionParagraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>

          {job.responsibilities && (
            <section aria-labelledby="responsibilities-heading">
              <Card variant="default">
                <CardHeader>
                  <h2 id="responsibilities-heading" className="job-detail__section-title">
                    Key Responsibilities
                  </h2>
                </CardHeader>
                <CardBody>
                  <ul className="job-detail__list">
                    {job.responsibilities
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map((item, i) => (
                        <li key={i}>
                          <CheckCircle2 size={18} className="job-detail__list-icon" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                  </ul>
                </CardBody>
              </Card>
            </section>
          )}

          {job.requirements && (
            <section aria-labelledby="requirements-heading">
              <Card variant="default">
                <CardHeader>
                  <h2 id="requirements-heading" className="job-detail__section-title">
                    Requirements
                  </h2>
                </CardHeader>
                <CardBody>
                  <ul className="job-detail__list">
                    {job.requirements
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map((item, i) => (
                        <li key={i}>
                          <CheckCircle2 size={18} className="job-detail__list-icon" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                  </ul>
                </CardBody>
              </Card>
            </section>
          )}

          {job.skills.length > 0 && (
            <section aria-labelledby="skills-heading">
              <Card variant="default">
                <CardHeader>
                  <h2 id="skills-heading" className="job-detail__section-title">
                    Required Skills
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="job-detail__skills">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="neutral" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </section>
          )}

          <section aria-labelledby="details-heading">
            <Card variant="default">
              <CardHeader>
                <h2 id="details-heading" className="job-detail__section-title">
                  Job Details
                </h2>
              </CardHeader>
              <CardBody>
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
                    <dd>{salaryDisplay}</dd>
                  </div>
                  <div className="job-detail__detail-row">
                    <dt>Application Method</dt>
                    <dd>{getApplicationMethodLabel(job.applicationMethod)}</dd>
                  </div>
                  <div className="job-detail__detail-row">
                    <dt>
                      <Calendar size={16} aria-hidden="true" />
                      Application Deadline
                    </dt>
                    <dd>{deadlineDisplay}</dd>
                  </div>
                  <div className="job-detail__detail-row">
                    <dt>Location</dt>
                    <dd>
                      {job.location.address
                        ? `${job.location.address}, ${job.location.town}, ${job.location.lga}, ${job.location.state}`
                        : `${job.location.town}, ${job.location.lga}, ${job.location.state}`}
                    </dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          </section>

          {job.applicationMethod !== 'platform' && job.applicationContact && (
            <section aria-labelledby="contact-heading">
              <Card variant="default">
                <CardBody>
                  <p className="job-detail__apply-note">
                    This employer accepts applications via {getApplicationMethodLabel(job.applicationMethod)}.
                  </p>
                  <Button
                    variant="whatsapp"
                    onClick={() => handleContactClick(job.applicationMethod, job.applicationContact)}
                  >
                    {job.applicationMethod === 'whatsapp' && <MessageCircle size={18} aria-hidden="true" />}
                    {job.applicationMethod === 'email' && <MessageSquare size={18} aria-hidden="true" />}
                    {job.applicationMethod === 'phone' && <Phone size={18} aria-hidden="true" />}
                    {job.applicationMethod === 'external' && <ExternalLink size={18} aria-hidden="true" />}
                    Apply via {getApplicationMethodLabel(job.applicationMethod)}
                  </Button>
                </CardBody>
              </Card>
            </section>
          )}

          <section aria-labelledby="employer-heading">
            <Card variant="default">
              <CardHeader>
                <h2 id="employer-heading" className="job-detail__section-title">
                  About {job.employerName}
                </h2>
              </CardHeader>
              <CardBody>
                <div className="job-detail__company">
                  <Avatar
                    src={job.employerLogo || undefined}
                    alt={job.employerName}
                    initials={getCompanyInitials(job.employerName)}
                    size="lg"
                    variant={job.employerLogo ? 'image' : 'gradient'}
                  />
                  <div>
                    <h3 className="job-detail__company-name">{job.employerName}</h3>
                    <p className="job-detail__company-location">
                      <Building2 size={14} aria-hidden="true" />
                      {job.location.town}, {job.location.lga}, {job.location.state}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
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
                    <label htmlFor="apply-name">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      id="apply-name"
                      type="text"
                      className={`input ${formErrors.name ? 'input--error' : ''}`}
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    {formErrors.name && <span className="field__error">{formErrors.name}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="apply-phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      id="apply-phone"
                      type="tel"
                      className={`input ${formErrors.phone ? 'input--error' : ''}`}
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                    {formErrors.phone && <span className="field__error">{formErrors.phone}</span>}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="apply-email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="apply-email"
                    type="email"
                    className={`input ${formErrors.email ? 'input--error' : ''}`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  {formErrors.email && <span className="field__error">{formErrors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="apply-message">
                    Cover Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="apply-message"
                    className={`input textarea ${formErrors.message ? 'input--error' : ''}`}
                    rows={4}
                    placeholder="Briefly explain why you're a great fit for this role..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  {formErrors.message && <span className="field__error">{formErrors.message}</span>}
                </div>
                <div className="field">
                  <label htmlFor="apply-cv">CV/Resume (Optional)</label>
                  <input id="apply-cv" type="file" accept=".pdf,.doc,.docx" className="input" />
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

export default JobDetail
