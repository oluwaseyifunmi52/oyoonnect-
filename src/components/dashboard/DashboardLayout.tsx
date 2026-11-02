import { useState, type ReactNode, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Bell, Menu, LogOut, type LucideIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationService } from '../../services/notificationService'
import { SearchBar } from '../search/SearchBar'
import { WorkspaceSwitcher } from '../WorkspaceSwitcher'
import { Avatar } from '../profile/Avatar'
import { PLATFORM_NAV, type PlatformNavItem } from '../navigation/PlatformNav'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export interface DashboardNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  secondary?: boolean
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

interface DashboardLayoutProps {
  navItems: DashboardNavItem[]
  children: ReactNode
  /** Optional text shown under the brand, e.g. "Customer". */
  workspaceLabel?: string
}

function renderSidebarLink(
  item: DashboardNavItem | PlatformNavItem,
  secondary: boolean,
  onClose: () => void,
) {
  const { to, label, icon: Icon, end } = item
  return (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) =>
        `dash-sidebar__link${secondary ? ' dash-sidebar__link--secondary' : ''}${isActive ? ' is-active' : ''}`
      }
      onClick={onClose}
    >
      <Icon size={17} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}

export function DashboardLayout({ navItems, children, workspaceLabel }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(() => notificationService.getNotifications().filter((item) => !item.read).length)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  useEffect(() => {
    const syncUnreadCount = () => setUnreadCount(notificationService.getNotifications().filter((item) => !item.read).length)
    window.addEventListener('dashboardNotificationsChanged', syncUnreadCount)
    return () => window.removeEventListener('dashboardNotificationsChanged', syncUnreadCount)
  }, [])

  const initials = getInitials(user?.name)

  const primary = navItems.filter((item) => !item.secondary)
  const secondary = navItems.filter((item) => item.secondary)
  const workspaceSectionLabel = workspaceLabel ?? 'JOB SEEKER'
  const closeDrawer = () => setDrawerOpen(false)

  const handleSignOutClick = () => {
    setShowSignOutDialog(true)
  }

  const handleSignOutConfirm = async () => {
    setShowSignOutDialog(false)
    await logout()
  }

  const sidebar = (
    <div className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <span className="dash-sidebar__logo" aria-hidden="true">OC</span>
        <div>
          <p className="dash-sidebar__name">OyoConnect</p>
        </div>
      </div>

      <nav className="dash-sidebar__nav" aria-label="Platform and workspace navigation">
        <div className="dash-sidebar__section-label" aria-hidden="true">OyoConnect</div>
        {PLATFORM_NAV.map((item) => renderSidebarLink(item, false, closeDrawer))}

        <div className="dash-sidebar__divider" aria-hidden="true" />

        <div className="dash-sidebar__section-label" aria-hidden="true">{workspaceSectionLabel}</div>
        {primary.map((item) => renderSidebarLink(item, false, closeDrawer))}

        {secondary.length > 0 && (
          <>
            <div className="dash-sidebar__divider" aria-hidden="true" />
            {secondary.map((item) => renderSidebarLink(item, true, closeDrawer))}
          </>
        )}
      </nav>

      <div className="dash-sidebar__footer">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSignOutClick}
          aria-label="Sign out of your account"
          className="dash-sidebar__logout"
          fullWidth
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className={`dash-layout ${drawerOpen ? 'dash-layout--drawer-open' : ''}`}>
      <aside className="dash-sidebar-wrap" aria-label="Primary">
        {sidebar}
      </aside>

      {drawerOpen && <div className="dash-drawer__overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            type="button"
            className="dash-topbar__menu-btn"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="dash-topbar__lead">
            <WorkspaceSwitcher />
          </div>

          {pathname === '/notifications' && <div className="dash-topbar__search"><SearchBar size="md" /></div>}

          <Link className="dash-topbar__notifications" to="/notifications" aria-label={`Notifications, ${unreadCount} unread`}>
            <Bell size={19} aria-hidden="true" />
            {unreadCount > 0 && <span className="dash-topbar__notification-count">{unreadCount}</span>}
          </Link>

          <div className="dash-topbar__user" title={user?.name}>
            <Avatar src={user?.avatar} initials={initials} size="sm" variant={user?.avatar ? 'image' : 'gradient'} />
            <span className="dash-topbar__user-name">{user?.name ?? 'Account'}</span>
          </div>
        </header>

        <main className="dash-content" id="main-content">
          {children}
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={showSignOutDialog}
        onClose={() => setShowSignOutDialog(false)}
        title="Sign out?"
        size="sm"
        closeOnOverlayClick={false}
        closeOnEscape={true}
      >
        <div className="signout-dialog">
          <div className="signout-dialog__icon" aria-hidden="true">
            <LogOut size={28} />
          </div>
          <p className="signout-dialog__message">
            Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
          </p>
          <div className="signout-dialog__actions">
            <Button variant="outline" onClick={() => setShowSignOutDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSignOutConfirm}>
              Sign out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
