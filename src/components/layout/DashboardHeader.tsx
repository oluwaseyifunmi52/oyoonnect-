import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound, Wallet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../profile/Avatar'
import { SearchBar } from '../search/SearchBar'
import { WorkspaceSwitcher } from '../WorkspaceSwitcher'
import { notificationService } from '../../services/notificationService'
import type { Notification } from '../../types/notifications'

interface DashboardHeaderProps {
  onMenuClick: () => void
  showWorkspaceSwitcher?: boolean
  workspaceKey?: 'customer' | 'service_provider' | 'business_owner'
}

function initials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
}

function relativeTime(value: string) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime())
  const minutes = Math.floor(elapsed / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function DashboardHeader({ onMenuClick, showWorkspaceSwitcher = false, workspaceKey = 'service_provider' }: DashboardHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(() => notificationService.getNotifications())
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    const syncNotifications = () => setNotifications(notificationService.getNotifications())
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (!notificationRef.current?.contains(target)) setNotificationsOpen(false)
      if (!userRef.current?.contains(target)) setUserMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setNotificationsOpen(false); setUserMenuOpen(false) }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('dashboardNotificationsChanged', syncNotifications)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('dashboardNotificationsChanged', syncNotifications)
    }
  }, [])

  const markAllRead = () => {
    notificationService.markAllAsRead()
    setNotifications((items) => items.map((item) => ({ ...item, read: true })))
    window.dispatchEvent(new Event('dashboardNotificationsChanged'))
  }

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="dashboard-topbar">
      <button className="dashboard-topbar-menu" type="button" onClick={onMenuClick} aria-label="Open navigation">
        <Menu size={21} aria-hidden="true" />
      </button>
      <div className="dashboard-topbar-search"><SearchBar size="md" /></div>
      <div className="dashboard-topbar-actions">
        {showWorkspaceSwitcher && <div className="dashboard-topbar-workspace"><WorkspaceSwitcher activeKey={workspaceKey} /></div>}
        <div className="dashboard-popover-anchor" ref={notificationRef}>
          <button
            className="dashboard-topbar-icon"
            type="button"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-live="polite"
            aria-expanded={notificationsOpen}
            onClick={() => { setNotificationsOpen((open) => !open); setUserMenuOpen(false) }}
          >
            <Bell size={19} aria-hidden="true" />
            {unreadCount > 0 && <span className="dashboard-notification-count">{unreadCount}</span>}
          </button>
          {notificationsOpen && (
            <div className="dashboard-popover dashboard-notifications-popover">
              <div className="dashboard-popover-heading"><strong>Notifications</strong><button type="button" onClick={markAllRead}>Mark all as read</button></div>
              {notifications.length ? notifications.slice(0, 4).map((notification) => {
                const Content = <><span className="dashboard-notification-dot" /><span><strong>{notification.title}</strong><small>{notification.message}</small><em>{relativeTime(notification.createdAt)}</em></span></>
                return notification.href
                  ? <Link className={`dashboard-notification-row${notification.read ? '' : ' is-unread'}`} key={notification.id} to={notification.href} onClick={() => { notificationService.markAsRead(notification.id); setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read: true } : item)); window.dispatchEvent(new Event('dashboardNotificationsChanged')); setNotificationsOpen(false) }}>{Content}</Link>
                  : <div className={`dashboard-notification-row${notification.read ? '' : ' is-unread'}`} key={notification.id}>{Content}</div>
              }) : <p className="dashboard-notification-empty">You’re all caught up.</p>}
              <Link className="dashboard-popover-footer" to="/notifications" state={showWorkspaceSwitcher ? { workspaceKey } : undefined} onClick={() => setNotificationsOpen(false)}>View all notifications <ChevronDown size={14} /></Link>
            </div>
          )}
        </div>
        <span className="dashboard-topbar-separator" />
        {isAuthenticated && user ? (
          <div className="dashboard-popover-anchor" ref={userRef}>
            <button className="dashboard-user-trigger" type="button" aria-expanded={userMenuOpen} onClick={() => { setUserMenuOpen((open) => !open); setNotificationsOpen(false) }}>
              <Avatar src={user.avatar} initials={initials(user.name)} size="sm" variant={user.avatar ? 'image' : 'gradient'} />
              <span><strong>{user.name}</strong><small>{user.role.replace('_', ' ')}</small></span>
              <ChevronDown size={15} aria-hidden="true" />
            </button>
            {userMenuOpen && <div className="dashboard-popover dashboard-user-popover"><Link to="/profile" onClick={() => setUserMenuOpen(false)}><UserRound size={15} /> View Profile</Link><Link to="/settings" onClick={() => setUserMenuOpen(false)}><Settings size={15} /> Settings</Link><Link to="/wallet" onClick={() => setUserMenuOpen(false)}><Wallet size={15} /> Wallet</Link><button type="button" onClick={() => void handleLogout()}><LogOut size={15} /> Log out</button></div>}
          </div>
        ) : <Link className="dashboard-signin-link" to="/login">Sign in</Link>}
      </div>
    </header>
  )
}

export default DashboardHeader
