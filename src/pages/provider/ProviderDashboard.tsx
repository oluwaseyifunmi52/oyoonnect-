import { Navigate, Link } from 'react-router-dom'
import {
  ArrowRight, Briefcase, CheckCircle2, ChevronRight, Inbox, Search, UserRound,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/profile/Avatar'
import { StatCard } from '../../components/dashboard'

function EmptyPanel({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="provider-panel__empty">
      <span className="provider-panel__empty-icon">{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

export default function ProviderDashboard() {
  const { user, isAuthenticated, isServiceProvider, initializing } = useAuth()

  if (initializing) return <div className="provider-view" aria-label="Loading dashboard"><div className="provider-hero" /><div className="provider-stats">{[0, 1, 2].map((key) => <div className="provider-panel" key={key} />)}</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isServiceProvider) return <Navigate to="/dashboard" replace />

  const displayName = user?.name?.trim() || 'Service Provider'
  const profileFields = [user?.name, user?.email, user?.phone, user?.avatar]
  const profileCompletion = Math.round(profileFields.filter(Boolean).length / profileFields.length * 100)

  return (
    <div className="provider-view provider-dashboard">
      <section className="provider-hero" aria-labelledby="provider-hero-title">
        <img className="provider-hero__image" src="/images/oyo-hero.jpg" alt="Oyo State monument and landscape" />
        <div className="provider-hero__overlay" />
        <div className="provider-hero__content">
          <span className="provider-hero__eyebrow">PROFESSIONAL WORKSPACE</span>
          <h1 className="provider-hero__title" id="provider-hero-title">Welcome back, {displayName}</h1>
          <p className="provider-hero__description">Grow your services and reach more customers across Oyo.</p>
        </div>
      </section>

      <div className="provider-dashboard-grid">
        <main className="provider-dashboard-main">
          <section className="provider-stats" aria-label="Your work activity">
            <StatCard label="New requests" value={null} icon={Inbox} hint="Request data unavailable" />
            <StatCard label="Active services" value={null} icon={Briefcase} hint="Service data unavailable" />
            <StatCard label="Profile complete" value={`${profileCompletion}%`} icon={UserRound} />
            <StatCard label="Rating" value={null} icon={CheckCircle2} hint="No rating data" />
          </section>

          <section className="provider-panel" aria-labelledby="provider-requests-title">
            <header className="provider-panel__header">
              <div><span className="provider-panel__eyebrow">CUSTOMER ACTIVITY</span><h2 className="provider-panel__title" id="provider-requests-title">Recent service requests</h2></div>
              <Link className="provider-panel__link" to="/provider/requests">View requests <ArrowRight /></Link>
            </header>
            <EmptyPanel icon={<Inbox />} title="No service requests yet" description="Customer requests will appear here when provider request management is connected." />
          </section>

          <section className="provider-panel" aria-labelledby="provider-services-title">
            <header className="provider-panel__header">
              <div><span className="provider-panel__eyebrow">YOUR LISTINGS</span><h2 className="provider-panel__title" id="provider-services-title">My services</h2></div>
              <Link className="provider-panel__link" to="/provider/services">Manage services <ArrowRight /></Link>
            </header>
            <EmptyPanel icon={<Briefcase />} title="No service listings available" description="Provider service listings are not connected to a live data source yet." />
          </section>
        </main>

        <aside className="provider-dashboard-aside" aria-label="Provider account and activity">
          <section className="provider-profile-summary">
            <span className="provider-panel__eyebrow">YOUR PROFILE</span>
            <div className="provider-profile-summary__person">
              <Avatar src={user?.avatar} initials={displayName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')} size="lg" variant={user?.avatar ? 'image' : 'gradient'} />
              <span className="provider-profile-summary__copy"><strong className="provider-profile-summary__name">{displayName}</strong><small className="provider-profile-summary__role">Service Provider</small></span>
            </div>
            <Link className="provider-profile-summary__link" to="/provider/profile">View Profile <ArrowRight /></Link>
          </section>

          <section className="provider-panel" aria-labelledby="provider-quick-actions-title">
            <header className="provider-panel__header"><div><span className="provider-panel__eyebrow">GET THINGS DONE</span><h2 className="provider-panel__title" id="provider-quick-actions-title">Quick Actions</h2></div></header>
            <nav className="provider-quick-actions" aria-label="Provider quick actions">
              <Link className="provider-quick-action" to="/provider/services"><span className="provider-quick-action__icon"><Briefcase /></span><span className="provider-quick-action__label">My Services</span><ChevronRight /></Link>
              <Link className="provider-quick-action" to="/provider/requests"><span className="provider-quick-action__icon"><Inbox /></span><span className="provider-quick-action__label">View Requests</span><ChevronRight /></Link>
              <Link className="provider-quick-action" to="/provider/profile"><span className="provider-quick-action__icon"><UserRound /></span><span className="provider-quick-action__label">Edit Profile</span><ChevronRight /></Link>
              <Link className="provider-quick-action" to="/jobs"><span className="provider-quick-action__icon"><Search /></span><span className="provider-quick-action__label">Find Work</span><ChevronRight /></Link>
            </nav>
          </section>

          <section className="provider-panel" aria-labelledby="provider-activity-title">
            <header className="provider-panel__header"><div><span className="provider-panel__eyebrow">YOUR WORKSPACE</span><h2 className="provider-panel__title" id="provider-activity-title">Recent Activity</h2></div></header>
            <EmptyPanel icon={<Inbox />} title="No recent activity" description="Updates about customer requests and your service listings will appear here when available." />
          </section>
        </aside>
      </div>
    </div>
  )
}
