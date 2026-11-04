import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, Building2,
  CalendarDays, ChevronDown, ChevronRight, FileWarning, HeartHandshake, Home as HomeIcon,
  CreditCard, GraduationCap, KeyRound, LogOut, MapPin, Megaphone, Menu, MessageCircle, Monitor, Search, Share2, ShoppingBag, Sparkles, Users, Wallet, Clapperboard,
  Zap,
  X, Gamepad2, Smartphone, Wifi, type LucideIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PublicLayout } from '../components/Layout'
import { AppLayout } from '../components/layout/AppShell'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/layout/Logo'
import { notificationService } from '../services/notificationService'
import {
  homeMockSearchItems, homeMockUser,
  loadHomeEvents, loadHomeNotifications, loadHomeUpdates, loadHomeUser, relativeTime,
} from '../data/homeDashboard'
import type { HomeEvent, HomeNotification, HomeUpdate, HomeUser } from '../data/homeDashboard'
import './HomeDashboard.css'

const locationKey = 'oyoconnect-home-location'
const loggedOutKey = 'oyoconnect-home-logged-out'

const primaryLinks: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Jobs', to: '/jobs', icon: BriefcaseBusiness },
  { label: 'Businesses', to: '/business', icon: Building2 },
  { label: 'Community', to: '/community', icon: Users },
  { label: 'Messages', to: '/messages', icon: MessageCircle },
  { label: 'Wallet', to: '/community/wallet', icon: Wallet },
  { label: 'Watch', to: '/watch', icon: Clapperboard },
  { label: 'Services', to: '/services', icon: CreditCard },
]

const homeServices: { label: string; description: string; to: string; icon: LucideIcon }[] = [
  { label: 'Data Bundles', description: 'Browse network plans', to: '/services/data', icon: Wifi },
  { label: 'Airtime', description: 'Top up a mobile line', to: '/services/airtime', icon: Smartphone },
  { label: 'Electricity', description: 'Utility payments', to: '/services/electricity', icon: Zap },
  { label: 'TV Subscriptions', description: 'Explore TV services', to: '/services/tv', icon: Clapperboard },
  { label: 'Education', description: 'Education services', to: '/services/education', icon: GraduationCap },
  { label: 'Recharge PIN', description: 'PIN products', to: '/services/recharge-pin', icon: KeyRound },
  { label: 'Digital Products', description: 'Browse digital items', to: '/services/digital-products', icon: Monitor },
  { label: 'Games', description: 'Games and entertainment', to: '/services/games', icon: Gamepad2 },
  { label: 'Social Media', description: 'Social media services', to: '/services/social-media', icon: Share2 },
  { label: 'Wallet', description: 'Wallet and transactions', to: '/wallet', icon: Wallet },
]

const features: { title: string; description: string; mobileTitle: string; mobileDescription: string; to: string; mobileTo: string; icon: LucideIcon; mobileIcon: LucideIcon; color: string }[] = [
  { title: 'Nearby places', description: 'Find services and places close to you.', mobileTitle: 'Nearby Places', mobileDescription: 'Find useful places around you.', to: '/nearby', mobileTo: '/nearby', icon: MapPin, mobileIcon: MapPin, color: 'green' },
  { title: 'Jobs and careers', description: 'Find a new role or your next great hire.', mobileTitle: 'Jobs & Careers', mobileDescription: 'Explore job opportunities.', to: '/jobs', mobileTo: '/jobs', icon: BriefcaseBusiness, mobileIcon: BriefcaseBusiness, color: 'teal' },
  { title: 'Local marketplace', description: 'Buy and sell with people in your area.', mobileTitle: 'Local Marketplace', mobileDescription: 'Buy and sell locally.', to: '/marketplace', mobileTo: '/marketplace', icon: ShoppingBag, mobileIcon: ShoppingBag, color: 'orange' },
  { title: 'Community reports', description: 'See local updates and raise an issue.', mobileTitle: 'Community Reports', mobileDescription: 'Report issues in your community.', to: '/community', mobileTo: '/community', icon: FileWarning, mobileIcon: FileWarning, color: 'red' },
  { title: 'Get help', description: 'Find support and helpful local resources.', mobileTitle: 'Get Help', mobileDescription: 'Ask for help or support.', to: '/community/help', mobileTo: '/community/help', icon: HeartHandshake, mobileIcon: HeartHandshake, color: 'blue' },
  { title: 'Games and community', description: 'Play, share and connect with neighbors.', mobileTitle: 'Events & Community', mobileDescription: 'Find events near you.', to: '/services/games', mobileTo: '/community/events', icon: Gamepad2, mobileIcon: CalendarDays, color: 'purple' },
  { title: 'Pay & Top Up', description: 'Data, airtime and bills.', mobileTitle: 'Pay & Top Up', mobileDescription: 'Data, airtime and bills.', to: '/services', mobileTo: '/services', icon: Smartphone, mobileIcon: Smartphone, color: 'green' },
]

const quickActions: { label: string; to: string; icon: LucideIcon; protected?: boolean }[] = [
  { label: 'Post a Job', to: '/jobs/post', icon: BriefcaseBusiness, protected: true },
  { label: 'List a Business', to: '/business/register', icon: Building2, protected: true },
  { label: 'Report an Issue', to: '/community/report', icon: FileWarning, protected: true },
]

function formatEventDate(value: string) {
  const date = new Date(value)
  return { month: date.toLocaleDateString('en-NG', { month: 'short' }).toUpperCase(), day: date.toLocaleDateString('en-NG', { day: '2-digit' }) }
}

function formatEventTime(start: string, end: string) {
  const format = (value: string) => new Date(value).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })
  return `${format(start)} – ${format(end)}`
}

function Home() {
  const { isAuthenticated, user: authUser, logout: authLogout } = useAuth()
  const navigationMode = authUser?.role === 'business_owner'
    ? 'business'
    : authUser?.role === 'service_provider'
      ? 'provider'
      : 'platform'
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedLocation, setSelectedLocation] = useState(() => localStorage.getItem(locationKey) || 'Ibadan')
  const [query, setQuery] = useState('')
  const [suggestionQuery, setSuggestionQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)
  const [user, setUser] = useState<HomeUser | null>(() => localStorage.getItem(loggedOutKey) === 'true' ? null : homeMockUser)
  const [notifications, setNotifications] = useState<HomeNotification[]>([])
  const [updates, setUpdates] = useState<HomeUpdate[]>([])
  const [events, setEvents] = useState<HomeEvent[]>([])
  const [mobileNotifications, setMobileNotifications] = useState(() => notificationService.getNotifications())
  const [loading, setLoading] = useState({ user: true, notifications: true, updates: true, events: true })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [, setClock] = useState(Date.now())
  const searchRef = useRef<HTMLFormElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((item) => !item.read).length
  const mobileUnreadCount = mobileNotifications.filter((item) => !item.read).length

  const loadSection = async (section: 'user' | 'notifications' | 'updates' | 'events') => {
    const loader = { user: loadHomeUser, notifications: loadHomeNotifications, updates: loadHomeUpdates, events: loadHomeEvents }[section]
    setLoading((state) => ({ ...state, [section]: true }))
    setErrors((state) => ({ ...state, [section]: false }))
    try {
      const result = await loader()
      if (section === 'user' && localStorage.getItem(loggedOutKey) !== 'true') setUser(result as HomeUser)
      if (section === 'notifications') setNotifications(result as HomeNotification[])
      if (section === 'updates') setUpdates(result as HomeUpdate[])
      if (section === 'events') setEvents((result as HomeEvent[]).filter((event) => new Date(event.startsAt).getTime() >= Date.now()).sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 3))
    } catch {
      setErrors((state) => ({ ...state, [section]: true }))
    } finally {
      setLoading((state) => ({ ...state, [section]: false }))
    }
  }

  useEffect(() => {
    void Promise.all(['user', 'notifications', 'updates', 'events'].map((item) => loadSection(item as 'user' | 'notifications' | 'updates' | 'events')))
  }, [])

  useEffect(() => {
    const syncNotifications = () => setMobileNotifications(notificationService.getNotifications())
    window.addEventListener('dashboardNotificationsChanged', syncNotifications)
    return () => window.removeEventListener('dashboardNotificationsChanged', syncNotifications)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setSuggestionQuery(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!bellRef.current?.contains(target)) setNotificationsOpen(false)
      if (!userRef.current?.contains(target)) setUserMenuOpen(false)
      if (!searchRef.current?.contains(target)) setSuggestionsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false); setUserMenuOpen(false); setSuggestionsOpen(false); setInviteOpen(false); setMobileMenuOpen(false); setMobileUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('mousedown', closeOnOutside); document.removeEventListener('keydown', closeOnEscape) }
  }, [])

  const filteredEvents = useMemo(() => events.filter((event) => selectedLocation === 'Oyo State' || event.location.toLowerCase().includes(selectedLocation.toLowerCase()) || (selectedLocation.toLowerCase().startsWith('ibadan') && event.location === 'Ibadan')), [events, selectedLocation])
  const filteredUpdates = useMemo(() => updates.filter((item) => selectedLocation === 'Oyo State' || item.location.toLowerCase() === selectedLocation.toLowerCase() || (selectedLocation.toLowerCase().startsWith('ibadan') && item.location === 'Ibadan')), [updates, selectedLocation])
  const suggestions = useMemo(() => {
    if (!suggestionQuery) return []
    return homeMockSearchItems.filter((item) => `${item.title} ${item.description} ${item.location}`.toLowerCase().includes(suggestionQuery.toLowerCase())).slice(0, 6)
  }, [suggestionQuery])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuggestionsOpen(false)
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (selectedLocation) params.set('location', selectedLocation)
    navigate(`/search?${params.toString()}`)
  }

  const goTo = (to: string, protectedAction = false) => {
    if (protectedAction && !user) {
      navigate(`/login?redirect=${encodeURIComponent(to)}`)
      return
    }
    navigate(to)
  }

  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, read: true })))
  const logout = () => { setUser(null); localStorage.setItem(loggedOutKey, 'true'); setUserMenuOpen(false); navigate('/login') }
  const copyReferral = async () => {
    const link = `${window.location.origin}/signup?ref=oyoconnect`
    try { await navigator.clipboard.writeText(link); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { setCopied(false) }
  }

  const renderSkeletons = (count: number, className: string) => <div className={className}>{Array.from({ length: count }, (_, index) => <div className="home-skeleton" key={index} aria-hidden="true" />)}</div>

  const homeContent = (
    <div className={`home-app ${isAuthenticated ? 'home-app--authenticated' : 'home-app--public'}`}>
      <header className="home-mobile-header">
        <Logo />
        <div className="home-mobile-header__actions">
          <Link to="/notifications" className="home-mobile-icon" aria-label={`Notifications, ${mobileUnreadCount} unread`}>
            <Bell size={20} aria-hidden="true" />
            {mobileUnreadCount > 0 && <span className="home-mobile-badge">{mobileUnreadCount > 9 ? '9+' : mobileUnreadCount}</span>}
          </Link>
          {isAuthenticated ? (
            <div className="home-mobile-user-menu">
              <button type="button" className="home-mobile-avatar" aria-label="Account menu" aria-expanded={mobileUserMenuOpen} onClick={() => setMobileUserMenuOpen((open) => !open)}>
                {authUser?.avatar
                  ? <img src={authUser.avatar} alt="" />
                  : <span>{authUser?.name?.trim().charAt(0).toUpperCase() || <Users size={17} aria-hidden="true" />}</span>}
                <i aria-label="Online" />
              </button>
              {mobileUserMenuOpen && <div className="home-mobile-user-popover" role="menu">
                <Link to="/profile" role="menuitem" onClick={() => setMobileUserMenuOpen(false)}>Profile</Link>
                <Link to="/settings" role="menuitem" onClick={() => setMobileUserMenuOpen(false)}>Settings</Link>
                <button type="button" role="menuitem" onClick={async () => { await authLogout(); setMobileUserMenuOpen(false); navigate('/login') }}>Sign out</button>
              </div>}
            </div>
          ) : <Link to="/login" className="home-mobile-avatar" aria-label="Sign in"><Users size={17} aria-hidden="true" /></Link>}
        </div>
      </header>
      <aside className={`home-sidebar ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <Link to="/" className="home-brand" aria-label="OyoConnect home">
          <span className="home-brand-mark"><span>O</span></span>
          <span>Oyo<span>Connect</span></span>
        </Link>
        <nav className="home-primary-nav" aria-label="Primary">
          {primaryLinks.map(({ label, to, icon: Icon }) => (
            <Link key={label} to={to} onClick={() => setMobileMenuOpen(false)} className={`home-nav-link ${location.pathname === to || (to !== '/' && location.pathname.startsWith(to)) ? 'is-active' : ''}`}>
              <Icon size={18} aria-hidden="true" /><span>{label}</span>{label === 'Messages' && <span className="home-nav-bubble">2</span>}{label === 'Wallet' && <span className="home-nav-balance">₦</span>}
            </Link>
          ))}
        </nav>
        <div className="home-sidebar-divider" />
        <p className="home-nav-heading">QUICK ACCESS</p>
        <nav className="home-quick-nav" aria-label="Quick access">
          {quickActions.map(({ label, to, icon: Icon, protected: protectedAction }) => <button key={label} className="home-quick-link" onClick={() => goTo(to, protectedAction)}><span className="home-quick-icon"><Icon size={14} /></span>{label}</button>)}
          <button className="home-quick-link" onClick={() => setInviteOpen(true)}><span className="home-quick-icon"><Share2 size={14} /></span>Invite Friends</button>
        </nav>
        <div className="home-sidebar-spacer" />
        <div className="home-proud-card"><span className="home-map-icon" aria-hidden="true">🇳🇬</span><span><strong>Proudly Oyo.</strong><small>Built for our people.</small></span></div>
        <div className="home-sidebar-bottom"><Link to="/about">About OyoConnect</Link><span>v1.0 · Oyo State, Nigeria</span></div>
      </aside>

      {mobileMenuOpen && <button className="home-mobile-scrim" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" />}

      <div className="home-workspace">
        <header className="home-topbar">
          <button className="home-mobile-menu" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}><Menu size={22} /></button>
          <form className="home-top-search" ref={searchRef} onSubmit={submitSearch} role="search">
            <Search size={18} aria-hidden="true" />
            <input aria-label="Search jobs, businesses and community" value={query} onChange={(event) => { setQuery(event.target.value); setSuggestionsOpen(true) }} onFocus={() => setSuggestionsOpen(true)} placeholder="Search anything in Oyo State..." />
            {query && <button type="button" className="home-clear-search" onClick={() => { setQuery(''); setSuggestionsOpen(false) }} aria-label="Clear search"><X size={15} /></button>}
            {suggestionsOpen && suggestions.length > 0 && <div className="home-suggestions" role="listbox" aria-label="Search suggestions">{(['Jobs', 'Businesses', 'Community'] as const).map((category) => {
              const group = suggestions.filter((item) => item.category === category)
              return group.length ? <div className="home-suggestion-group" key={category}><span className="home-suggestion-label">{category}</span>{group.map((item) => <button type="button" key={item.id} role="option" className="home-suggestion" onClick={() => navigate(item.href)}><span>{item.title}</span><small>{item.location}</small></button>)}</div> : null
            })}</div>}
          </form>
          <div className="home-top-actions">
            <div className="home-popover-anchor" ref={bellRef}>
              <button className="home-icon-button home-notification-button" aria-label={`Notifications, ${unreadCount} unread`} aria-live="polite" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setUserMenuOpen(false) }}><Bell size={19} />{unreadCount > 0 && <span className="home-notification-count">{unreadCount}</span>}</button>
              {notificationsOpen && <div className="home-popover home-notification-popover"><div className="home-popover-heading"><strong>Notifications</strong><button onClick={markAllRead}>Mark all as read</button></div>{notifications.slice(0, 3).map((item) => <Link className={`home-notification-item ${item.read ? '' : 'is-unread'}`} key={item.id} to={item.href} onClick={() => setNotifications((rows) => rows.map((row) => row.id === item.id ? { ...row, read: true } : row))}><span className="home-notification-dot" /><span><strong>{item.title}</strong><small>{item.body}</small><em>{relativeTime(item.createdAt)}</em></span></Link>)}<Link className="home-popover-footer" to="/notifications">View all notifications <ChevronRight size={15} /></Link></div>}
            </div>
            <span className="home-top-divider" />
            <div className="home-popover-anchor" ref={userRef}>
              <button className="home-user-trigger" aria-expanded={userMenuOpen} onClick={() => { setUserMenuOpen((value) => !value); setNotificationsOpen(false) }}><img src={user?.avatar ?? homeMockUser.avatar} alt="" /><span><strong>{user?.name ?? 'Welcome'}</strong><small>{user?.role ?? 'Guest'}</small></span><ChevronDown size={15} /></button>
              {userMenuOpen && <div className="home-popover home-user-popover">{user ? <><Link to="/profile" onClick={() => setUserMenuOpen(false)}>View Profile</Link><Link to="/settings" onClick={() => setUserMenuOpen(false)}>Settings</Link><Link to="/community/wallet" onClick={() => setUserMenuOpen(false)}>Wallet</Link><Button variant="ghost" size="sm" onClick={logout} className="home-user-popover__signout" fullWidth><LogOut size={17} aria-hidden="true" /><span>Sign out</span></Button></> : <Link to="/login" onClick={() => setUserMenuOpen(false)}>Sign in</Link>}</div>}
            </div>
          </div>
        </header>

        <main className="home-main" id="main-content">
          <div className="home-center-column">
            <section className="home-hero" aria-label="Oyo State hero banner">
              <img className="home-hero-image" src="/images/oyo-hero.jpg" alt="Oyo State monument and green landscape" />
              <div className="home-hero-overlay" />
              <div className="home-mobile-hero-content">
                <p className="home-mobile-eyebrow"><MapPin size={14} aria-hidden="true" /> Oyo State, Nigeria</p>
                <h1>Together for a better Oyo</h1>
                <p className="home-mobile-hero-copy">Discover local services, jobs, businesses and community updates near you.</p>
                <form className="home-mobile-hero-search" role="search" onSubmit={submitSearch}>
                  <Search size={19} aria-hidden="true" />
                  <input aria-label="Search OyoConnect" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services, jobs, businesses..." />
                  <button type="submit">Search</button>
                </form>
              </div>
            </section>

            <section className="home-services" aria-labelledby="home-services-title">
              <header className="home-services__heading">
                <div><span className="home-section-kicker">EVERYDAY ESSENTIALS</span><h2 id="home-services-title">Services</h2><p>Access top-ups, bills and digital services in one place.</p></div>
                <Link to="/services">Explore all services <ArrowRight size={15} aria-hidden="true" /></Link>
              </header>
              <div className="home-services__grid">
                {homeServices.map(({ label, description, to, icon: Icon }) => <Link className="home-services__card" key={label} to={to}>
                  <span className="home-services__icon"><Icon size={19} aria-hidden="true" /></span>
                  <span className="home-services__copy"><strong>{label}</strong><small>{description}</small></span>
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>)}
              </div>
            </section>

            <section className="home-features" aria-label="Explore OyoConnect">
              {features.map(({ title, description, mobileTitle, mobileDescription, to, mobileTo, icon: Icon, mobileIcon: MobileIcon, color }) => {
                const payAndTopUp = title === 'Pay & Top Up'
                return <Fragment key={title}>
                  <Link to={to} className={`home-feature-card home-feature-card--desktop${payAndTopUp ? ' home-feature-card--wide' : ''}`}>
                    <span className={`home-feature-icon ${color}`}><Icon size={20} />{payAndTopUp ? <Wifi className="home-feature-icon-wifi" size={11} aria-hidden="true" /> : null}</span>
                    <span className="home-feature-copy"><strong>{title}</strong><small>{description}</small></span>
                    <span className="home-feature-arrow">{payAndTopUp ? <ChevronRight size={16} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}</span>
                  </Link>
                  <Link to={mobileTo} className={`home-feature-card home-feature-card--mobile${payAndTopUp ? ' home-feature-card--wide' : ''}`}>
                    <span className={`home-feature-icon ${color === 'purple' ? 'mint' : color}`}><MobileIcon size={20} />{payAndTopUp ? <Wifi className="home-feature-icon-wifi" size={11} aria-hidden="true" /> : null}</span>
                    <span className="home-feature-copy"><strong>{mobileTitle}</strong><small>{mobileDescription}</small></span>
                    <span className="home-feature-arrow">{payAndTopUp ? <ChevronRight size={16} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}</span>
                  </Link>
                </Fragment>
              })}
            </section>

            <section className="home-lower-grid" aria-label="Community highlights">
              <article className="home-promo-card"><img src="/images/oyo-hero.jpg" alt="Oyo State landmark" loading="lazy" /><div className="home-promo-wash" /><div className="home-promo-content"><span className="home-promo-label">STRONGER TOGETHER</span><h2>A better Oyo<br />is possible</h2><p>Report issues, support local businesses, find opportunities and build a safer community.</p><Link to="/signup" className="home-promo-join">Be part of OyoConnect <span aria-hidden="true">→</span></Link></div></article>
              <section className="home-panel home-updates-panel"><header className="home-panel-heading"><div><span className="home-section-kicker">AROUND OYO</span><h2>Latest updates</h2></div><Link to="/community">View all <ArrowRight size={14} /></Link></header>{loading.updates ? renderSkeletons(3, 'home-update-list') : errors.updates ? <div className="home-error-state">Updates couldn’t load. <button onClick={() => void loadSection('updates')}>Retry</button></div> : filteredUpdates.length ? <div className="home-update-list">{filteredUpdates.slice(0, 3).map((item) => <Link className="home-update-row" to={item.href} key={item.id}><img src={item.image} alt="" loading="lazy" /><span className="home-update-info"><span className={`home-category-tag ${item.category.toLowerCase()}`}>{item.category}</span><strong>{item.title}</strong><small>{item.description} · {item.location}</small></span><time>{relativeTime(item.createdAt)}</time></Link>)}</div> : <p className="home-empty">No local updates in {selectedLocation} yet.</p>}</section>
              <section className="home-panel home-events-panel"><header className="home-panel-heading"><div><span className="home-section-kicker">SAVE THE DATE</span><h2>Upcoming events</h2></div><Link to="/community/events">View all <ArrowRight size={14} /></Link></header>{loading.events ? renderSkeletons(3, 'home-event-list') : errors.events ? <div className="home-error-state">Events couldn’t load. <button onClick={() => void loadSection('events')}>Retry</button></div> : filteredEvents.length ? <div className="home-event-list">{filteredEvents.map((event) => { const date = formatEventDate(event.startsAt); return <Link className="home-event-row" to={event.href} key={event.id}><span className="home-event-date"><small>{date.month}</small><strong>{date.day}</strong></span><span className="home-event-info"><strong>{event.title}</strong><small><MapPin size={12} /> {event.venue} · {event.location}</small><em>{formatEventTime(event.startsAt, event.endsAt)}</em></span><ChevronRight size={16} /></Link> })}</div> : <p className="home-empty">No upcoming events yet.</p>}</section>
            </section>

            <section className="home-mobile-live-section" aria-labelledby="home-mobile-events-title">
              <header className="home-mobile-section-heading">
                <h2 id="home-mobile-events-title"><CalendarDays size={19} aria-hidden="true" /> Upcoming Events</h2>
                <Link to="/community/events">View all</Link>
              </header>
              <div className="home-mobile-live-card">
                <span className="home-mobile-live-icon"><CalendarDays size={20} aria-hidden="true" /></span>
                <span><strong>No live event listings</strong><small>New community events will appear here when available.</small></span>
              </div>
            </section>

            <section className="home-mobile-live-section" aria-labelledby="home-mobile-activity-title">
              <header className="home-mobile-section-heading">
                <h2 id="home-mobile-activity-title"><Megaphone size={19} aria-hidden="true" /> Recent Activity</h2>
                <Link to="/notifications">See more</Link>
              </header>
              {mobileNotifications.length ? <div className="home-mobile-activity-card">
                {mobileNotifications.slice(0, 3).map((item) => <Link to={item.href || '/notifications'} className="home-mobile-activity-item" key={item.id}>
                  <span className="home-mobile-activity-icon"><Bell size={16} aria-hidden="true" /></span>
                  <span><strong>{item.title}</strong><small>{item.message}</small><time>{relativeTime(item.createdAt)}</time></span>
                </Link>)}
              </div> : <div className="home-mobile-live-card">
                <span className="home-mobile-live-icon"><Megaphone size={20} aria-hidden="true" /></span>
                <span><strong>No recent activity</strong><small>Community and account updates will appear here.</small></span>
              </div>}
            </section>
          </div>

          <aside className="home-right-rail" aria-label="Your account and activity">
            <section className="home-profile-card"><span className="home-section-kicker">YOUR PROFILE</span>{loading.user ? <div className="home-profile-loading home-skeleton" /> : errors.user ? <div className="home-error-state">Profile couldn’t load. <button onClick={() => void loadSection('user')}>Retry</button></div> : user ? <><div className="home-profile-person"><img src={user.avatar} alt={`${user.name} avatar`} /><span><strong>{user.name}</strong><small>{user.role}</small></span><span className="home-profile-check">✓</span></div><div className="home-profile-progress"><span><span /></span><small>Profile completeness <strong>75%</strong></small></div><Link to="/profile" className="home-profile-button">View Profile <ArrowRight size={15} /></Link></> : <><div className="home-profile-person"><img src={homeMockUser.avatar} alt="" /><span><strong>Welcome to OyoConnect</strong><small>Sign in to manage your profile</small></span></div><Link to="/login" className="home-profile-button">Sign in <ArrowRight size={15} /></Link></>}</section>

            <section className="home-panel home-actions-panel"><header className="home-panel-heading"><div><span className="home-section-kicker">MAKE IT HAPPEN</span><h2>Quick actions</h2></div></header><div className="home-actions-list">{quickActions.map(({ label, to, icon: Icon, protected: protectedAction }) => <button key={label} onClick={() => goTo(to, protectedAction)}><span className="home-action-icon"><Icon size={17} /></span><span>{label}</span><ChevronRight size={16} /></button>)}<button onClick={() => setInviteOpen(true)}><span className="home-action-icon"><Share2 size={17} /></span><span>Invite Friends</span><ChevronRight size={16} /></button></div></section>

            <section className="home-panel home-activity-panel"><header className="home-panel-heading"><div><span className="home-section-kicker">STAY IN THE LOOP</span><h2>Recent activity</h2></div></header>{loading.notifications ? renderSkeletons(3, 'home-activity-list') : errors.notifications ? <div className="home-error-state">Activity couldn’t load. <button onClick={() => void loadSection('notifications')}>Retry</button></div> : <><div className="home-activity-list">{notifications.slice(0, 3).map((item, index) => <Link to={item.href} className="home-activity-item" key={item.id}><span className={`home-activity-icon activity-${index}`}><Bell size={14} /></span><span><strong>{item.title}</strong><small>{relativeTime(item.createdAt)}</small></span></Link>)}</div><Link to="/notifications" className="home-activity-all">View all notifications <ChevronRight size={15} /></Link></>}</section>

            <section className="home-community-note"><div className="home-note-icon"><HeartHandshake size={19} /></div><strong>Good things grow together.</strong><p>Small actions make a stronger community.</p><button onClick={() => goTo(user ? '/community' : '/signup', !user)}>Explore community <ArrowRight size={14} /></button></section>
            <div className="home-location-note"><MapPin size={13} /> Showing nearby activity in <strong>{selectedLocation}</strong></div>
          </aside>
        </main>

        <footer className="home-footer"><Link to="/" className="home-footer-brand">OyoConnect</Link><nav aria-label="Footer">{[['Home', '/'], ['Explore', '/categories'], ['Jobs', '/jobs'], ['Businesses', '/business'], ['Community', '/community'], ['Reports', '/community']].map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}</nav><span className="home-footer-location"><MapPin size={13} /> Oyo State, Nigeria</span><span className="home-footer-copy">© 2026 OyoConnect</span></footer>
      </div>

      {inviteOpen && <div className="home-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInviteOpen(false) }}><section className="home-invite-modal" role="dialog" aria-modal="true" aria-labelledby="home-invite-title"><button className="home-modal-close" aria-label="Close invite dialog" onClick={() => setInviteOpen(false)}><X size={19} /></button><span className="home-invite-icon"><Share2 size={22} /></span><h2 id="home-invite-title">Invite your people</h2><p>Good things happen when we build Oyo together. Share your link with friends.</p><div className="home-referral-link"><span>oyoconnect.com/signup?ref=oyoconnect</span><button onClick={() => void copyReferral()}>{copied ? 'Copied!' : 'Copy link'}</button></div><div className="home-share-buttons"><a href={`https://wa.me/?text=${encodeURIComponent(`${window.location.origin}/signup?ref=oyoconnect`)}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/signup?ref=oyoconnect`)}`} target="_blank" rel="noreferrer">Share on X</a></div></section></div>}
    </div>
  )

  return isAuthenticated
    ? <AppLayout navigationMode={navigationMode}>{homeContent}</AppLayout>
    : <PublicLayout>{homeContent}</PublicLayout>
}

export default Home
