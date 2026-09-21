import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/jobService'
import { interviewService } from '../../services/jobService'
import { notificationService } from '../../services/notificationService'
import { formatSalary, getEmploymentTypeLabel, getExperienceLevelLabel, getApplicationMethodLabel } from '../../types/jobs'
import type { Job, JobApplication, Interview } from '../../types/jobs'
import { Button, ButtonLink, Card, CardHeader, CardBody, CardFooter, Select, Input, Badge, EmptyState } from '../../components/ui'
import { useToast } from '../../components/ui/Toast/Toast'
import { Calendar, Clock, MessageCircle, Phone, MapPin, Video, X, AlertCircle, CheckCircle2, Info, ArrowLeft } from 'lucide-react'
import type { InterviewType } from '../../types/notifications'
import { SectionHeading } from '../../components/ui/SectionHeading'

function InterviewSchedule() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isBusinessOwner } = useAuth()
  const { id: jobId } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    type: 'VIDEO' as InterviewType,
    title: '',
    scheduledStart: '',
    scheduledEnd: '',
    timezone: 'WAT',
    meetingUrl: '',
    location: '',
    notes: '',
  })

  const [showForm, setShowForm] = useState(false)

  // Load job and application data
  const [job, setJob] = useState<Job | undefined>()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)

  useEffect(() => {
    if (!jobId) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const jobData = await jobService.getById(jobId)
        setJob(jobData)

        if (jobData && isAuthenticated) {
          setApplications(await applicationService.getByApplicant(user!.id))
        }
      } catch (err) {
        setError('Failed to load job data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [jobId, isAuthenticated, user])

  // Load applications for this job from the job's employer
  useEffect(() => {
    if (!jobId || !isAuthenticated) return

    const loadApplications = async () => {
      try {
        const employerJobs = await jobService.getByEmployer(user!.id)
        const jobEmployer = employerJobs.find((j) => j.id === jobId)
        if (jobEmployer) {
          // Get all applications for this job
          const allApps = await applicationService.getByApplicant(user!.id)
          // Filter to only show applications for this specific job
          const jobApps = allApps.filter((a) => a.jobId === jobId)
          setApplications(jobApps)
        }
      } catch (err) {
        console.error('Failed to load applications:', err)
      }
    }

    loadApplications()
  }, [jobId, isAuthenticated, user])

  // Load selected application when changed
  useEffect(() => {
    if (selectedApplication?.id) {
      const loadInterview = async () => {
        const existing = await interviewService.getByApplication(jobId!, selectedApplication.id)
        if (existing.length > 0) {
          setFormData({
            type: existing[0].type,
            title: existing[0].title,
            scheduledStart: existing[0].scheduledStart,
            scheduledEnd: existing[0].scheduledEnd,
            timezone: existing[0].timezone,
            meetingUrl: existing[0].meetingUrl || '',
            location: existing[0].location || '',
            notes: existing[0].notes || '',
          })
        }
      }
      loadInterview()
    }
  }, [selectedApplication, jobId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !jobId || !selectedApplication || !job) return

    setError('')

    try {
      // Check for existing interview
      const existing = await interviewService.getByApplication(jobId, selectedApplication.id)
      if (existing.length > 0) {
        // Update existing interview
        await interviewService.updateInterview(existing[0].id, {
          type: formData.type,
          title: formData.title,
          scheduledStart: formData.scheduledStart,
          scheduledEnd: formData.scheduledEnd,
          timezone: formData.timezone,
          meetingUrl: formData.meetingUrl,
          location: formData.location,
          notes: formData.notes,
        })
        setSuccess(true)
      } else {
        // Schedule new interview
        await interviewService.scheduleInterview({
          type: formData.type,
          title: formData.title,
          scheduledStart: formData.scheduledStart,
          scheduledEnd: formData.scheduledEnd,
          timezone: formData.timezone,
          meetingUrl: formData.meetingUrl,
          location: formData.location,
          notes: formData.notes,
          jobId,
          applicationId: selectedApplication.id,
          candidateId: selectedApplication.applicantId,
          employerId: job.employerId,
          status: 'SCHEDULED' as const,
        })
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule interview')
      console.error('Failed to schedule interview:', err)
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', margin: '0 auto 16px' }} />
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
          action={<ButtonLink to="/jobs" variant="primary">Browse all jobs</ButtonLink>}
        />
      </main>
    )
  }

  // Check authorization: user must be the employer of this job
  const isAuthorized = !!job && job.employerId === user?.id
  if (!isAuthenticated || !isBusinessOwner || !isAuthorized) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState
            icon={<AlertCircle size={48} />}
            title="Access Denied"
            description="Only the job posting employer can schedule interviews."
            action={<ButtonLink to="/jobs" variant="primary">Browse Jobs</ButtonLink>}
          />
        </div>
      </main>
    )
  }

  const selectedAppId = selectedApplication?.id

  if (!selectedApplication) {
    return (
      <main className="page job-post-page">
        <div className="container container--narrow">
          <SectionHeading
            eyebrow="Schedule Interview"
            title="Select Applicant"
            subtitle="Choose a candidate to schedule an interview for."
          />

          <Card>
            <CardHeader>
              <h3 className="card__header-title">Applicants for this job</h3>
            </CardHeader>
            <CardBody>
              {applications.length === 0 ? (
                <p className="empty-state-text">No applications yet.</p>
              ) : (
                <div className="applications-list">
                  {applications.map((app: JobApplication) => (
                    <div
                      key={app.id}
                      className={`application-item ${selectedAppId === app.id ? 'selected' : ''}`}
                      onClick={() => setSelectedApplication(app)}
                      role="button"
                      tabIndex={0}
                      aria-selected={selectedAppId === app.id}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedApplication(app)}
                    >
                      <span className="application-item__name">{app.applicantName}</span>
                      <span className="application-item__status">{getApplicationStatusLabel(app.status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </main>
    )
  }

  // Check if interview already exists
  // TODO: Fix await outside async - needs refactoring to useEffect
  const existingInterview: unknown[] = []

  return (
    <main className="page job-post-page">
      <div className="container container--narrow">
        <Link to={`/jobs/${jobId}`} className="back-link">
          <ArrowLeft size={20} /> Back to job
        </Link>

        <SectionHeading
          eyebrow="Schedule Interview"
          title={`Schedule Interview for ${selectedApplication.applicantName}`}
          subtitle={`Interview for ${job.title} at ${job.employerName}`}
        />

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={20} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-banner" role="alert">
            <CheckCircle2 size={24} />
            <span>Interview scheduled successfully!</span>
          </div>
        )}

        {existingInterview.length > 0 && (
          <div className="info-banner" role="alert">
            <Info size={20} />
            <span>An interview is already scheduled for this application. You can update the details below.</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <h3 className="card__header-title">Interview Details</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="interview-form" noValidate>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="interview-type">Interview Type <span className="required">*</span></label>
                  <Select
                    id="interview-type"
                    value={formData.type}
                    onChange={(v) => setFormData({ ...formData, type: v as InterviewType })}
                    placeholder="Interview type"
                    options={[
                      { value: 'VIDEO', label: 'Video' },
                      { value: 'PHONE', label: 'Phone' },
                      { value: 'IN_PERSON', label: 'In-person' },
                    ]}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="interview-title">Interview Title <span className="required">*</span></label>
                  <Input
                    id="interview-title"
                    placeholder="e.g. Technical Interview"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="interview-start">Start Date & Time <span className="required">*</span></label>
                  <Input
                    id="interview-start"
                    type="datetime-local"
                    value={formData.scheduledStart}
                    onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="interview-end">End Date & Time <span className="required">*</span></label>
                  <Input
                    id="interview-end"
                    type="datetime-local"
                    value={formData.scheduledEnd}
                    onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="interview-timezone">Timezone <span className="required">*</span></label>
                  <Select
                    id="interview-timezone"
                    value={formData.timezone}
                    onChange={(v) => setFormData({ ...formData, timezone: v })}
                    placeholder="Timezone"
                    options={[
                      { value: 'WAT', label: 'West Africa Time (WAT)' },
                      { value: 'LOS', label: 'London Standard Time (LOS)' },
                      { value: 'NYC', label: 'New York City (NYC)' },
                      { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
                    ]}
                  />
                </div>
                <div className="field">
                  <label htmlFor="interview-duration">Duration</label>
                  <Input
                    id="interview-duration"
                    type="number"
                    placeholder="e.g. 60 (minutes)"
                    value={formData.scheduledEnd ? '60' : ''}
                    onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    />
                </div>
              </div>

              {formData.type === 'VIDEO' ? (
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="meeting-url">Meeting URL <span className="required">*</span></label>
                    <Input
                      id="meeting-url"
                      placeholder="https://meet.example.com or zoom.us/j/123"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : formData.type === 'IN_PERSON' ? (
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="interview-location">Location <span className="required">*</span></label>
                    <Input
                      id="interview-location"
                      placeholder="e.g. Conference Room A, Oyo State Secretariat"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              <div className="form-row">
                <div className="field">
                  <label htmlFor="interview-notes">Notes (Optional)</label>
                  <Input
                    id="interview-notes"
                    placeholder="Additional instructions for the candidate"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <CardFooter>
                <Button type="submit" disabled={!formData.type || !formData.title || !formData.scheduledStart || !formData.scheduledEnd || !formData.timezone}>
                  {existingInterview.length > 0 ? 'Update Interview' : 'Schedule Interview'}
                </Button>
                <ButtonLink
                  type="button"
                  variant="outline"
                  to={`/jobs/${jobId}`}
                  size="sm"
                  className="ghost"
                >
                  Cancel
                </ButtonLink>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}

function getApplicationStatusLabel(status: JobApplication['status']): string {
  const labels: Record<JobApplication['status'], string> = {
    submitted: 'Submitted',
    reviewing: 'Under Review',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    accepted: 'Accepted',
  }
  return labels[status] || status
}

export default InterviewSchedule