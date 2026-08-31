import { Navigate } from 'react-router-dom'
import { Inbox, Briefcase, Search, UserCog, LayoutGrid, Settings, MessageSquare, BarChart2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout, DashboardHeader, QuickActionCard, StatCard, ActivityList, DashboardSkeleton, ErrorState } from '../../components/dashboard'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import type { LucideIcon } from 'lucide-react'

const PROVIDER_NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/provider/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/provider/profile', label: 'My Profile', icon: UserCog },
  { to: '/provider/services', label: 'My Services', icon: Briefcase },
  { to: '/provider/requests', label: 'Service Requests', icon: Inbox },
  { to: '/jobs', label: 'Work Opportunities', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
}

export default function ProviderDashboard() {
  const { user, isAuthenticated, isServiceProvider, initializing } = useAuth()

  if (initializing) return <DashboardSkeleton cards={4} sections={2} />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isServiceProvider) return <Navigate to="/dashboard" replace />

  const firstName = user?.name?.trim().split(/\s+/)[0]
  const displayName = firstName ? `${firstName}, manage your services and respond to new opportunities.` : 'Manage your services and respond to new opportunities.'

  const overviewStats = [
    { label: 'New Requests', value: null, icon: Inbox, hint: 'No activity yet' },
    { label: 'Active Work', value: null, icon: Briefcase, hint: 'No activity yet' },
    { label: 'Completed Work', value: null, icon: MessageSquare, hint: 'No activity yet' },
    { label: 'Profile Views', value: null, icon: BarChart2, hint: 'No activity yet' },
  ]

  return (
    <DashboardLayout navItems={PROVIDER_NAV} workspaceLabel="Professional">
      <DashboardHeader title="Professional Dashboard" subtitle={displayName} />

      <section className="dash-section" aria-label="Overview">
        <div className="dash-stats">
          {overviewStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} hint={stat.hint} />
          ))}
        </div>
      </section>

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          <QuickActionCard to="/provider/services" icon={Briefcase} title="Manage Services" description="Add or edit the services you offer." cta="Manage Services" />
          <QuickActionCard to="/provider/requests" icon={Inbox} title="Service Requests" description="View requests from customers." cta="View Requests" />
          <QuickActionCard to="/jobs" icon={Search} title="Find Work" description="Browse available work opportunities." cta="Find Work" />
          <QuickActionCard to="/provider/profile" icon={UserCog} title="Edit Professional Profile" description="Update your skills and professional information." cta="Edit Profile" />
        </div>
      </section>

      <section className="dash-panel" aria-labelledby="provider-activity-title">
        <h2 id="provider-activity-title" className="dash-panel__title">Recent Activity</h2>
        <ActivityList
          items={[]}
          emptyIcon={<Inbox size={28} />}
          emptyTitle="No activity yet"
          emptyDescription="New service requests and opportunities will appear here."
        />
      </section>
    </DashboardLayout>
  )
}