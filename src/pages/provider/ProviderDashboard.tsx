import { Navigate } from 'react-router-dom'
import { Inbox, Briefcase, Search, UserCog, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDashboardData } from '../../hooks/useDashboardData'
import {
  DashboardHeader,
  StatCard,
  QuickActionCard,
  ActivityList,
  DashboardSkeleton,
} from '../../components/dashboard'
import type { ActivityItem } from '../../components/dashboard'
import type { LucideIcon } from 'lucide-react'

const PROVIDER_QUICK_ACTIONS: { to: string; icon: LucideIcon; title: string; description: string; cta: string }[] = [
  { to: '/provider/services', icon: Briefcase, title: 'Manage Services', description: 'Add or edit the services you offer.', cta: 'Manage Services' },
  { to: '/provider/requests', icon: Inbox, title: 'Service Requests', description: 'View requests from customers.', cta: 'View Requests' },
  { to: '/jobs', icon: Search, title: 'Find Work', description: 'Browse available work opportunities.', cta: 'Find Work' },
  { to: '/provider/profile', icon: UserCog, title: 'Edit Professional Profile', description: 'Update your skills and professional information.', cta: 'Edit Profile' },
]

function buildActivityItems(data: ReturnType<typeof useDashboardData>['data']): ActivityItem[] {
  const items: ActivityItem[] = []

  data.savedJobs.data.slice(0, 3).forEach((job) => {
    items.push({
      id: `sj-${job.id}`,
      icon: Briefcase,
      title: 'Job saved',
      description: job.title,
      timestamp: job.createdAt,
      to: `/jobs/${job.id}`,
    })
  })

  data.interviews.data.slice(0, 3).forEach((interview) => {
    items.push({
      id: `int-${interview.id}`,
      icon: FileText,
      title: 'Interview scheduled',
      description: interview.status,
      timestamp: interview.scheduledStart,
    })
  })

  data.applications.data.slice(0, 3).forEach((app) => {
    const job = data.jobMap.data.get(app.jobId)
    items.push({
      id: `app-${app.id}`,
      icon: FileText,
      title: 'Application submitted',
      description: job ? `"${job.title}" — status: ${app.status}` : `Application (ID: ${app.id}) — status: ${app.status}`,
      timestamp: app.appliedAt,
    })
  })

  data.helpRequests.data.slice(0, 3).forEach((request) => {
    items.push({
      id: `hr-${request.id}`,
      icon: Inbox,
      title: 'Help request submitted',
      description: request.title,
      timestamp: request.createdAt,
      to: `/help/requests/${request.id}`,
    })
  })

  return items.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return tb - ta
  })
}

export default function ProviderDashboard() {
  const { user, isAuthenticated, isServiceProvider, initializing } = useAuth()
  const { data, loading } = useDashboardData(user)

  if (initializing) return <DashboardSkeleton cards={4} sections={2} />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isServiceProvider) return <Navigate to="/dashboard" replace />

  const firstName = user?.name?.trim().split(/\s+/)[0]
  const displayName = firstName ? `${firstName}, manage your services and respond to new opportunities.` : 'Manage your services and respond to new opportunities.'

  return (
    <>
      <DashboardHeader title="Professional Dashboard" subtitle={displayName} />

      <section className="dash-section" aria-label="Overview">
        <div className="dash-stats">
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
            label="Upcoming Interviews"
            value={data.interviews.data.filter((i) => i.status === 'SCHEDULED').length}
            icon={FileText}
            loading={data.interviews.loading}
            hint={data.interviews.error ? 'Unable to load' : undefined}
          />
          <StatCard
            label="Help Requests"
            value={data.helpRequests.data.length}
            icon={Inbox}
            loading={data.helpRequests.loading}
            hint={data.helpRequests.error ? 'Unable to load' : undefined}
          />
        </div>
      </section>

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          {PROVIDER_QUICK_ACTIONS.map((action) => (
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

      <section className="dash-panel" aria-labelledby="provider-activity-title">
        <h2 id="provider-activity-title" className="dash-panel__title">Recent Activity</h2>
        <ActivityList
          items={buildActivityItems(data)}
          loading={loading}
          emptyIcon={<Inbox size={28} />}
          emptyTitle="No activity yet"
          emptyDescription="New service requests and opportunities will appear here."
        />
      </section>
    </>
  )
}
