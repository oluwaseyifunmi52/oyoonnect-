import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, Bell, BriefcaseBusiness, Building2, ClipboardList, FileText, FolderOpen, Heart, Home, Inbox, LayoutDashboard, LifeBuoy, LogOut,
  MessageCircle, Settings, UserRound, Wallet, Users, DollarSign, Banknote, HelpCircle,
  Image, Star, MessageSquare, BarChart2, ShieldCheck, Search, CreditCard, Receipt, Truck, Zap, Tv, ChevronLeft, ChevronRight,
  GraduationCap, Key, Box, Gamepad2, Smartphone, User, Clapperboard, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

type NavigationItem = { label: string; to: string; icon: LucideIcon; end?: boolean; secondary?: boolean; section?: string }

const platformNavigation: NavigationItem[] = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Jobs', to: '/jobs', icon: BriefcaseBusiness },
  { label: 'Businesses', to: '/businesses', icon: Building2 },
  { label: 'Community', to: '/community', icon: MessageCircle },
  { label: 'Messages', to: '/messages', icon: MessageCircle },
  { label: 'Services', to: '/services', icon: CreditCard },
  { label: 'Wallet', to: '/wallet', icon: Wallet },
  { label: 'Watch', to: '/watch', icon: Clapperboard },
]

const quickAccess: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Post a Job', to: '/jobs/post', icon: BriefcaseBusiness },
  { label: 'List Your Business', to: '/business/register', icon: Building2 },
  { label: 'Report an Issue', to: '/community/report', icon: FileText },
]

const providerNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: '/provider/dashboard', icon: LayoutDashboard, end: true },
  { label: 'My Profile', to: '/provider/profile', icon: UserRound },
  { label: 'My Services', to: '/provider/services', icon: BriefcaseBusiness },
  { label: 'Service Requests', to: '/provider/requests', icon: Inbox },
  { label: 'Work Opportunities', to: '/jobs', icon: BriefcaseBusiness },
]

const jobSeekerNavigation: NavigationItem[] = [
  { label: 'Home', to: '/', icon: Home, end: true },
  { label: 'Jobs', to: '/jobs', icon: BriefcaseBusiness, end: true },
  { label: 'Businesses', to: '/business', icon: Building2 },
  { label: 'Community', to: '/community', icon: MessageCircle },
  { label: 'Messages', to: '/messages', icon: MessageCircle, end: true },
  { label: 'Dashboard', to: '/job-seeker', icon: LayoutDashboard, end: true },
  { label: 'My Applications', to: '/job-seeker#applications', icon: FileText, end: true },
  { label: 'Saved Jobs', to: '/job-seeker#saved', icon: Heart, end: true },
  { label: 'My Profile', to: '/job-seeker#profile', icon: UserRound, end: true },
  { label: 'Browse Jobs', to: '/jobs', icon: BriefcaseBusiness, end: true },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const businessNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: '/business/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Business Profile', to: '/business/profile', icon: Building2 },
  { label: 'Services', to: '/business/services', icon: Settings },
  { label: 'Photos', to: '/business/photos', icon: Image },
  { label: 'Reviews', to: '/business/reviews', icon: Star },
  { label: 'Enquiries', to: '/business/enquiries', icon: MessageSquare },
  { label: 'Analytics', to: '/business/analytics', icon: BarChart2 },
  { label: 'Verification', to: '/business/verification', icon: ShieldCheck },
  { label: 'Settings', to: '/business/settings', icon: Settings },
  { label: 'Find Workers', to: '/services', icon: Search },
  { label: 'Post a Job', to: '/jobs/post', icon: BriefcaseBusiness },
]

const customerNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'My Profile', to: '/profile', icon: User },
  { label: 'Saved Businesses', to: '/saved', icon: Heart },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Account', to: '/account', icon: User },
  { label: 'My Requests', to: '/my-requests', icon: FileText, secondary: true },
  { label: 'Support Requests', to: '/help/requests', icon: HelpCircle, secondary: true },
]

const affiliateNavigation: NavigationItem[] = [
  { label: 'Dashboard', to: '/affiliate', icon: LayoutDashboard, end: true },
  { label: 'Referrals', to: '/affiliate/referrals', icon: Users },
  { label: 'Earnings', to: '/affiliate/earnings', icon: DollarSign },
  { label: 'Withdrawals', to: '/affiliate/withdrawals', icon: Banknote },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const messagesNavigation: NavigationItem[] = [
  { label: 'Messages', to: '/messages', icon: MessageSquare, end: true },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const walletNavigation: NavigationItem[] = [
  { label: 'Wallet', to: '/wallet', icon: Wallet, end: true },
  { label: 'Add Funds', to: '/wallet/fund', icon: CreditCard },
  { label: 'Transactions', to: '/wallet/transactions', icon: Receipt },
  { label: 'All Transactions', to: '/transactions', icon: Receipt },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const servicesNavigation: NavigationItem[] = [
  { label: 'Home', to: '/', icon: Home, end: true },
  { section: 'Services', label: 'Services Home', to: '/services', icon: CreditCard, end: true },
  { label: 'Data Bundles', to: '/services/data', icon: Smartphone },
  { label: 'Airtime', to: '/services/airtime', icon: Smartphone },
  { label: 'Electricity', to: '/services/electricity', icon: Zap },
  { label: 'TV Subscriptions', to: '/services/tv', icon: Tv },
  { label: 'Education', to: '/services/education', icon: GraduationCap },
  { label: 'Recharge PIN', to: '/services/recharge-pin', icon: Key },
  { label: 'Digital Products', to: '/services/digital-products', icon: Box },
  { label: 'Games', to: '/services/games', icon: Gamepad2 },
  { label: 'Social Media', to: '/services/social-media', icon: MessageSquare },
  { section: 'Account', label: 'Wallet', to: '/services/wallet', icon: Wallet },
  { label: 'Profile', to: '/services/profile', icon: User },
]

const adminNavigation: NavigationItem[] = [
  { section: 'Overview', label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { section: 'Management', label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Businesses', to: '/admin/businesses', icon: Building2 },
  { label: 'Business Categories', to: '/admin/categories', icon: FolderOpen },
  { label: 'Jobs', to: '/admin/jobs', icon: BriefcaseBusiness },
  { label: 'Job Applications', to: '/admin/job-applications', icon: ClipboardList },
  { section: 'Community', label: 'Community Reports', to: '/admin/community', icon: MessageCircle },
  { label: 'Comments / Moderation', to: '/admin/community/moderation', icon: FileText },
  { section: 'Support', label: 'Help Requests', to: '/admin/help', icon: LifeBuoy },
  { label: 'Contributions / Payout Review', to: '/admin/payouts', icon: ShieldCheck },
  { section: 'Marketplace', label: 'Service Providers', to: '/admin/providers', icon: Truck },
  { label: 'Services', to: '/admin/services', icon: BriefcaseBusiness },
  { label: 'Service Requests', to: '/admin/service-requests', icon: ClipboardList },
  { section: 'System', label: 'Notifications', to: '/admin/notifications', icon: Bell },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: Activity },
]

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
  mode?: 'platform' | 'provider' | 'jobseeker' | 'business' | 'customer' | 'affiliate' | 'messages' | 'wallet' | 'services' | 'admin'
  onSignOut?: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

function CustomerSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname, hash } = useLocation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login')
  }

  const navItems = customerNavigation
  const availableQuickAccess = quickAccess.filter((item) => item.to !== '/jobs/post' || user?.role === 'business_owner')

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`dashboard-sidebar${open ? ' is-open' : ''} dashboard-sidebar--customer`}
        aria-label="Dashboard navigation"
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-6 text-white hover:opacity-80"
          onClick={onClose}
        >
          <span className="w-8 h-8 flex items-center justify-center border border-white/80 rounded-lg text-sm font-bold">
            OC
          </span>
          <span className="font-semibold text-base">Oyo<span className="font-normal opacity-80">Connect</span></span>
        </Link>
        <nav className="px-3" aria-label="Main">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end ?? to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <hr className="my-4 border-white/20 mx-3" />
        <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">QUICK ACCESS</h2>
        <nav className="px-3" aria-label="Quick access">
          {availableQuickAccess.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const mode = props.mode ?? 'platform'
  if (mode === 'customer') {
    return <CustomerSidebar open={props.open} onClose={props.onClose} />
  }

  return <PlatformDashboardSidebar {...props} mode={mode} />
}

function PlatformDashboardSidebar({ open, onClose, mode = 'platform', onSignOut, collapsed = false, onToggleCollapsed }: DashboardSidebarProps) {
  const { pathname, hash } = useLocation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login')
  }

  const getNavigation = (mode: string): NavigationItem[] => {
    switch (mode) {
      case 'provider': return providerNavigation
      case 'jobseeker': return jobSeekerNavigation
      case 'business': return businessNavigation
      case 'customer': return customerNavigation
      case 'affiliate': return affiliateNavigation
      case 'messages': return messagesNavigation
      case 'wallet': return walletNavigation
      case 'services': return servicesNavigation
      case 'admin': return adminNavigation
      default: return platformNavigation
    }
  }

  const getBrandLink = (mode: string): string => {
    switch (mode) {
      case 'provider': return '/provider/dashboard'
      case 'jobseeker': return '/job-seeker'
      case 'business': return '/business/dashboard'
      case 'customer': return '/dashboard'
      case 'affiliate': return '/affiliate'
      case 'messages': return '/messages'
      case 'wallet': return '/wallet'
      case 'services': return '/services'
      case 'admin': return '/admin/dashboard'
      default: return '/dashboard'
    }
  }

  const showQuickAccess = mode === 'platform'
  const showProudCard = mode === 'platform'
  const availableQuickAccess = quickAccess.filter((item) => item.to !== '/jobs/post' || user?.role === 'business_owner')

  return (
    <>
      {open && <button className="dashboard-sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`dashboard-sidebar dashboard-sidebar--${mode}${open ? ' is-open' : ''}${collapsed && mode === 'services' ? ' is-collapsed' : ''}`} aria-label="Dashboard navigation">
        <div className="dashboard-sidebar-brand-row">
          <Link className="dashboard-sidebar-brand" to={getBrandLink(mode)} onClick={onClose} title={collapsed && mode === 'services' ? 'OyoConnect' : undefined}>
            <span className="dashboard-sidebar-logo" aria-hidden="true">OC</span>
            <span>Oyo<span>Connect</span></span>
          </Link>
          {mode === 'services' && onToggleCollapsed && (
            <button
              type="button"
              className="dashboard-sidebar-collapse"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? 'Expand Services navigation' : 'Collapse Services navigation'}
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          )}
        </div>
        <nav className="dashboard-sidebar-nav" aria-label="Main">
          {getNavigation(mode).map(({ label, to, icon: Icon, end, section }) => (
            <div key={to}>
              {section && <h2 className="dashboard-sidebar-label">{section}</h2>}
              <NavLink
                to={to}
                end={end ?? to === '/'}
                title={collapsed && mode === 'services' ? label : undefined}
                className={({ isActive }) => {
                const tab = mode === 'jobseeker' && to.startsWith('/job-seeker#') ? to.split('#')[1] : null
                const seekerTabActive = tab ? pathname === '/job-seeker' && hash === `#${tab}` : mode === 'jobseeker' && label === 'Dashboard' ? pathname === '/job-seeker' && !hash : false
                const seekerNavigationActive = seekerTabActive || (mode === 'jobseeker' && label === 'Browse Jobs' && pathname === '/jobs') || (mode === 'jobseeker' && label === 'Jobs' && pathname !== '/jobs' && isActive) || (mode === 'jobseeker' && !['Dashboard', 'My Applications', 'Saved Jobs', 'My Profile', 'Browse Jobs', 'Jobs'].includes(label) && isActive)
                const active = mode === 'jobseeker' ? seekerNavigationActive : isActive || (mode === 'provider' && label === 'Dashboard' && pathname === '/provider') || (mode === 'platform' && label === 'Home' && pathname === '/dashboard') || (mode === 'business' && label === 'Dashboard' && pathname === '/business/dashboard') || (String(mode) === 'customer' && label === 'Dashboard' && pathname === '/dashboard') || (mode === 'affiliate' && label === 'Dashboard' && pathname === '/affiliate') || (mode === 'messages' && label === 'Messages' && pathname === '/messages') || (mode === 'wallet' && label === 'Wallet' && pathname === '/wallet') || (mode === 'services' && label === 'Services Home' && ['/services', '/services/dashboard'].includes(pathname))
                return `dashboard-sidebar-link${active ? ' is-active' : ''}`
                }}
                onClick={onClose}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
        {showQuickAccess && <>
          <div className="dashboard-sidebar-divider" />
          <h2 className="dashboard-sidebar-label">QUICK ACCESS</h2>
          <nav className="dashboard-quick-nav" aria-label="Quick access">
            {availableQuickAccess.map(({ label, to, icon: Icon }) => (
              <NavLink className="dashboard-quick-link" key={to} to={to} onClick={onClose}>
                <span><Icon size={20} aria-hidden="true" /></span>{label}
              </NavLink>
            ))}
          </nav>
        </>}
        <div className="dashboard-sidebar-spacer" />
        {showProudCard && <div className="dashboard-proud-card">
          <span className="dashboard-proud-icon" aria-hidden="true">◎</span>
          <span><strong>Proudly Oyo.</strong><small>Built for our people.</small></span>
        </div>}
        <button className="dashboard-sidebar-logout" type="button" title={collapsed && mode === 'services' ? 'Sign out' : undefined} onClick={() => {
          onClose()
          if (onSignOut) onSignOut()
          else void handleLogout()
        }}>
          <LogOut size={20} aria-hidden="true" /><span>Sign out</span>
        </button>
      </aside>
    </>
  )
}
