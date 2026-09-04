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
  const [businesses, setBusinesses] = useState<Business[]>([])

  useEffect(() => {
    if (!user || !isBusinessOwner) return
    let mounted = true
    setLoading(true)
    setError(false)
    businessService
      .getMyBusinesses()
      .then((owned) => {
        if (!mounted) return
        setBusinesses(owned)
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
        <OverviewTab businesses={businesses} />
      ) : tab === 'profile' ? (
        <ProfileTab businesses={businesses} />
      ) : tab === 'services' ? (
        <ServicesTab />
      ) : (
        <EnquiriesTab />
      )}
    </DashboardLayout>
  )
}

function OverviewTab({ businesses }: { businesses: Business[] }) {
  if (businesses.length === 0) {
    return (
      <>
        <DashboardHeader
          title="Business Dashboard"
          subtitle="Finish setting up your business to access your Business Dashboard."
        />
        <section className="dash-panel">
          <EmptyState
            icon={<Building2 size={32} />}
            title="No businesses yet"
            description="You haven't added any businesses yet. Get started by creating your first business listing."
            action={<ButtonLink to="/business/register" variant="primary" size="sm">Add Your First Business</ButtonLink>}
          />
        </section>
      </>
    )
  }

  const firstBusiness = businesses[0]
  const firstName = firstBusiness.name ? firstBusiness.name.trim().split(/\s+/)[0] : ''
  const subtitle = firstName
    ? `Welcome, ${firstName}. Here's how your businesses are performing.`
    : "Here's how your businesses are performing."

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

      {businesses.length > 1 && (
        <section className="dash-section" aria-label="Your Businesses">
          <h2 className="dash-panel__title">Your Businesses ({businesses.length})</h2>
          <div className="business-list">
            {businesses.map((biz) => (
              <div key={biz.id} className="business-card">
                <div className="business-card__info">
                  <h3 className="business-card__name">{biz.name}</h3>
                  <p className="business-card__category">{biz.category}</p>
                  <span className={`status-badge status-badge--${biz.status || 'pending'}`}>
                    {biz.status?.charAt(0).toUpperCase() + biz.status?.slice(1) || 'Pending'}
                  </span>
                </div>
                <div className="business-card__actions">
                  <ButtonLink to="/business/profile" variant="secondary" size="sm">Manage</ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

function ProfileTab({ businesses }: { businesses: Business[] }) {
  if (businesses.length === 0) {
    return (
      <section className="dash-panel">
        <EmptyState
          icon={<Building2 size={32} />}
          title="No businesses yet"
          description="You haven't added any businesses yet. Get started by creating your first business listing."
          action={<ButtonLink to="/business/register" variant="primary" size="sm">Add Your First Business</ButtonLink>}
        />
      </section>
    )
  }

  return (
    <section className="dash-panel">
      <h2 className="dash-panel__title">My Businesses ({businesses.length})</h2>
      <div className="business-list">
        {businesses.map((business) => (
          <div key={business.id} className="business-card">
            <div className="business-card__info">
              <h3 className="business-card__name">{business.name}</h3>
              <p className="business-card__category">{business.category || 'Business'}</p>
              {business.description ? <p className="business-card__description">{business.description}</p> : null}
              <span className={`status-badge status-badge--${business.status || 'pending'}`}>
                {business.status?.charAt(0).toUpperCase() + business.status?.slice(1) || 'Pending'}
              </span>
            </div>
            <div className="business-card__actions">
              <ButtonLink to="/business/register" variant="secondary" size="sm">Edit</ButtonLink>
            </div>
          </div>
        ))}
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