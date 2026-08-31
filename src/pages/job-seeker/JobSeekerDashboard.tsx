import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import { ArrowLeft, Heart, Briefcase, Clock, CheckCircle2, XCircle, User, FileText, Loader2, Plus, Settings, ArrowRight, ExternalLink, MessageSquare, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/jobService'
import { profileService } from '../../services/jobService'
import { savedJobsService } from '../../services/jobService'
import { formatSalary, getEmploymentTypeLabel, getApplicationMethodLabel, getExperienceLevelLabel } from '../../types/jobs'
import { formatDate } from '../../utils/date'
import type { Job, JobApplication, JobSeekerProfile } from '../../types/jobs'
import { DashboardHeader, QuickActionCard, StatCard, ActivityList, DashboardSkeleton } from '../../components/dashboard'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import type { LucideIcon } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'saved', label: 'Saved Jobs', icon: Heart },
  { id: 'profile', label: 'My Profile', icon: Settings },
]

export default function JobSeekerDashboard() {
  const { user, isAuthenticated, initializing } = useAuth()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved' | 'profile'>('overview')
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [profile, setProfile] = useState<JobSeekerProfile | undefined>()

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
          <StatCard label="Total Applications" value={stats.totalApplications} icon={FileText} />
          <StatCard label="Under Review" value={stats.pending} icon={Clock} hint="Pending review" />
          <StatCard label="Shortlisted" value={stats.shortlisted} icon={CheckCircle2} hint="Shortlisted" />
          <StatCard label="Saved Jobs" value={stats.savedJobs} icon={Heart} />
        </div>
      </section>

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          <QuickActionCard to="/jobs" icon={Plus} title="Browse Jobs" description="Find new job opportunities." cta="Browse Jobs" />
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
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <tab.icon size={18} aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div role="tabpanel" aria-labelledby="overview-heading">
              <h3 id="overview-heading" className="dash-panel__title">Recent Applications</h3>
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
                  icon={<FileText size={28} />}
                  title="No applications yet"
                  description="Start applying to jobs to see them here."
                  action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
                />
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div role="tabpanel" aria-labelledby="applications-heading">
              <h3 id="applications-heading" className="dash-panel__title">My Applications</h3>
              {applications.length > 0 ? (
                <div className="applications-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Employer</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const job = applicationJobs.get(app.jobId)
                        const config = getStatusConfig(app.status)
                        const Icon = config.icon
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
                              <Link to={`/jobs/${app.jobId}`} className="btn btn--ghost btn--sm">
                                View
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={<FileText size={28} />}
                  title="No applications yet"
                  description="Your job applications will appear here once you start applying."
                  action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
                />
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div role="tabpanel" aria-labelledby="saved-heading">
              <h3 id="saved-heading" className="dash-panel__title">Saved Jobs</h3>
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
                  icon={<Heart size={28} />}
                  title="No saved jobs"
                  description="Save jobs you're interested in to compare and apply later."
                  action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
                />
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div role="tabpanel" aria-labelledby="profile-heading">
              <h3 id="profile-heading" className="dash-panel__title">My Profile</h3>
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
                  <Link to="/profile" className="btn btn--primary">
                    <Settings size={18} /> Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}