import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { JobForm } from '../../components/jobs/JobForm'
import { jobService } from '../../services/jobService'
import { notificationService } from '../../services/notificationService'
import type { JobFormData } from '../../types/jobs'
import { useAuth } from '../../context/AuthContext'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'

export function PostJob() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isBusinessOwner } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isBusinessOwner) {
      navigate('/login?redirect=/jobs/post')
    }
  }, [isAuthenticated, isBusinessOwner, navigate])

  const handleSubmit = async (formData: JobFormData) => {
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

      // Create notification for the employer
      notificationService.addNotification({
        category: 'job',
        title: 'Job Posted Successfully',
        message: `Your job posting "${formData.title}" has been submitted for review and will be published within 1-2 business days.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: '/business-office/jobs',
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Failed to post job:', err)
      setError('Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="page job-post-page">
        <div className="container container--narrow">
          <div className="job-post-success">
            <div className="success-icon">
              <CheckCircle2 size={64} />
            </div>
            <h1>Job Posted Successfully!</h1>
            <p>Your job posting has been submitted for review.</p>
            <p>Our team will review it and publish within 1-2 business days.</p>
            <div className="success-actions">
              <ButtonLink to="/jobs" variant="outline">
                Browse Jobs
              </ButtonLink>
              <ButtonLink to="/business-office/jobs" variant="primary">
                View My Jobs
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !isBusinessOwner) {
    return (
      <main className="page job-post-page">
        <div className="container container--narrow">
          <EmptyState
            icon={<AlertCircle size={48} />}
            title="Business Account Required"
            description="Only verified business owners can post jobs. Please sign in with your business account or create one."
            action={
              <ButtonLink to="/login?redirect=/jobs/post" variant="primary">
                Sign In / Create Business Account
              </ButtonLink>
            }
          />
        </div>
      </main>
    )
  }

  return (
    <main className="page job-post-page">
      <div className="container container--narrow">
        <Link to="/business-office/jobs" className="back-link">
          <ArrowLeft size={20} />
        </Link>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={20} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <SectionHeading
          eyebrow="Hire Talent"
          title="Post a Job"
          subtitle="Find the right candidate for your team. Free to post, reaches thousands of job seekers across Oyo State."
        />

        <JobForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/business-office/jobs')}
          isEditing={false}
        />
      </div>
    </main>
  )
}

export default PostJob