import { Navigate } from 'react-router-dom'
import {
  Heart,
  Briefcase,
  ClipboardList,
  LifeBuoy,
  Clock,
  FileText,
  Building,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDashboardData } from '../hooks/useDashboardData'
import type { DashboardData } from '../hooks/useDashboardData'
import {
  DashboardHeader,
  StatCard,
  QuickActionCard,
  DataTable,
  ActivityList,
  AttentionBanner,
  DashboardSkeleton,
} from '../components/dashboard'
import type { ActivityItem, AttentionItem } from '../components/dashboard'
import { Badge } from '../components/ui/Badge'
import type { BadgeVariant } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { formatDate } from '../utils/date'

const QUICK_ACTIONS: { to: string; icon: LucideIcon; title: string; description: string; cta: string }[] = [
  { to: '/services', icon: Briefcase, title: 'Find a Worker', description: 'Search for skilled professionals near you.', cta: 'Find Workers' },
  { to: '/services/request', icon: ClipboardList, title: 'Request a Service', description: 'Tell us what work you need done.', cta: 'Request Service' },
  { to: '/jobs', icon: Briefcase, title: 'Find Jobs', description: 'Explore available job opportunities.', cta: 'Browse Jobs' },
  { to: '/help', icon: LifeBuoy, title: 'Request Help', description: 'Get support for verified community needs.', cta: 'Request Help' },
]

function formatApplicationStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function applicationStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'submitted':
      return 'info'
    case 'reviewing':
    case 'shortlisted':
      return 'warning'
    case 'accepted':
      return 'success'
    case 'rejected':
      return 'error'
    default:
      return 'neutral'
  }
}

function buildActivityItems(data: DashboardData): ActivityItem[] {
  const items: ActivityItem[] = []

  data.applications.data.slice(0, 3).forEach((app) => {
    const job = data.jobMap.data.get(app.jobId)
    const jobTitle = job ? job.title : app.jobId
    items.push({
      id: `app-${app.id}`,
      icon: FileText,
      title: 'Job application submitted',
      description: `Applied to "${jobTitle}" — status: ${formatApplicationStatus(app.status).toLowerCase()}.`,
      timestamp: app.appliedAt,
    })
  })

  data.helpRequests.data.slice(0, 3).forEach((request) => {
    items.push({
      id: `hr-${request.id}`,
      icon: LifeBuoy,
      title: 'Help request submitted',
      description: request.title,
      timestamp: request.createdAt,
      to: `/help/requests/${request.id}`,
    })
  })

  data.savedJobs.data.slice(0, 2).forEach((job) => {
    items.push({
      id: `sj-${job.id}`,
      icon: Briefcase,
      title: 'Job saved',
      description: job.title,
      timestamp: job.createdAt,
      to: `/jobs/${job.id}`,
    })
  })

  data.savedBusinesses.data.slice(0, 2).forEach((business) => {
    items.push({
      id: `sb-${business.id}`,
      icon: Building,
      title: 'Business saved',
      description: business.name,
      timestamp: business.createdAt ?? '',
    })
  })

  return items.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return tb - ta
  })
}

function AttentionSection({ data }: { data: DashboardData }) {
  const items: AttentionItem[] = []

  const pendingRequests = data.helpRequests.data.filter(
    (r) => r.status === 'pending_review' || r.status === 'draft',
  )
  pendingRequests.slice(0, 3).forEach((request) => {
    items.push({
      id: `hr-${request.id}`,
      type: 'info',
      title: `Help request "${request.title}" is awaiting review`,
      description: `Submitted ${formatDate(request.createdAt)}. A community administrator will review your request soon.`,
      action: <ButtonLink to="/help/requests" variant="ghost" size="sm">View Request</ButtonLink>,
    })
  })

  const reviewingApps = data.applications.data.filter((a) => a.status === 'reviewing')
  reviewingApps.slice(0, 3).forEach((app) => {
    items.push({
      id: `app-${app.id}`,
      type: 'warning',
      title: 'Your job application is under review',
      description: `Applied on ${formatDate(app.appliedAt)}.`,
      action: <ButtonLink to="/jobs" variant="ghost" size="sm">View Details</ButtonLink>,
    })
  })

  if (items.length === 0) return null

  return (
    <section className="dash-section" aria-label="Important notices">
      <h2 className="dash-panel__title">Action required</h2>
      <AttentionBanner items={items} />
    </section>
  )
}

export default function UserDashboard() {
  const { user, isAuthenticated, isAdmin, isBusinessOwner, initializing } = useAuth()
  const { data, loading, error } = useDashboardData(user)

  if (initializing) return <DashboardSkeleton cards={4} sections={3} />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />
  if (isBusinessOwner) return <Navigate to="/business/dashboard" replace />

  const firstName = user?.name?.trim().split(/\s+/)[0]
  const displayName = firstName ? `Welcome back, ${firstName}` : 'Welcome to OyoConnect'

  return (
    <>
      <DashboardHeader
        title={displayName}
        subtitle="Here's an overview of your OyoConnect activity."
      />

      {/* Attention / alerts section */}
      <AttentionSection data={data} />

      {/* Primary summary cards */}
      <section className="dash-section" aria-label="Overview">
        <div className="dash-stats">
          <StatCard
            label="Saved Businesses"
            value={data.savedBusinesses.data.length}
            icon={Heart}
            loading={data.savedBusinesses.loading}
            hint={data.savedBusinesses.error ? 'Unable to load' : undefined}
          />
          <StatCard
            label="Saved Jobs"
            value={data.savedJobs.data.length}
            icon={Briefcase}
            loading={data.savedJobs.loading}
            hint={data.savedJobs.error ? 'Unable to load' : undefined}
          />
          <StatCard
            label="Applications"
            value={data.applications.data.length}
            icon={FileText}
            loading={data.applications.loading}
            hint={data.applications.error ? 'Unable to load' : undefined}
          />
          <StatCard
            label="Help Requests"
            value={data.helpRequests.data.length}
            icon={LifeBuoy}
            loading={data.helpRequests.loading}
            hint={data.helpRequests.error ? 'Unable to load' : undefined}
          />
        </div>
      </section>

      {/* Main content — two column layout */}
      <div className="dash-section-grid">
        {/* Left: Activity feed */}
        <section aria-labelledby="activity-title">
          <h2 id="activity-title" className="dash-panel__title">Recent Activity</h2>
          <ActivityList
            items={buildActivityItems(data)}
            loading={loading}
            error={error ?? undefined}
            emptyIcon={<Clock size={24} />}
            emptyTitle="No recent activity"
            emptyDescription="Your activity on OyoConnect — job applications, help requests, and saved items — will appear here."
            emptyAction={
              <div className="dash-empty__actions">
                <ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>
                <ButtonLink to="/help" variant="outline" size="sm">Request Help</ButtonLink>
              </div>
            }
          />
        </section>

        {/* Right: Quick actions + Recent applications */}
        <div className="dash-column">
          <section aria-labelledby="quick-actions-title" className="dash-section">
            <h2 id="quick-actions-title" className="dash-panel__title">Quick Actions</h2>
            <div className="quick-action-grid">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard
                  key={action.title}
                  to={action.to}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  cta={action.cta}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="applications-title" className="dash-section">
            <h2 id="applications-title" className="dash-panel__title">Recent Applications</h2>
            <DataTable
              columns={[
                {
                  key: 'job',
                  header: 'Job',
                  cell: (row) => {
                    const job = data.jobMap.data.get(row.jobId)
                    return job ? job.title : row.jobId
                  },
                },
                {
                  key: 'company',
                  header: 'Company',
                  cell: (row) => {
                    const job = data.jobMap.data.get(row.jobId)
                    return job ? job.employerName : row.applicantName
                  },
                },
                {
                  key: 'status',
                  header: 'Status',
                  cell: (row) => (
                    <Badge variant={applicationStatusVariant(row.status)} size="sm">
                      {formatApplicationStatus(row.status)}
                    </Badge>
                  ),
                },
                { key: 'date', header: 'Date', cell: (row) => formatDate(row.appliedAt), align: 'right' },
              ]}
              rows={data.applications.data.slice(0, 5)}
              keyExtractor={(row) => row.id}
              loading={data.applications.loading}
              emptyTitle="No applications yet"
              emptyDescription="You haven't applied to any jobs. Start exploring opportunities below."
              emptyAction={<ButtonLink to="/jobs" variant="primary" size="sm">Browse Jobs</ButtonLink>}
            />
          </section>
        </div>
      </div>
    </>
  )
}
