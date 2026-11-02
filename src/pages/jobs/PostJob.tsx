import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle, Lightbulb, FileText } from 'lucide-react'
import { JobForm } from '../../components/jobs/JobForm'
import { jobService } from '../../services/jobService'
import { notificationService } from '../../services/notificationService'
import type { JobFormData } from '../../types/jobs'
import { useAuth } from '../../context/AuthContext'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import '../../pages/FormPages.css'

export function PostJob() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (formData: JobFormData) => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const jobData = {
        ...formData,
        employerId: user.id,
        employerName: user.name || 'Unknown Employer',
        employerLogo: user.avatar,
        status: 'pending' as const,
        postedBy: user.name || 'Business Owner',
      }

      await jobService.create(jobData)

      notificationService.addNotification({
        category: 'job',
        title: 'Job Posted Successfully',
        message: `Your job posting "${formData.title}" has been submitted for review and will be published within 1-2 business days.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: '/business/dashboard',
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Failed to post job:', err)
      setError('Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user])

  if (submitted) {
    return (
      <main className="form-page">
        <div className="form-page__container">
          <div className="form-success">
            <div className="form-success__icon">
              <CheckCircle2 size={64} aria-hidden="true" />
            </div>
            <h1 className="form-success__title">Job Posted Successfully!</h1>
            <p className="form-success__description">
              Your job posting has been submitted for review.
            </p>
            <p className="form-success__description">
              Our team will review it and publish within 1-2 business days.
            </p>
            <div className="form-success__actions">
              <ButtonLink to="/jobs" variant="outline" size="lg">
                Browse Jobs
              </ButtonLink>
              <ButtonLink to="/business/dashboard" variant="primary" size="lg">
                View My Jobs
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="form-page">
        <div className="form-page__container">
          <EmptyState
            icon={<AlertCircle size={48} aria-hidden="true" />}
            title="Business Account Required"
            description="Only verified business owners can post jobs. Please sign in with your business account or create one."
            action={
              <ButtonLink to="/login?redirect=/jobs/post" variant="primary" size="lg">
                Sign In / Create Business Account
              </ButtonLink>
            }
          />
        </div>
      </main>
    )
  }

  return (
    <main className="form-page">
      <div className="form-page__header">
        <SectionHeading
          eyebrow="Hire Talent"
          title="Post a Job"
          subtitle="Find the right candidate for your team. Free to post, reaches thousands of job seekers across Oyo State."
          align="left"
        />
      </div>

      <div className="form-page__grid">
        <div className="form-page__main">
          <Card variant="default" padding="lg" className="form-section-card">
            <CardBody>
              <JobForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/business/dashboard')}
                isEditing={false}
              />
            </CardBody>
          </Card>

          {error && (
            <Card variant="default" padding="md" className="form-error-card">
              <CardBody>
                <div className="form-error-banner" role="alert">
                  <AlertCircle size={20} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <aside className="form-page__aside" aria-label="Job posting tips">
          <Card variant="default" padding="lg" className="form-tips-card">
            <CardBody>
              <div className="form-tips-header">
                <Lightbulb size={20} aria-hidden="true" />
                <h3>Tips for a Great Job Post</h3>
              </div>
              <ul className="form-tips-list">
                <li>
                  <strong>Clear, specific title</strong> — Include the role and level (e.g., "Senior Frontend Developer" not just "Developer")
                </li>
                <li>
                  <strong>Describe the impact</strong> — Explain what the person will achieve, not just tasks
                </li>
                <li>
                  <strong>Be transparent about salary</strong> — Listings with salary ranges get 3x more applications
                </li>
                <li>
                  <strong>List must-haves vs nice-to-haves</strong> — Separate required skills from preferred ones
                </li>
                <li>
                  <strong>Include location details</strong> — Specify LGA, town, and whether remote/hybrid is offered
                </li>
                <li>
                  <strong>Set a realistic deadline</strong> — Give candidates at least 2 weeks to apply
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="default" padding="lg" className="form-preview-card">
            <CardBody>
              <div className="form-preview-header">
                <FileText size={20} aria-hidden="true" />
                <h3>Quick Summary</h3>
              </div>
              <p className="form-preview-text">
                Your job post will appear on the Jobs page and in search results across Oyo State. After submission, it enters a 1-2 day review before going live.
              </p>
              <div className="form-preview-stats">
                <div className="form-preview-stat">
                  <span className="form-preview-stat-value">Free</span>
                  <span className="form-preview-stat-label">to post</span>
                </div>
                <div className="form-preview-stat">
                  <span className="form-preview-stat-value">1-2</span>
                  <span className="form-preview-stat-label">days review</span>
                </div>
                <div className="form-preview-stat">
                  <span className="form-preview-stat-value">33</span>
                  <span className="form-preview-stat-label">LGAs reached</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>
      </div>
    </main>
  )
}

export default PostJob