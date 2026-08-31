import { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Settings,
  Search,
  Briefcase,
  MessageSquare,
  BarChart2,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { businessService } from '../services/businessService'
import type { Business } from '../types/business'
import { DashboardLayout, DashboardHeader, QuickActionCard, StatCard, ActivityList, DashboardSkeleton, ErrorState } from '../components/dashboard'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'
import type { LucideIcon } from 'lucide-react'

const BUSINESS_NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/business/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/business/profile', label: 'Business Profile', icon: Building2 },
  { to: '/business/services', label: 'Services', icon: Settings },
  { to: '/services', label: 'Find Workers', icon: Search },
  { to: '/jobs/post', label: 'Job Posts', icon: Briefcase },
  { to: '/business/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const PATH_TO_TAB: Record<string, string> = {
  '/business/dashboard': 'overview',
  '/business/profile': 'profile',
  '/business/services': 'services',
  '/business/enquiries': 'enquiries',
}

const OVERVIEW_STATS: { label: string; icon: LucideIcon }[] = [
  { label: 'Business Views', icon: BarChart2 },
  { label: 'Customer Enquiries', icon: MessageSquare },
  { label: 'Service Requests', icon: Settings },
  { label: 'Active Job Posts', icon: Briefcase },
]

export default function BusinessDashboard() {
  const { user, isAuthenticated, initializing, isBusinessOwner } = useAuth()
  const location = useLocation()
  const tab = PATH_TO_TAB[location.pathname] ?? 'overview'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [business, setBusiness] = useState<Business | null>(null)

  useEffect(() => {
    if (!user || !isBusinessOwner) return
    let mounted = true
    setLoading(true)
    setError(false)
    businessService
      .getByOwner(user.id)
      .then((owned) => {
        if (!mounted) return
        setBusiness(owned[0] ?? null)
      })
      .catch(() => {
        if (!mounted) return
        setError(true)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [user, isBusinessOwner])

  if (initializing) return <DashboardSkeleton cards={4} sections={2} />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isBusinessOwner) return <Navigate to="/dashboard" replace />

  if (error) {
    return (
      <DashboardLayout navItems={BUSINESS_NAV} workspaceLabel="Business">
        <ErrorState
          title="Unable to load your business"
          description="We couldn't load your business information. Please try again."
          onRetry={() => setLoading(true)}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={BUSINESS_NAV} workspaceLabel="Business">
      {loading ? (
        <DashboardSkeleton cards={4} sections={2} />
      ) : tab === 'overview' ? (
        <OverviewTab business={business} />
      ) : tab === 'profile' ? (
        <ProfileTab business={business} />
      ) : tab === 'services' ? (
        <ServicesTab />
      ) : (
        <EnquiriesTab />
      )}
    </DashboardLayout>
  )
}

function OverviewTab({ business }: { business: Business | null }) {
  if (!business) {
    return (
      <>
        <DashboardHeader
          title="Business Dashboard"
          subtitle="Finish setting up your business to access your Business Dashboard."
        />
        <section className="dash-panel">
          <EmptyState
            icon={<Building2 size={32} />}
            title="Complete your business setup"
            description="Finish setting up your business to access your Business Dashboard, services, and enquiries."
            action={<ButtonLink to="/business/register" variant="primary" size="sm">Complete Business Setup</ButtonLink>}
          />
        </section>
      </>
    )
  }

  const firstName = business.name ? business.name.trim().split(/\s+/)[0] : ''
  const subtitle = firstName
    ? `Welcome, ${firstName}. Here's how your business is performing.`
    : "Here's how your business is performing."

  return (
    <>
      <DashboardHeader title="Business Dashboard" subtitle={subtitle} />

      <section className="dash-section" aria-label="Overview">
        <div className="dash-stats">
          {OVERVIEW_STATS.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={null} icon={stat.icon} hint="No data available" />
          ))}
        </div>
      </section>

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          <QuickActionCard to="/business/profile" icon={Building2} title="Manage My Business" description="Edit your business information." cta="Manage Business" />
          <QuickActionCard to="/business/services" icon={Settings} title="Manage Services" description="Add or edit the services you offer." cta="Manage Services" />
          <QuickActionCard to="/services" icon={Search} title="Find Workers" description="Search for professionals to partner with." cta="Find Workers" />
          <QuickActionCard to="/jobs/post" icon={Briefcase} title="Post a Job" description="Create a job opportunity." cta="Post a Job" />
          <QuickActionCard to="/business/enquiries" icon={MessageSquare} title="Customer Enquiries" description="View real enquiries from customers." cta="View Enquiries" />
        </div>
      </section>

      <section className="dash-panel" aria-labelledby="biz-activity-title">
        <h2 id="biz-activity-title" className="dash-panel__title">Recent Business Activity</h2>
        <ActivityList
          items={[]}
          emptyIcon={<MessageSquare size={28} />}
          emptyTitle="No activity yet"
          emptyDescription="Customer enquiries and business activity will appear here."
        />
      </section>
    </>
  )
}

function ProfileTab({ business }: { business: Business | null }) {
  if (!business) {
    return (
      <section className="dash-panel">
        <EmptyState
          icon={<Building2 size={32} />}
          title="Complete your business setup"
          description="Set up your business profile to manage it from here."
          action={<ButtonLink to="/business/register" variant="primary" size="sm">Complete Business Setup</ButtonLink>}
        />
      </section>
    )
  }

  return (
    <section className="dash-panel">
      <h2 className="dash-panel__title">{business.name}</h2>
      <p className="dash-muted">{business.category || 'Business'}</p>
      {business.description ? <p className="dash-muted">{business.description}</p> : null}
      <div className="dash-empty__actions">
        <ButtonLink to="/business/register" variant="secondary" size="sm">Edit Business Profile</ButtonLink>
      </div>
    </section>
  )
}

function ServicesTab() {
  return (
    <section className="dash-panel">
      <h2 className="dash-panel__title">Services</h2>
      <EmptyState
        icon={<Settings size={28} />}
        title="No services yet"
        description="When you add services to your business, they'll appear here."
        action={<ButtonLink to="/business/register" variant="primary" size="sm">Add a Service</ButtonLink>}
      />
    </section>
  )
}

function EnquiriesTab() {
  return (
    <section className="dash-panel">
      <h2 className="dash-panel__title">Customer Enquiries</h2>
      <EmptyState
        icon={<MessageSquare size={28} />}
        title="No enquiries yet"
        description="Customer enquiries will appear here when messaging or contact tracking is connected."
      />
    </section>
  )
}