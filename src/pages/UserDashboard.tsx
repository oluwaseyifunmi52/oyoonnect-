import { Navigate } from 'react-router-dom'
import {
  Search,
  ClipboardList,
  Briefcase,
  Users,
  HeartHandshake,
  Settings,
  User as UserIcon,
  Check,
  LayoutGrid,
  Inbox,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DashboardLayout, DashboardHeader, QuickActionCard, ActivityList, DashboardSkeleton } from '../components/dashboard'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'
import type { LucideIcon } from 'lucide-react'

const CUSTOMER_NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/services', label: 'Find Services', icon: Search },
  { to: '/my-requests', label: 'My Requests', icon: Inbox },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/help', label: 'Help', icon: HeartHandshake },
  { to: '/settings', label: 'Account Settings', icon: Settings },
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

export default function UserDashboard() {
  const { user, isAuthenticated, isBusinessOwner, isAdmin, isServiceProvider, initializing } = useAuth()

  if (initializing) return <DashboardSkeleton cards={4} sections={3} />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />
  if (isBusinessOwner) return <Navigate to="/business/dashboard" replace />

  const firstName = user?.name?.trim().split(/\s+/)[0]
  const displayName = firstName ? `Welcome back, ${firstName}` : 'Welcome to OyoConnect'

  const features: { label: string; active: boolean }[] = [
    { label: 'Jobs', active: true },
    { label: 'Community', active: true },
    { label: 'Help', active: true },
    { label: 'Service Provider', active: isServiceProvider },
    { label: 'Business Owner', active: isBusinessOwner },
  ]

  return (
    <DashboardLayout navItems={CUSTOMER_NAV} workspaceLabel="Personal">
      <DashboardHeader title={displayName} subtitle="What would you like to do today?" />

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          <QuickActionCard to="/services" icon={Search} title="Find a Worker" description="Search for skilled professionals and service providers." cta="Find Professionals" />
          <QuickActionCard to="/services/request" icon={ClipboardList} title="Request a Service" description="Tell us what work you need done." cta="Request a Service" />
          <QuickActionCard to="/jobs" icon={Briefcase} title="Find Jobs" description="Explore available job opportunities." cta="Browse Jobs" />
          <QuickActionCard to="/community" icon={Users} title="Community" description="Stay informed about updates in your community." cta="Explore Community" />
          <QuickActionCard to="/help" icon={HeartHandshake} title="OyoConnect Help" description="Request help or support verified community needs." cta="Explore Help" />
        </div>
      </section>

      <div className="dash-section-grid">
        <section className="dash-panel" aria-labelledby="activity-title">
          <h2 id="activity-title" className="dash-panel__title">My Activity</h2>
          <ActivityList
            items={[]}
            emptyTitle="No activity yet"
            emptyDescription="Start exploring OyoConnect to see your activity here."
            emptyAction={
              <div className="dash-empty__actions">
                <ButtonLink to="/services" variant="primary" size="sm">Find a Professional</ButtonLink>
                <ButtonLink to="/jobs" variant="outline" size="sm">Browse Jobs</ButtonLink>
              </div>
            }
          />
        </section>

        <section className="dash-panel" aria-labelledby="requests-title">
          <h2 id="requests-title" className="dash-panel__title">My Service Requests</h2>
          <EmptyState
            icon={<Inbox size={28} />}
            title="No service requests yet"
            description="Need someone to help with a task?"
            action={<ButtonLink to="/services" variant="primary" size="sm">Find a Professional</ButtonLink>}
          />
        </section>
      </div>

      <div className="dash-section-grid">
        <section className="dash-panel dash-account" aria-labelledby="account-title">
          <h2 id="account-title" className="dash-panel__title">Your OyoConnect Account</h2>
          <div className="dash-account__head">
            {user?.avatar ? (
              <img className="dash-account__avatar" src={user.avatar} alt="" />
            ) : (
              <span className="dash-account__avatar" aria-hidden="true">{getInitials(user?.name)}</span>
            )}
            <div>
              <p className="dash-account__name">{user?.name || 'OyoConnect User'}</p>
              {user?.email ? <p className="dash-account__email">{user.email}</p> : null}
            </div>
          </div>
          <p className="dash-account__type">
            <UserIcon size={14} aria-hidden="true" /> Personal Account
          </p>
          <p className="dash-account__features-label">Active features:</p>
          <ul className="dash-account__features">
            {features.map((f) => (
              <li key={f.label} className={f.active ? 'is-active' : 'is-locked'}>
                <Check size={14} aria-hidden="true" /> {f.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-panel dash-grow" aria-labelledby="grow-title">
          <h2 id="grow-title" className="dash-panel__title">Do more with OyoConnect</h2>
          <div className="dash-grow__list">
            {!isServiceProvider && (
              <div className="dash-grow__item">
                <span className="dash-grow__icon" aria-hidden="true"><Briefcase size={18} /></span>
                <div className="dash-grow__body">
                  <p className="dash-grow__title">Offer Your Skills</p>
                  <p className="dash-grow__desc">Create a professional profile and connect with customers.</p>
                </div>
                <ButtonLink to="/provider/onboarding" variant="secondary" size="sm">Become a Service Provider</ButtonLink>
              </div>
            )}
            {!isBusinessOwner && (
              <div className="dash-grow__item">
                <span className="dash-grow__icon" aria-hidden="true"><Users size={18} /></span>
                <div className="dash-grow__body">
                  <p className="dash-grow__title">Register a Business</p>
                  <p className="dash-grow__desc">Create and manage your business on OyoConnect.</p>
                </div>
                <ButtonLink to="/business/register" variant="secondary" size="sm">Register a Business</ButtonLink>
              </div>
            )}
            {isServiceProvider && isBusinessOwner && (
              <p className="dash-grow__all">You've unlocked every OyoConnect workspace. Great work!</p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
