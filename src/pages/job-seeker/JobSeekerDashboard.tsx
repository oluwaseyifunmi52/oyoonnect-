import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Bell, BriefcaseBusiness, CheckCircle2, Clock3, FileText, Heart,
  MapPin, MessageCircle, Search, Settings, UserRound, Video, X, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { applicationService, interviewService, jobService, profileService, savedJobsService } from '../../services/jobService'
import { notificationService } from '../../services/notificationService'
import { formatSalary, getEmploymentTypeLabel } from '../../types/jobs'
import { formatDate } from '../../utils/date'
import type { Job, JobApplication, JobSeekerProfile, Interview } from '../../types/jobs'
import { Avatar } from '../../components/profile/Avatar'
import { ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { LocationSelector } from '../../components/search/LocationSelector'
import '../../styles/job-seeker-dashboard.css'

type DashboardTab = 'overview' | 'applications' | 'saved' | 'profile'

const TABS: { id: DashboardTab; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: UserRound },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'saved', label: 'Saved Jobs', icon: Heart },
  { id: 'profile', label: 'My Profile', icon: Settings },
]

function initialTab(): DashboardTab {
  const tab = window.location.hash.slice(1)
  return TABS.some((item) => item.id === tab) ? tab as DashboardTab : 'overview'
}

function timeAgo(value: string) {
  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return ''
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60_000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'OC'
}

function getStatus(status: JobApplication['status']) {
  const config: Record<JobApplication['status'], { label: string; className: string; icon: LucideIcon }> = {
    submitted: { label: 'Submitted', className: 'is-submitted', icon: Clock3 },
    reviewing: { label: 'Under review', className: 'is-reviewing', icon: UserRound },
    shortlisted: { label: 'Shortlisted', className: 'is-shortlisted', icon: CheckCircle2 },
    rejected: { label: 'Rejected', className: 'is-rejected', icon: X },
    accepted: { label: 'Accepted', className: 'is-accepted', icon: CheckCircle2 },
  }
  return config[status] || config.submitted
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`job-seeker-panel ${className}`}>{children}</section>
}

function PanelHeading({ eyebrow, title, to, action }: { eyebrow?: string; title: string; to?: string; action?: string }) {
  return (
    <header className="job-seeker-panel__heading">
      <div>{eyebrow && <span className="job-seeker-eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>
      {to && action && <Link className="job-seeker-panel__link" to={to} state={to === '/notifications' ? { workspaceKey: 'customer' } : undefined}>{action}<ArrowRight size={15} aria-hidden="true" /></Link>}
    </header>
  )
}

function JobCard({ job, saved, onToggleSave }: { job: Job; saved: boolean; onToggleSave: (job: Job) => void }) {
  const location = [job.location.town, job.location.lga].filter(Boolean).join(', ')
  return (
    <article className="job-seeker-job-card">
      <Link className="job-seeker-job-card__main" to={`/jobs/${job.id}`}>
        <span className="job-seeker-job-card__logo">
          {job.employerLogo ? <img src={job.employerLogo} alt="" /> : initials(job.employerName)}
        </span>
        <span className="job-seeker-job-card__copy">
          <strong>{job.title}</strong><span>{job.employerName}</span>
          <small><MapPin size={13} aria-hidden="true" />{location || job.location.state}</small>
        </span>
      </Link>
      <div className="job-seeker-job-card__details">
        <span className="job-seeker-tag">{getEmploymentTypeLabel(job.employmentType)}</span>
        {job.category && <span className="job-seeker-tag job-seeker-tag--soft">{job.category}</span>}
        {job.featured && <span className="job-seeker-tag job-seeker-tag--highlight">Featured</span>}
      </div>
      <div className="job-seeker-job-card__meta">
        <strong>{job.salary ? formatSalary(job.salary) : 'Salary not stated'}</strong>
        <span>{timeAgo(job.createdAt)}</span>
      </div>
      <div className="job-seeker-job-card__actions">
        <button type="button" className={`job-seeker-save${saved ? ' is-saved' : ''}`} onClick={() => onToggleSave(job)} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}>
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />{saved ? 'Saved' : 'Save'}
        </button>
        <Link className="job-seeker-apply" to={`/jobs/${job.id}`}>View &amp; Apply</Link>
      </div>
    </article>
  )
}

function ApplicationRow({ application, job, interviewScheduled }: { application: JobApplication; job?: Job; interviewScheduled: boolean }) {
  const status = getStatus(application.status)
  const StatusIcon = status.icon
  return (
    <article className="job-seeker-application-row">
      <span className="job-seeker-application-icon"><FileText size={17} aria-hidden="true" /></span>
      <div className="job-seeker-application-copy">
        <Link to={`/jobs/${application.jobId}`}><strong>{job?.title || 'Job not found'}</strong></Link>
        <span>{job?.employerName || 'Unknown employer'} · Applied {formatDate(application.appliedAt)}</span>
      </div>
      <span className={`job-seeker-status ${status.className}`}><StatusIcon size={13} aria-hidden="true" />{status.label}</span>
      <div className="job-seeker-application-actions">
        {interviewScheduled ? <span className="job-seeker-interview"><Video size={13} /> Interview scheduled</span> : <Link to={`/jobs/${application.jobId}/applicants/${application.id}/interview/schedule`}>Schedule <ArrowRight size={12} /></Link>}
        <Link to={`/jobs/${application.jobId}`}>View <ArrowRight size={12} /></Link>
      </div>
    </article>
  )
}

function LoadingRows() {
  return <div className="job-seeker-skeleton-list" aria-label="Loading jobs">{[0, 1, 2].map((item) => <div className="job-seeker-skeleton-card" key={item}><i /><span><b /><b /><small /></span></div>)}</div>
}

export default function JobSeekerDashboard() {
  const { user, isAuthenticated, initializing } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [profile, setProfile] = useState<JobSeekerProfile | undefined>()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [applicationJobs, setApplicationJobs] = useState<Map<string, Job>>(new Map())
  const [latestJobs, setLatestJobs] = useState<Job[]>([])
  const [latestLoading, setLatestLoading] = useState(true)
  const [latestError, setLatestError] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set())
  const [searchText, setSearchText] = useState('')
  const [location, setLocation] = useState('')
  const [notifications] = useState(() => notificationService.getNotifications().slice(0, 3))

  useEffect(() => {
    const syncTab = () => setActiveTab(initialTab())
    window.addEventListener('hashchange', syncTab)
    return () => window.removeEventListener('hashchange', syncTab)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user) return
    let mounted = true
    setDashboardLoading(true)
    setDashboardError('')
    Promise.all([
      applicationService.getByApplicant(user.id),
      savedJobsService.getSavedJobDetails(),
      profileService.getProfile(user.id),
      interviewService.getByCandidate(user.id),
    ]).then(([apps, saved, seekerProfile, candidateInterviews]) => {
      if (!mounted) return
      setApplications(apps)
      setSavedJobs(saved)
      setSavedIds(new Set(saved.map((job) => job.id)))
      setProfile(seekerProfile)
      setInterviews(candidateInterviews)
    }).catch((error: unknown) => {
      if (mounted) setDashboardError(error instanceof Error ? error.message : 'Unable to load your job seeker data.')
    }).finally(() => {
      if (mounted) setDashboardLoading(false)
    })
    return () => { mounted = false }
  }, [isAuthenticated, user])

  useEffect(() => {
    let mounted = true
    setLatestLoading(true)
    setLatestError('')
    jobService.getActive().then((found) => {
      if (mounted) setLatestJobs([...found].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }).catch((error: unknown) => {
      if (mounted) setLatestError(error instanceof Error ? error.message : 'Unable to load current job listings.')
    }).finally(() => { if (mounted) setLatestLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    if (!applications.length) { setApplicationJobs(new Map()); return }
    Promise.all([...new Set(applications.map((application) => application.jobId))].map((id) => jobService.getById(id)))
      .then((jobs) => {
        if (!mounted) return
        setApplicationJobs(new Map(jobs.filter((job): job is Job => Boolean(job)).map((job) => [job.id, job])))
      })
      .catch(() => { if (mounted) setApplicationJobs(new Map()) })
    return () => { mounted = false }
  }, [applications])

  const recentApplications = useMemo(() => [...applications].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()), [applications])
  const activeInterviews = interviews.filter((interview) => interview.status === 'SCHEDULED' || interview.status === 'ACCEPTED' || interview.status === 'RESCHEDULE_REQUESTED')
  const recommendedJobs = useMemo(() => latestJobs.filter((job) => !applications.some((application) => application.jobId === job.id)).slice(0, 3), [latestJobs, applications])
  const completionFields = [
    { label: 'Name', complete: Boolean(profile?.fullName || user?.name) },
    { label: 'Email', complete: Boolean(profile?.email || user?.email) },
    { label: 'Professional title', complete: Boolean(profile?.professionalTitle?.trim()) },
    { label: 'Skills', complete: Boolean(profile?.skills?.length) },
    { label: 'Experience', complete: profile?.yearsOfExperience != null },
    { label: 'Location', complete: Boolean(profile?.location?.town || profile?.location?.lga) },
    { label: 'Bio', complete: Boolean(profile?.bio?.trim()) },
    { label: 'Phone', complete: Boolean(profile?.phone || user?.phone) },
  ]
  const completion = Math.round(completionFields.filter((field) => field.complete).length / completionFields.length * 100)
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there'

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (searchText.trim()) params.set('q', searchText.trim())
    if (location) params.set('location', location)
    navigate(`/jobs${params.size ? `?${params.toString()}` : ''}`)
  }

  const handleToggleSave = (job: Job) => {
    const saved = savedJobsService.toggle(job.id)
    setSavedIds((current) => {
      const next = new Set(current)
      if (saved) next.add(job.id)
      else next.delete(job.id)
      return next
    })
    setSavedJobs((current) => saved ? current.some((item) => item.id === job.id) ? current : [job, ...current] : current.filter((item) => item.id !== job.id))
  }

  const handleRemoveSaved = (job: Job) => {
    savedJobsService.remove(job.id)
    setSavedJobs((current) => current.filter((item) => item.id !== job.id))
    setSavedIds((current) => { const next = new Set(current); next.delete(job.id); return next })
  }

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab)
    window.location.hash = tab
  }

  if (initializing) return <div className="job-seeker-view" aria-label="Loading job seeker dashboard"><div className="job-seeker-hero-skeleton" /><LoadingRows /></div>
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />

  const shortName = `${user.name || ''}`.trim()
  const roleLabel = user.role === 'user' || user.role === 'customer' ? 'Job Seeker' : user.role.replaceAll('_', ' ')

  return (
    <div className="job-seeker-view">
      <section className="job-seeker-hero" aria-labelledby="job-seeker-hero-title">
        <img src="/images/oyo-hero.jpg" alt="Oyo State landmark" className="job-seeker-hero__image" />
        <div className="job-seeker-hero__overlay" />
        <div className="job-seeker-hero__content">
          <span className="job-seeker-hero__eyebrow">OYO STATE, NIGERIA</span>
          <h1 id="job-seeker-hero-title">Welcome back, {firstName}</h1>
          <p>Find your next opportunity and build your career in Oyo.</p>
          <form className="job-seeker-hero-search" role="search" onSubmit={handleSearch}>
            <label className="job-seeker-hero-search__query"><Search size={17} aria-hidden="true" /><input type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Job title, skill or company" aria-label="Search jobs by title, skill or company" /></label>
            <span className="job-seeker-hero-search__divider" aria-hidden="true" />
            <label className="job-seeker-hero-search__location"><LocationSelector id="job-seeker-location" value={location} onChange={setLocation} placeholder="All Oyo State" ariaLabel="Choose a job location" /></label>
            <button type="submit">Search jobs <ArrowRight size={15} aria-hidden="true" /></button>
          </form>
        </div>
      </section>

      <section className="job-seeker-stats" aria-label="Your job search activity">
        <div className="job-seeker-stat"><span className="job-seeker-stat__icon"><FileText size={18} /></span><span><small>Applications sent</small><strong>{dashboardLoading ? '—' : applications.length}</strong></span></div>
        <div className="job-seeker-stat"><span className="job-seeker-stat__icon"><Heart size={18} /></span><span><small>Saved jobs</small><strong>{dashboardLoading ? '—' : savedJobs.length}</strong></span></div>
        <div className="job-seeker-stat"><span className="job-seeker-stat__icon"><Video size={18} /></span><span><small>Interviews</small><strong>{dashboardLoading ? '—' : activeInterviews.length}</strong></span></div>
      </section>

      {dashboardError && <div className="job-seeker-error" role="alert">{dashboardError}</div>}

      <div className="job-seeker-layout-grid">
        <main className="job-seeker-main-column">
          <Panel className="job-seeker-tabs-panel">
            <nav className="job-seeker-tabs" role="tablist" aria-label="Job seeker dashboard sections">
              {TABS.map(({ id, label, icon: Icon }) => <button type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'is-active' : ''} key={id} onClick={() => handleTabChange(id)}><Icon size={16} aria-hidden="true" />{label}</button>)}
            </nav>

            {activeTab === 'overview' && <div className="job-seeker-tab-content">
              <PanelHeading eyebrow="FOR YOU" title="Latest jobs in Oyo" to="/jobs" action="Browse all jobs" />
              {latestLoading ? <LoadingRows /> : latestError ? <div className="job-seeker-inline-error" role="alert">{latestError}</div> : recommendedJobs.length ? <div className="job-seeker-job-list">{recommendedJobs.map((job) => <JobCard key={job.id} job={job} saved={savedIds.has(job.id)} onToggleSave={handleToggleSave} />)}</div> : <EmptyState className="job-seeker-empty" icon={<BriefcaseBusiness size={25} />} title="No current openings" description="New active jobs will appear here as employers post them." action={<ButtonLink to="/jobs" variant="outline" size="sm">Browse all jobs</ButtonLink>} />}

              <div className="job-seeker-section-gap" />
              <PanelHeading eyebrow="APPLICATION TRACKER" title="My applications" to="/job-seeker#applications" action="View all" />
              {dashboardLoading ? <LoadingRows /> : recentApplications.length ? <div className="job-seeker-application-list">{recentApplications.slice(0, 3).map((application) => <ApplicationRow key={application.id} application={application} job={applicationJobs.get(application.jobId)} interviewScheduled={activeInterviews.some((interview) => interview.applicationId === application.id)} />)}</div> : <EmptyState className="job-seeker-empty job-seeker-empty--compact" icon={<FileText size={22} />} title="No applications yet" description="Your submitted applications will appear here." action={<ButtonLink to="/jobs" variant="outline" size="sm">Find a job</ButtonLink>} />}

              {savedJobs.length > 0 && <><div className="job-seeker-section-gap" /><PanelHeading eyebrow="BOOKMARKED ROLES" title="Saved jobs" to="/job-seeker#saved" action="View all" /><div className="job-seeker-saved-preview">{savedJobs.slice(0, 3).map((job) => <Link key={job.id} to={`/jobs/${job.id}`}><span className="job-seeker-saved-preview__icon"><Heart size={15} /></span><span><strong>{job.title}</strong><small>{job.employerName}</small></span><ArrowRight size={15} /></Link>)}</div></>}
            </div>}

            {activeTab === 'applications' && <div className="job-seeker-tab-content">
              <PanelHeading eyebrow="APPLICATION TRACKER" title="My applications" />
              {dashboardLoading ? <LoadingRows /> : applications.length ? <div className="job-seeker-application-list">{recentApplications.map((application) => <ApplicationRow key={application.id} application={application} job={applicationJobs.get(application.jobId)} interviewScheduled={activeInterviews.some((interview) => interview.applicationId === application.id)} />)}</div> : <EmptyState className="job-seeker-empty" icon={<FileText size={25} />} title="No applications yet" description="Your submitted applications will appear here." action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse jobs</ButtonLink>} />}
            </div>}

            {activeTab === 'saved' && <div className="job-seeker-tab-content">
              <PanelHeading eyebrow="BOOKMARKED ROLES" title="Saved jobs" />
              {dashboardLoading ? <LoadingRows /> : savedJobs.length ? <div className="job-seeker-job-list">{savedJobs.map((job) => <JobCard key={job.id} job={job} saved onToggleSave={() => handleRemoveSaved(job)} />)}</div> : <EmptyState className="job-seeker-empty" icon={<Heart size={25} />} title="No saved jobs" description="Save jobs you are interested in to compare and revisit them here." action={<ButtonLink to="/jobs" variant="primary" size="sm">Browse jobs</ButtonLink>} />}
            </div>}

            {activeTab === 'profile' && <div className="job-seeker-tab-content">
              <PanelHeading eyebrow="YOUR INFORMATION" title="My profile" to="/profile" action="Edit profile" />
              <div className="job-seeker-profile-tab-person"><Avatar src={profile?.profilePhoto || user.avatar} initials={initials(shortName)} size="lg" variant={profile?.profilePhoto || user.avatar ? 'image' : 'gradient'} /><div><strong>{profile?.fullName || user.name || 'Job Seeker'}</strong><small>{profile?.professionalTitle || roleLabel}</small></div><ButtonLink to="/profile" variant="outline" size="sm">Change photo</ButtonLink></div>
              <div className="job-seeker-profile-details">
                <div><small>Full name</small><strong>{profile?.fullName || user.name || 'Not set'}</strong></div>
                <div><small>Email address</small><strong>{profile?.email || user.email || 'Not set'}</strong></div>
                {profile?.professionalTitle && <div><small>Professional title</small><strong>{profile.professionalTitle}</strong></div>}
                {profile?.phone && <div><small>Phone</small><strong>{profile.phone}</strong></div>}
                {profile?.education && <div><small>Education</small><strong>{profile.education}</strong></div>}
                {profile?.yearsOfExperience != null && <div><small>Experience</small><strong>{profile.yearsOfExperience} years</strong></div>}
                {(profile?.location?.town || profile?.location?.lga) && <div><small>Location</small><strong>{[profile.location.town, profile.location.lga].filter(Boolean).join(', ')}</strong></div>}
                {profile?.bio && <div className="job-seeker-profile-details__wide"><small>About</small><strong>{profile.bio}</strong></div>}
                {profile?.skills?.length ? <div className="job-seeker-profile-details__wide"><small>Skills</small><span className="job-seeker-skill-tags">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</span></div> : null}
                {profile?.cvUrl && <div className="job-seeker-profile-details__wide"><small>CV / resume</small><a href={profile.cvUrl} target="_blank" rel="noreferrer">View your CV <ArrowRight size={14} /></a></div>}
              </div>
              <ButtonLink to="/profile" variant="primary" size="sm">Edit profile</ButtonLink>
            </div>}
          </Panel>
        </main>

        <aside className="job-seeker-aside" aria-label="Your job seeker account">
          <Panel className="job-seeker-profile-card">
            <span className="job-seeker-eyebrow">YOUR PROFILE</span>
            <div className="job-seeker-profile-person"><Avatar src={profile?.profilePhoto || user.avatar} initials={initials(shortName)} size="lg" variant={profile?.profilePhoto || user.avatar ? 'image' : 'gradient'} /><span><strong>{shortName || 'Job Seeker'}</strong><small>{roleLabel}</small></span></div>
            <Link className="job-seeker-profile-link" to="/profile">View / edit profile <ArrowRight size={15} /></Link>
          </Panel>

          <Panel>
            <PanelHeading eyebrow="PROFILE CHECKLIST" title="Profile completeness" to="/profile" action="Complete profile" />
            <div className="job-seeker-completion"><strong>{completion}%</strong><span>complete</span></div>
            <div className="job-seeker-completion__track" role="progressbar" aria-label="Profile completeness" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${completion}%` }} /></div>
            <ul className="job-seeker-completion__list">{completionFields.filter((field) => !field.complete).slice(0, 3).map((field) => <li key={field.label}><span />Add {field.label.toLowerCase()}</li>)}</ul>
            {profile?.cvUrl && <a className="job-seeker-cv-link" href={profile.cvUrl} target="_blank" rel="noreferrer"><FileText size={14} />View your CV</a>}
          </Panel>

          <Panel>
            <PanelHeading eyebrow="SHORTCUTS" title="Quick actions" />
            <nav className="job-seeker-quick-actions" aria-label="Job seeker shortcuts">
              <Link to="/jobs"><span><Search size={16} /></span>Browse jobs<ArrowRight size={14} /></Link>
              <Link to="/job-seeker#applications"><span><FileText size={16} /></span>My applications<ArrowRight size={14} /></Link>
              <Link to="/job-seeker#saved"><span><Heart size={16} /></span>Saved jobs<ArrowRight size={14} /></Link>
              <Link to="/profile"><span><UserRound size={16} /></span>Edit profile<ArrowRight size={14} /></Link>
              <Link to="/messages"><span><MessageCircle size={16} /></span>Messages<ArrowRight size={14} /></Link>
            </nav>
          </Panel>

          {notifications.length > 0 && <Panel>
            <PanelHeading eyebrow="LATEST UPDATES" title="Recent notifications" to="/notifications" action="View all" />
            <div className="job-seeker-notifications">{notifications.map((notification) => <Link key={notification.id} to={notification.href || '/notifications'}><span><Bell size={14} /></span><span><strong>{notification.title}</strong><small>{notification.message}</small></span></Link>)}</div>
          </Panel>}
        </aside>
      </div>
    </div>
  )
}
