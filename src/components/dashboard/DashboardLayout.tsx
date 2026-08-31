import { useState, type ReactNode, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, LogOut, Bell, type LucideIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { WorkspaceSwitcher } from '../WorkspaceSwitcher'
import { notificationService } from '../../services/notificationService'
import type { Notification } from '../../types/notifications'

export interface DashboardNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
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

export function DashboardLayout({ navItems, children, workspaceLabel }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const notificationPanelRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(user?.name)
  const avatar = user?.avatar

  const loadNotifications = async (force = false) => {
    if (force || notificationService.getNotifications().length === 0) {
      setNotificationsLoading(true)
      try {
        const fetched = await notificationService.fetchFromApi()
        setNotifications(fetched)
      } catch {
        setNotifications(notificationService.getNotifications())
      } finally {
        setNotificationsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationPanelOpen && notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setNotificationPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationPanelOpen])

  const unreadCount = notifications.filter(n => !n.read).length

  const sidebar = (
    <div className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <span className="dash-sidebar__logo" aria-hidden="true">OC</span>
        <div>
          <p className="dash-sidebar__name">OyoConnect</p>
          <span className="dash-sidebar__role">{workspaceLabel ?? 'Dashboard'}</span>
        </div>
      </div>

      <nav className="dash-sidebar__nav" aria-label="Dashboard navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `dash-sidebar__link ${isActive ? 'is-active' : ''}`}
            onClick={() => setDrawerOpen(false)}
          >
            <item.icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dash-sidebar__footer">
        <button type="button" className="dash-sidebar__logout" onClick={() => logout()}>
          <LogOut size={18} aria-hidden="true" /> Sign out
        </button>
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

          <div className="dash-topbar__notification-wrapper" ref={notificationPanelRef}>
            <button
              type="button"
              className="dash-topbar__notification-trigger"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={notificationPanelOpen}
              onClick={() => {
                const opening = !notificationPanelOpen
                setNotificationPanelOpen(opening)
                if (opening) {
                  loadNotifications(true)
                }
              }}
            >
              <Bell size={20} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="dash-topbar__notification-badge" aria-hidden="true">
                  {unreadCount > 99 ? '99+' : unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notificationPanelOpen && (
              <div className="dash-topbar__notification-panel" role="region" aria-label="Notifications">
                <div className="dash-topbar__notification-panel-header">
                  <h2 className="dash-topbar__notification-panel-title">Notifications</h2>
                  <div className="dash-topbar__notification-panel-actions">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="dash-topbar__notification-panel-action"
                        onClick={() => {
                          notificationService.markAllAsRead()
                          setNotifications(notificationService.getNotifications())
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                <div className="dash-topbar__notification-list">
                  {notificationsLoading && notifications.length === 0 ? (
                    <div className="dash-topbar__notification-empty">
                      <div className="dash-topbar__notification-empty-icon">
                        <Bell size={24} aria-hidden="true" />
                      </div>
                      <p className="dash-topbar__notification-empty-title">Loading notifications…</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="dash-topbar__notification-empty">
                      <div className="dash-topbar__notification-empty-icon">
                        <Bell size={24} aria-hidden="true" />
                      </div>
                      <p className="dash-topbar__notification-empty-title">No notifications yet</p>
                      <p className="dash-topbar__notification-empty-text">Important updates from OyoConnect will appear here.</p>
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <div
                        key={notification.id}
                        className={`dash-topbar__notification-item ${notification.read ? '' : 'dash-topbar__notification-item--unread'}`}
                        onClick={() => {
                          if (!notification.read) {
                            notificationService.markAsRead(notification.id)
                            setNotifications(notificationService.getNotifications())
                          }
                        }}
                      >
                        <div className={`dash-topbar__notification-icon dash-topbar__notification-icon--${notification.category}`}>
                          <Bell size={18} aria-hidden="true" />
                        </div>
                        <div className="dash-topbar__notification-content">
                          <div className="dash-topbar__notification-header">
                            <span className="dash-topbar__notification-time">{new Date(notification.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <p className="dash-topbar__notification-title">{notification.title}</p>
                          <p className="dash-topbar__notification-message">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="dash-topbar__notification-unread-dot" aria-hidden="true" />
                        )}
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="dash-topbar__notification-footer">
                    <NavLink to="/notifications" onClick={() => setNotificationPanelOpen(false)}>
                      View all notifications
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dash-topbar__user" title={user?.name}>
            {avatar ? (
              <img className="dash-topbar__avatar" src={avatar} alt="" />
            ) : (
              <span className="dash-topbar__avatar" aria-hidden="true">{initials}</span>
            )}
            <span className="dash-topbar__user-name">{user?.name ?? 'Account'}</span>
          </div>
        </header>

        <main className="dash-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
