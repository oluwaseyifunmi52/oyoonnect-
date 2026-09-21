import { useLocation, Navigate } from 'react-router-dom'
import {
  Building2,
  Settings,
  Search,
  Briefcase,
  MessageSquare,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDashboardData } from '../hooks/useDashboardData'
import type { Business } from '../types/business'
import {
  DashboardHeader,
  StatCard,
  QuickActionCard,
  ActivityList,
  DashboardSkeleton,
  ErrorState,
} from '../components/dashboard'
import type { ActivityItem } from '../components/dashboard'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const PATH_TO_TAB: Record<string, string> = {
  '/business/dashboard': 'overview',
  '/business/profile': 'profile',
  '/business/services': 'services',
  '/business/enquiries': 'enquiries',
}

const BUSINESS_QUICK_ACTIONS: { to: string; icon: LucideIcon; title: string; description: string; cta: string }[] = [
  { to: '/business/profile', icon: Building2, title: 'Manage My Business', description: 'Edit your business information.', cta: 'Manage Business' },
  { to: '/business/services', icon: Settings, title: 'Manage Services', description: 'Add or edit the services you offer.', cta: 'Manage Services' },
  { to: '/services', icon: Search, title: 'Find Workers', description: 'Search for professionals to partner with.', cta: 'Find Workers' },
  { to: '/jobs/post', icon: Briefcase, title: 'Post a Job', description: 'Create a job opportunity.', cta: 'Post a Job' },
  { to: '/business/enquiries', icon: MessageSquare, title: 'Customer Enquiries', description: 'View real enquiries from customers.', cta: 'View Enquiries' },
]

function businessStatusVariant(status?: string): 'success' | 'warning' | 'error' | 'neutral' {
  switch (status) {
    case 'approved':
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'error'
    default:
      return 'neutral'
  }
}

function buildActivityItems(data: ReturnType<typeof useDashboardData>['data']): ActivityItem[] {
  const items: ActivityItem[] = []

  data.helpRequests.data.slice(0, 3).forEach((request) => {
    items.push({
      id: `hr-${request.id}`,
      icon: MessageSquare,
      title: 'New support request',
      description: request.title,
      timestamp: request.createdAt,
      to: `/help/requests/${request.id}`,
    })
  })

  data.interviews.data.slice(0, 3).forEach((interview) => {
    items.push({
      id: `int-${interview.id}`,
      icon: Briefcase,
      title: 'Interview scheduled',
      description: `Interview for job application`,
      timestamp: interview.scheduledStart,
    })
  })

  return items.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return tb - ta
  })
}

export default function BusinessDashboard() {
  const { user, isAuthenticated, initializing, isBusinessOwner } = useAuth()
  const location = useLocation()
  const tab = PATH_TO_TAB[location.pathname] ?? 'overview'
  const { data, loading } = useDashboardData(user)

  if (initializing) return <DashboardSkeleton cards={4} sections={2} />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isBusinessOwner) return <Navigate to="/dashboard" replace />

  const businesses = data.businesses.data
  const stats = data.businessStats.data

  if (data.businesses.error || data.businessStats.error) {
    return (
      <ErrorState
        title="Unable to load your business"
        description="We couldn't load your business information. Please try again."
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (loading) return <DashboardSkeleton cards={4} sections={2} />

  if (tab === 'overview') {
     return <OverviewTab businesses={businesses} stats={stats} data={data} loading={data.businesses.loading || data.businessStats.loading} />
  }
  if (tab === 'profile') {
    return <ProfileTab businesses={businesses} />
  }
  if (tab === 'services') {
    return <ServicesTab />
  }
  if (tab === 'enquiries') {
    return <EnquiriesTab />
  }
  return <OverviewTab businesses={businesses} stats={stats} data={data} loading={data.businesses.loading || data.businessStats.loading} />
}

function OverviewTab({
  businesses,
  stats,
  data,
  loading,
}: {
  businesses: Business[]
  stats: ReturnType<typeof useDashboardData>['data']['businessStats']['data']
  data: ReturnType<typeof useDashboardData>['data']
  loading: boolean
}) {
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
          <StatCard
            label="Total Businesses"
            value={stats?.total ?? null}
            icon={Building2}
            hint={stats ? undefined : 'No data available'}
          />
          <StatCard
            label="Verified Businesses"
            value={stats?.verified ?? null}
            icon={Building2}
            hint={stats ? undefined : 'No data available'}
          />
          <StatCard
            label="Pending Verification"
            value={stats?.pending ?? null}
            icon={Settings}
            hint={stats ? undefined : 'No data available'}
          />
          <StatCard
            label="Total Views"
            value={stats?.totalViews ?? null}
            icon={Search}
            hint={stats ? undefined : 'No data available'}
          />
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
                  <Badge variant={businessStatusVariant(biz.status)} size="sm">
                    {biz.status ? biz.status.charAt(0).toUpperCase() + biz.status.slice(1) : 'Pending'}
                  </Badge>
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
          {BUSINESS_QUICK_ACTIONS.map((action) => (
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

      <section className="dash-panel" aria-labelledby="biz-activity-title">
        <h2 id="biz-activity-title" className="dash-panel__title">Recent Activity</h2>
        <ActivityList
          items={buildActivityItems(data)}
          loading={loading}
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
        <h2 className="dash-panel__title">My Businesses</h2>
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
              <Badge variant={businessStatusVariant(business.status)} size="sm">
                {business.status ? business.status.charAt(0).toUpperCase() + business.status.slice(1) : 'Pending'}
              </Badge>
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