import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight, ChevronDown, User, LogOut, Building2, Shield, Heart, Briefcase, Bell, Sun, Moon } from 'lucide-react'
import { siteConfig, type NavItem } from '../../config/site'
import { ButtonLink, Button } from '../ui/Button'
import { Logo } from './Logo'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { notificationService } from '../../services/notificationService'
import type { Notification } from '../../types/notifications'
import { GetStartedModal } from '../common/GetStartedModal'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [getStartedOpen, setGetStartedOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationPanelRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const { user, isAuthenticated, isBusinessOwner, isAdmin, logout } = useAuth()
  const { resolved, setTheme } = useTheme()
  const navigate = useNavigate()

  const loadNotifications = async (force = false) => {
    if (!isAuthenticated) {
      setNotifications([])
      return
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement
      navRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      previousActiveElement.current?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        setOpenSubmenu(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notificationPanelOpen && notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setNotificationPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen, notificationPanelOpen])

  const focusableElementsSelector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open || event.key !== 'Tab') return

    const focusableElements = navRef.current?.querySelectorAll<HTMLElement>(focusableElementsSelector)
    if (!focusableElements || focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label)
  }

  const closeMobileMenu = () => {
    if (window.innerWidth < 860) {
      setOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  function RegularNavItem({ item }: { item: NavItem }) {
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
        onClick={closeMobileMenu}
      >
        {item.label}
      </NavLink>
    )
  }

  function SubmenuItem({ item, openSubmenu, onToggleSubmenu }: { item: NavItem & { submenu: readonly { label: string; to: string }[] }; openSubmenu: string | null; onToggleSubmenu: (label: string) => void }) {
    return (
      <div className="navbar__item navbar__item--has-submenu">
        <div className="navbar__submenu-wrapper">
          <button
            type="button"
            className={`navbar__link navbar__link--submenu-trigger ${openSubmenu === item.label ? 'navbar__link--active' : ''}`}
            onClick={() => onToggleSubmenu(item.label)}
            aria-expanded={openSubmenu === item.label}
            aria-haspopup="true"
          >
            {item.label}
            <ChevronDown size={16} className={`navbar__chevron ${openSubmenu === item.label ? 'navbar__chevron--open' : ''}`} aria-hidden="true" />
          </button>
          {openSubmenu === item.label && (
            <div className="navbar__submenu" role="menu">
              {item.submenu!.map((subItem) => (
                <NavLink
                  key={subItem.to}
                  to={subItem.to}
                  className={({ isActive }) =>
                    `navbar__submenu-link ${isActive ? 'navbar__submenu-link--active' : ''}`}
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  {subItem.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Logo subtitle />

        <nav
          ref={navRef}
          className={`navbar__nav ${open ? 'navbar__nav--open' : ''}`}
          tabIndex={open ? 0 : -1}
          onKeyDown={handleKeyDown}
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => {
            const hasSubmenu = 'submenu' in item && Array.isArray(item.submenu)
            return (
              <div key={item.label} className="navbar__item">
                {hasSubmenu ? (
                  <SubmenuItem item={item as NavItem & { submenu: readonly { label: string; to: string }[] }} openSubmenu={openSubmenu} onToggleSubmenu={toggleSubmenu} />
                ) : (
                  <RegularNavItem item={item} />
                )}
              </div>
            )
          })}

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="navbar__theme-toggle"
                aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
                onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
              >
                {resolved === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              </button>
              <div className="navbar__notification-wrapper" ref={notificationPanelRef}>
                <button
                  type="button"
                  className="navbar__notification-trigger"
                  aria-label={`Notifications${notifications.filter(n => !n.read).length > 0 ? `, ${notifications.filter(n => !n.read).length} unread` : ''}`}
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
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="navbar__notification-badge" aria-hidden="true">
                      {notifications.filter(n => !n.read).length > 99 ? '99+' : notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                {notificationPanelOpen && (
                  <div className="navbar__notification-panel" role="region" aria-label="Notifications">
                    <div className="navbar__notification-panel-header">
                      <h2 className="navbar__notification-panel-title">Notifications</h2>
                      <div className="navbar__notification-panel-actions">
                        {notifications.some(n => !n.read) && (
                          <button
                            type="button"
                            className="navbar__notification-panel-action"
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
                    <div className="navbar__notification-list">
                      {notificationsLoading && notifications.length === 0 ? (
                        <div className="navbar__notification-empty">
                          <div className="navbar__notification-empty-icon">
                            <Bell size={24} aria-hidden="true" />
                          </div>
                          <p className="navbar__notification-empty-title">Loading notifications…</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="navbar__notification-empty">
                          <div className="navbar__notification-empty-icon">
                            <Bell size={24} aria-hidden="true" />
                          </div>
                          <p className="navbar__notification-empty-title">No notifications yet</p>
                          <p className="navbar__notification-empty-text">Important updates from OyoConnect will appear here.</p>
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((notification) => (
                          <div
                            key={notification.id}
                            className={`navbar__notification-item ${notification.read ? '' : 'navbar__notification-item--unread'}`}
                            onClick={() => {
                              if (!notification.read) {
                                notificationService.markAsRead(notification.id)
                                setNotifications(notificationService.getNotifications())
                              }
                            }}
                          >
                            <div className={`navbar__notification-icon navbar__notification-icon--${notification.category}`}>
                              <Bell size={18} aria-hidden="true" />
                            </div>
                            <div className="navbar__notification-content">
                              <div className="navbar__notification-header">
                                <span className="navbar__notification-time">{new Date(notification.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                              </div>
                              <p className="navbar__notification-title">{notification.title}</p>
                              <p className="navbar__notification-message">{notification.message}</p>
                            </div>
                            {!notification.read && (
                              <span className="navbar__notification-unread-dot" aria-hidden="true" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="navbar__notification-footer">
                        <NavLink to="/notifications" onClick={() => setNotificationPanelOpen(false)}>
                          View all notifications
                        </NavLink>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="navbar__user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="navbar__user-trigger"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar__user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" aria-hidden="true" />
                  ) : (
                    <User size={20} aria-hidden="true" />
                  )}
                </div>
                <span className="navbar__user-name">{user?.name}</span>
                <ChevronDown size={16} className={`navbar__chevron ${userMenuOpen ? 'navbar__chevron--open' : ''}`} aria-hidden="true" />
              </button>

              {userMenuOpen && (
                <div className="navbar__user-dropdown" role="menu">
                  <div className="navbar__user-dropdown-header">
                    <div className="navbar__user-dropdown-avatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" aria-hidden="true" />
                      ) : (
                        <User size={24} aria-hidden="true" />
                      )}
                    </div>
                    <div className="navbar__user-dropdown-info">
                      <p className="navbar__user-dropdown-name">{user?.name}</p>
                      <p className="navbar__user-dropdown-email">{user?.email}</p>
                      <span className={`navbar__user-badge ${user?.role}`}>{user?.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <hr className="navbar__user-dropdown-divider" />
                  <NavLink
                    to="/profile"
                    className="navbar__user-dropdown-item"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={18} aria-hidden="true" />
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/notifications"
                    className="navbar__user-dropdown-item"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Bell size={18} aria-hidden="true" />
                    Notifications
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="navbar__user-dropdown-item"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Shield size={18} aria-hidden="true" />
                    Settings
                  </NavLink>
                  <NavLink
                    to="/saved"
                    className="navbar__user-dropdown-item"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Heart size={18} aria-hidden="true" />
                    Saved Businesses
                  </NavLink>
                  {isBusinessOwner && (
                    <>
                      <NavLink
                        to="/business/dashboard"
                        className="navbar__user-dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Building2 size={18} aria-hidden="true" />
                        Business Dashboard
                      </NavLink>
                    </>
                  )}
                  {user?.role === 'user' && (
                    <NavLink
                      to="/become-a-business-owner"
                      className="navbar__user-dropdown-item"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Building2 size={18} aria-hidden="true" />
                      Become a Business Owner
                    </NavLink>
                  )}
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className="navbar__user-dropdown-item"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Shield size={18} aria-hidden="true" />
                      Admin Dashboard
                    </NavLink>
                  )}
                  <hr className="navbar__user-dropdown-divider" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="navbar__user-dropdown-item navbar__user-dropdown-item--logout"
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 14px' }}
                  >
                    <LogOut size={18} aria-hidden="true" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
            </>
          ) : (
            <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
              <button
                type="button"
                className="navbar__theme-toggle"
                aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
                onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
              >
                {resolved === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              </button>
              <ButtonLink to="/login" variant="ghost" size="sm" onClick={closeMobileMenu}>Sign In</ButtonLink>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="navbar__cta"
                onClick={() => { closeMobileMenu(); setGetStartedOpen(true) }}
              >
                Get Started <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="navbar__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <GetStartedModal isOpen={getStartedOpen} onClose={() => setGetStartedOpen(false)} />
    </header>
  )
}

export default Navbar