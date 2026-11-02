import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, Building2, CalendarDays, ChevronRight,
  Clock3, FileWarning, Gamepad2, HeartHandshake, MapPin, MessageCircle, ShoppingBag, Users,
  type LucideIcon,
} from 'lucide-react'
import { SearchBar } from '../components/search/SearchBar'
import { Avatar } from '../components/profile/Avatar'
import { Button } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useDashboardData } from '../hooks/useDashboardData'
import { fetchDailyOyo } from '../services/dailyOyoService'
import type { DailyOyoSummary } from '../services/dailyOyoService'
import { notificationService } from '../services/notificationService'
import type { Notification } from '../types/notifications'
import { siteConfig } from '../config/site'

interface FeatureCard {
  title: string
  description: string
  to: string
  icon: LucideIcon
  color: 'green' | 'cyan' | 'orange' | 'red' | 'teal' | 'purple'
}

const featureCards: FeatureCard[] = [
  { title: 'Nearby places', description: 'Find trusted services and places around you.', to: '/search', icon: MapPin, color: 'green' },
  { title: 'Jobs & careers', description: 'Explore local openings and career opportunities.', to: '/jobs', icon: BriefcaseBusiness, color: 'cyan' },
  { title: 'Local marketplace', description: 'Buy and sell products and services nearby.', to: '/categories', icon: ShoppingBag, color: 'orange' },
  { title: 'Community reports', description: 'See local issues and community updates.', to: '/community', icon: FileWarning, color: 'red' },
  { title: 'Get help', description: 'Find support and helpful local resources.', to: '/community/help', icon: HeartHandshake, color: 'teal' },
  { title: 'Games & community', description: 'Play, chat and connect with neighbors.', to: '/services/games', icon: Gamepad2, color: 'purple' },
]

const actionItems = [
  { label: 'Post a Job', to: '/jobs/post', icon: BriefcaseBusiness, color: 'green' },
  { label: 'List a Business', to: '/business/register', icon: Building2, color: 'cyan' },
  { label: 'Report an Issue', to: '/community/report', icon: FileWarning, color: 'orange' },
]

function getInitials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'U'
}

function relativeTime(value?: string) {
  if (!value) return ''
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const dashboardData = useDashboardData(user)
  const [dailyData, setDailyData] = useState<DailyOyoSummary | null>(null)
  const [dailyLoading, setDailyLoading] = useState(true)
  const [dailyError, setDailyError] = useState<string | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)
  const [activity, setActivity] = useState<Notification[]>(() => notificationService.getNotifications())

  const loadDailyData = useCallback(async () => {
    setDailyLoading(true)
    setDailyError(null)
    try {
      setDailyData(await fetchDailyOyo())
    } catch (error) {
      setDailyError(error instanceof Error ? error.message : 'Unable to load community updates.')
    } finally {
      setDailyLoading(false)
    }
  }, [])

  useEffect(() => { void loadDailyData() }, [loadDailyData])

  useEffect(() => {
    const syncActivity = () => setActivity(notificationService.getNotifications())
    window.addEventListener('dashboardNotificationsChanged', syncActivity)
    return () => window.removeEventListener('dashboardNotificationsChanged', syncActivity)
  }, [])

  const updates = useMemo(() => {
    if (!dailyData) return []
    return [
      ...dailyData.newJobs.map((item) => ({ id: `job-${item.id}`, kind: 'Jobs', title: item.title, detail: [item.employerName, item.location].filter(Boolean).join(' · '), to: `/jobs/${item.id}` })),
      ...dailyData.newBusinesses.map((item) => ({ id: `business-${item.id}`, kind: 'Businesses', title: item.name, detail: [item.category, item.location].filter(Boolean).join(' · '), to: `/business/${item.id}` })),
      ...dailyData.newCommunityReports.map((item) => ({ id: `report-${item.id}`, kind: 'Community', title: item.title, detail: `${item.category} · ${item.status}`, to: `/community/report/${item.id}` })),
    ].slice(0, 3)
  }, [dailyData])

  const notifications = activity
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const inviteFriends = async () => {
    const referralUrl = `${window.location.origin}/signup?ref=${encodeURIComponent(user?.id ?? 'oyoconnect')}`
    try {
      await navigator.clipboard.writeText(referralUrl)
      setInviteCopied(true)
      window.setTimeout(() => setInviteCopied(false), 1800)
    } catch {
      setInviteCopied(false)
    }
  }

  const profileName = user?.name || 'Welcome to OyoConnect'

  return (
    <div className="civic-dashboard">
      <div className="civic-dashboard-grid">
        <div className="civic-dashboard-center">
          <section className="civic-hero" aria-labelledby="civic-hero-title">
            <img className="civic-hero-image" src="/images/oyo-hero.jpg" alt="Oyo State monument and landscape" />
            <div className="civic-hero-overlay" />
            <div className="civic-hero-content">
              <p className="civic-hero-location"><MapPin size={14} aria-hidden="true" /> OYO STATE, NIGERIA</p>
              <h1 id="civic-hero-title">Together for a<br />better Oyo</h1>
              <p className="civic-hero-description">Discover local services, jobs, businesses and community updates near you.</p>
              <div className="civic-hero-search"><SearchBar size="lg" /></div>
            </div>
          </section>

          <section className="civic-feature-grid" aria-label="Explore OyoConnect">
            {featureCards.map(({ title, description, to, icon: Icon, color }) => (
              <Link className="civic-feature-card" key={title} to={to}>
                <span className={`civic-feature-icon is-${color}`}><Icon size={20} aria-hidden="true" /></span>
                <span className="civic-feature-copy"><strong>{title}</strong><small>{description}</small></span>
                <span className="civic-feature-arrow"><ArrowUpRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </section>

          <section className="civic-lower-grid" aria-label="Community updates and events">
            <article className="civic-promo-card">
              <img src="/images/oyo-hero.jpg" alt="Oyo State monument" loading="lazy" />
              <div className="civic-promo-overlay" />
              <div className="civic-promo-content">
                <span>STRONGER TOGETHER</span>
                <h2>A better Oyo<br />is possible</h2>
                <p>Find opportunities, support local businesses and build a stronger community.</p>
                <Button variant="secondary" size="sm" onClick={() => navigate(isAuthenticated ? '/community' : '/signup')}>
                  Be part of OyoConnect <ArrowRight size={15} aria-hidden="true" />
                </Button>
              </div>
            </article>

            <section className="civic-panel" aria-labelledby="civic-updates-title">
              <header className="civic-panel-heading"><div><span>AROUND OYO</span><h2 id="civic-updates-title">Latest Updates</h2></div><Link to="/community">View all <ArrowRight size={14} /></Link></header>
              {dailyLoading ? <div className="civic-data-list" aria-label="Loading updates">{[0, 1, 2].map((item) => <div className="civic-row-skeleton" key={item} />)}</div> : dailyError ? <div className="civic-empty-state"><p>Updates are unavailable right now.</p><button type="button" onClick={() => void loadDailyData()}>Retry</button></div> : updates.length ? <div className="civic-update-list">{updates.map((item) => <Link className="civic-update-row" to={item.to} key={item.id}><span className={`civic-update-icon is-${item.kind.toLowerCase()}`}>{item.kind === 'Jobs' ? <BriefcaseBusiness size={16} /> : item.kind === 'Businesses' ? <Building2 size={16} /> : <MessageCircle size={16} />}</span><span className="civic-update-info"><small className={`civic-tag is-${item.kind.toLowerCase()}`}>{item.kind}</small><strong>{item.title}</strong><em>{item.detail}</em></span><ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div> : <div className="civic-empty-state">No updates yet.</div>}
            </section>

            <section className="civic-panel" aria-labelledby="civic-events-title">
              <header className="civic-panel-heading"><div><span>CONNECT LOCALLY</span><h2 id="civic-events-title">Upcoming Events</h2></div><Link to="/community">View all <ArrowRight size={14} /></Link></header>
              <div className="civic-empty-state civic-events-empty"><CalendarDays size={23} aria-hidden="true" /><strong>No upcoming events yet</strong><p>Check back for local community gatherings.</p></div>
            </section>
          </section>
        </div>

        <aside className="civic-right-column" aria-label="Your account and activity">
          <section className="civic-profile-card">
            <span className="civic-card-eyebrow">YOUR PROFILE</span>
            <div className="civic-profile-person"><Avatar src={user?.avatar} initials={getInitials(user?.name)} size="lg" variant={user?.avatar ? 'image' : 'gradient'} /><span><strong>{profileName}</strong><small>{user?.role?.replace('_', ' ') ?? 'Sign in to manage your profile'}</small></span></div>
            <Link className="civic-profile-button" to={isAuthenticated ? '/profile' : '/login'}>View Profile <ArrowRight size={15} /></Link>
          </section>

          <section className="civic-panel civic-actions-panel">
            <header className="civic-panel-heading"><div><span>GET THINGS DONE</span><h2>Quick Actions</h2></div></header>
            <div className="civic-actions-list">
              {actionItems.map(({ label, to, icon: Icon, color }) => <Link to={to} key={to}><span className={`civic-action-icon is-${color}`}><Icon size={16} /></span><span>{label}</span><ChevronRight size={16} /></Link>)}
              <button type="button" onClick={() => void inviteFriends()}><span className="civic-action-icon is-purple"><Users size={16} /></span><span>{inviteCopied ? 'Referral link copied' : 'Invite Friends'}</span><ChevronRight size={16} /></button>
            </div>
          </section>

          <section className="civic-panel civic-activity-panel">
            <header className="civic-panel-heading"><div><span>YOUR COMMUNITY</span><h2>Recent Activity</h2></div></header>
            {dashboardData.loading && isAuthenticated && !activity.length ? <div className="civic-data-list">{[0, 1, 2].map((item) => <div className="civic-row-skeleton" key={item} />)}</div> : notifications.length ? <div className="civic-activity-list">{notifications.map((item) => <Link to={item.href || '/notifications'} key={item.id} className="civic-activity-row"><span className="civic-activity-icon"><Bell size={15} /></span><span><strong>{item.title}</strong><small>{item.message}</small><em><Clock3 size={12} /> {relativeTime(item.createdAt)}</em></span></Link>)}</div> : <div className="civic-empty-state">No recent activity.</div>}
            <Link to="/notifications" className="civic-view-activity">View all notifications <ChevronRight size={15} /></Link>
          </section>
        </aside>
      </div>
      <div className="civic-dashboard-location"><MapPin size={13} /> {siteConfig.state}</div>
    </div>
  )
}
