import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, CheckCircle2, XCircle, User, FileText, Plus, Settings, ArrowRight, Video, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { jobService, applicationService, profileService, savedJobsService, interviewService } from '../../services/jobService'
import { formatSalary, getEmploymentTypeLabel } from '../../types/jobs'
import { formatDate } from '../../utils/date'
import type { Job, JobApplication, JobSeekerProfile } from '../../types/jobs'
import { DashboardHeader, StatCard, DashboardSkeleton } from '../../components/dashboard'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { LucideIcon } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'saved', label: 'Saved Jobs', icon: Heart },
  { id: 'profile', label: 'My Profile', icon: Settings },
]

export default function JobSeekerDashboard() {
  const { user, isAuthenticated, initializing } = useAuth()
  
  // Get initial tab from URL hash, default to 'overview'
  const getInitialTab = (): 'overview' | 'applications' | 'saved' | 'profile' => {
    const hash = window.location.hash.slice(1)
    const validTabs = ['overview', 'applications', 'saved', 'profile']
    return validTabs.includes(hash) ? hash as 'overview' | 'applications' | 'saved' | 'profile' : 'overview'
  }
  
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved' | 'profile'>(getInitialTab)

  // Sync URL hash with activeTab
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && hash !== activeTab) {
      setActiveTab(hash as 'overview' | 'applications' | 'saved' | 'profile')
    }
  }, [])

  const handleTabChange = (tab: 'overview' | 'applications' | 'saved' | 'profile') => {
    setActiveTab(tab)
    window.location.hash = tab
  }
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [profile, setProfile] = useState<JobSeekerProfile | undefined>()
  const [applicationsWithInterviews, setApplicationsWithInterviews] = useState<Set<string>>(new Set())

  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    savedJobs: 0,
  })

  useEffect(() => {
    if (!isAuthenticated) return

    const loadData = async () => {
      try {
        const [apps, saved, prof] = await Promise.all([
          applicationService.getByApplicant(user!.id),
          savedJobsService.getSavedJobDetails(),
          profileService.getProfile(user!.id),
        ])
        setApplications(apps)
        setSavedJobs(saved)
        setProfile(prof)

        const interviewChecks = await Promise.all(
          apps.map(a => interviewService.getByApplication(a.jobId, a.id))
        )
        const appsWithInterviews = new Set(
          interviewChecks.map((interviews, idx) => interviews.length > 0 ? apps[idx].id : null).filter(Boolean) as string[]
        )
        setApplicationsWithInterviews(appsWithInterviews)

        setStats({
          totalApplications: apps.length,
          pending: apps.filter(a => a.status === 'submitted' || a.status === 'reviewing').length,
          shortlisted: apps.filter(a => a.status === 'shortlisted').length,
          accepted: apps.filter(a => a.status === 'accepted').length,
          rejected: apps.filter(a => a.status === 'rejected').length,
          savedJobs: saved.length,
        })
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [isAuthenticated, user])

  const recentApplications = useMemo(() =>
    applications.slice(0, 5).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()),
    [applications]
  )

  // Create a job lookup map for quick access
  const jobMap = useMemo(() => {
    const map = new Map<string, Job>()
    savedJobs.forEach(job => map.set(job.id, job))
    return map
  }, [savedJobs])

  // Fetch job details for applications (for applications tab)
  const [applicationJobs, setApplicationJobs] = useState<Map<string, Job>>(new Map())
  useEffect(() => {
    if (applications.length > 0) {
      const fetchJobs = async () => {
        const jobIds = [...new Set(applications.map(a => a.jobId))]
        const jobs = await Promise.all(jobIds.map(id => jobService.getById(id)))
        const map = new Map<string, Job>()
        jobs.filter((j): j is Job => j !== undefined).forEach(j => map.set(j.id, j))
        setApplicationJobs(map)
      }
      fetchJobs()
    }
  }, [applications])

  const getStatusConfig = (status: JobApplication['status']) => {
    const configs: Record<JobApplication['status'], { label: string; className: string; icon: LucideIcon }> = {
      submitted: { label: 'Submitted', className: 'status--submitted', icon: Clock },
      reviewing: { label: 'Under Review', className: 'status--reviewing', icon: User },
      shortlisted: { label: 'Shortlisted', className: 'status--shortlisted', icon: CheckCircle2 },
      rejected: { label: 'Rejected', className: 'status--rejected', icon: XCircle },
      accepted: { label: 'Accepted', className: 'status--accepted', icon: CheckCircle2 },
    }
    return configs[status] || configs.submitted
  }

  if (initializing) return <DashboardSkeleton cards={4} sections={2} />
  if (!isAuthenticated || !user) {
    return (
      <div className="dash-panel">
        <EmptyState
          icon={<User size={48} />}
          title="Sign in to access your dashboard"
          description="Create an account to track your applications, save jobs, and manage your profile."
          action={<ButtonLink to="/signup" variant="primary">Sign In / Sign Up</ButtonLink>}
        />
      </div>
    )
  }

  const firstName = user.name?.trim().split(/\s+/)[0]

  return (
    <>
      <DashboardHeader
        title="Job Seeker Dashboard"
        subtitle={firstName ? `Welcome back, ${firstName}! Track your applications and find new opportunities.` : 'Track your applications and find new opportunities.'}
      />

      <section className="dash-section" aria-label="Overview stats">
        <div className="dash-stats">
        <StatCard label="Total Applications" value={stats.totalApplications} icon={FileText} loading={loading} />
          <StatCard label="Under Review" value={stats.pending} icon={Clock} hint="Pending review" loading={loading} />
          <StatCard label="Shortlisted" value={stats.shortlisted} icon={CheckCircle2} loading={loading} />
          <StatCard label="Saved Jobs" value={stats.savedJobs} icon={Heart} loading={loading} />
        </div>
      </section>

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          <Link to="/jobs" className="browse-jobs-card">
            <span className="browse-jobs-card__icon" aria-hidden="true">
              <Plus size={20} />
            </span>
            <h3 className="browse-jobs-card__title">Find new job opportunities</h3>
            <p className="browse-jobs-card__desc">Browse available jobs matching your interests and skills.</p>
            <span className="browse-jobs-card__cta">
              Browse Jobs <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <div className="dash-section-grid">
        <section className="dash-panel" aria-labelledby="overview-tabs">
          <h2 id="overview-tabs" className="dash-panel__title">Dashboard</h2>
          <div className="dashboard-tabs" role="tablist" aria-label="Dashboard sections">
{TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`dash-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => handleTabChange(tab.id as typeof activeTab)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <tab.icon size={18} aria-hidden="true" />
                  {tab.label}
                </button>
              ))}
          </div>

            {activeTab === 'overview' && (
            <div role="tabpanel" aria-labelledby="overview-heading" className="dashboard-tabpanel">
              <h3 id="overview-heading" className="dash-panel__section-title">Recent Applications</h3>
              {recentApplications.length > 0 ? (
                <ul className="activity-list">
                  {recentApplications.map((app) => {
                    const job = jobMap.get(app.jobId)
                    const config = getStatusConfig(app.status)
                    const Icon = config.icon
                    return (
                      <li key={app.id} className="activity-list__item">
                        <Link to={`/jobs/${app.jobId}`} className="activity-list__link">
                          <span className="activity-list__icon" aria-hidden="true"><Icon size={18} /></span>
                          <span className="activity-list__body">
                            <span className="activity-list__title">{job?.title || 'Job not found'}</span>
                            <span className="activity-list__desc">{job?.employerName || 'Unknown employer'}</span>
                          </span>
                          <span className="activity-list__meta">{formatDate(app.appliedAt)}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <EmptyState
                  className="dash-empty-state"
                  icon={<FileText size={24} />}
                  title="No applications yet"
                  description="Start applying to jobs to see them here."
                  action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
                />
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div role="tabpanel" aria-labelledby="applications-heading" className="dashboard-tabpanel">
              <h3 id="applications-heading" className="dash-panel__section-title">My Applications</h3>
              {applications.length > 0 ? (
                <div className="applications-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Employer</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Interview</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const job = applicationJobs.get(app.jobId)
                        const config = getStatusConfig(app.status)
                        const Icon = config.icon
                        const hasInterview = applicationsWithInterviews.has(app.id)
                        return (
                          <tr key={app.id}>
                            <td>
                              <Link to={`/jobs/${app.jobId}`} className="application-link">
                                <strong>{job?.title || 'Job not found'}</strong>
                              </Link>
                            </td>
                            <td>{job?.employerName || 'Unknown'}</td>
                            <td>{formatDate(app.appliedAt)}</td>
                            <td>
                              <span className={`application-status ${config.className}`}>
                                <Icon size={14} aria-hidden="true" />
                                {config.label}
                              </span>
                            </td>
                            <td>
                              {hasInterview ? (
                                <Badge variant="brand" size="sm">
                                  <Video size={12} /> Scheduled
                                </Badge>
                              ) : (
                                <ButtonLink
                                  to={`/jobs/${app.jobId}/applicants/${app.id}/interview/schedule`
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Schedule
                                </ButtonLink>
                              )}
                            </td>
                            <td>
                              <ButtonLink to={`/jobs/${app.jobId}`} variant="ghost" size="sm">
                                View
                              </ButtonLink>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  className="dash-empty-state"
                  icon={<FileText size={24} />}
                  title="No applications yet"
                  description="Your job applications will appear here once you start applying."
                  action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
                />
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div role="tabpanel" aria-labelledby="saved-heading" className="dashboard-tabpanel">
              <h3 id="saved-heading" className="dash-panel__section-title">Saved Jobs</h3>
              {savedJobs.length > 0 ? (
                <div className="saved-jobs-grid">
                  {savedJobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="saved-job-card">
                      <div className="saved-job-header">
                        <h3>{job.title}</h3>
                        <button
                          type="button"
                          className="saved-job-remove"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            savedJobsService.remove(job.id)
                            setSavedJobs(prev => prev.filter(j => j.id !== job.id))
                          }}
                          aria-label="Remove from saved"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                      <p className="saved-job-employer">{job.employerName}</p>
                      <div className="saved-job-meta">
                        <span><MapPin size={14} aria-hidden="true" /> {job.location.town}, {job.location.lga}</span>
                        <span className="saved-job-type">{getEmploymentTypeLabel(job.employmentType)}</span>
                        <span className="saved-job-salary">{job.salary ? formatSalary(job.salary) : 'Negotiable'}</span>
                      </div>
                    <div className="saved-job-actions">
                        <Link to={`/jobs/${job.id}`} className="btn btn--outline btn--sm">
                          View Details
                        </Link>
                        <ButtonLink to={`/jobs/${job.id}`} variant="primary" size="sm">
                          Apply Now
                        </ButtonLink>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="dash-empty-state"
                  icon={<Heart size={24} />}
                  title="No saved jobs"
                  description="Save jobs you're interested in to compare and apply later."
                  action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
                />
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div role="tabpanel" aria-labelledby="profile-heading" className="dashboard-tabpanel">
              <h3 id="profile-heading" className="dash-panel__section-title">My Profile</h3>
              <div className="profile-editor">
                <div className="profile-editor__avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" />
                  ) : (
                    <div className="avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
                  )}
                  <ButtonLink to="/profile" variant="outline" size="sm">
                    Change Photo
                  </ButtonLink>
                </div>
                <div className="profile-editor__fields">
                  <div className="field-group">
                    <label>Full Name</label>
                    <p className="field-value">{user.name || 'Not set'}</p>
                  </div>
                  <div className="field-group">
                    <label>Email</label>
                    <p className="field-value">{user.email || 'Not set'}</p>
                  </div>
                  {profile && (
                    <>
                      <div className="field-group">
                        <label>Professional Title</label>
                        <p className="field-value">{profile.professionalTitle || 'Not set'}</p>
                      </div>
                      <div className="field-group">
                        <label>Years of Experience</label>
                        <p className="field-value">{profile.yearsOfExperience || 'Not set'} years</p>
                      </div>
                      <div className="field-group">
                        <label>Education</label>
                        <p className="field-value">{profile.education || 'Not set'}</p>
                      </div>
                      <div className="field-group">
                        <label>Phone</label>
                        <p className="field-value">{profile.phone || 'Not set'}</p>
                      </div>
                      <div className="field-group">
                        <label>Location</label>
                        <p className="field-value">{profile.location?.town || 'Not set'}, {profile.location?.lga || ''}</p>
                      </div>
                      <div className="field-group">
                        <label>Bio</label>
                        <p className="field-value">{profile.bio || 'Not set'}</p>
                      </div>
                      <div className="field-group">
                        <label>Skills</label>
                        <div className="skills-tags">
                          {profile.skills.map((skill) => (
                            <span key={skill} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <ButtonLink to="/profile" variant="primary">
                    <Settings size={18} /> Edit Profile
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}