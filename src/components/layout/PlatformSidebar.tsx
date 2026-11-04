import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react'
import { PLATFORM_NAV } from '../navigation/PlatformNav'
import { Logo } from './Logo'
import { Avatar } from '../profile/Avatar'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ButtonLink } from '../ui/Button'
import './PlatformSidebar.css'

function getInitials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
}

export function PlatformSidebar() {
  const { user, isAuthenticated, initializing, loading, logout } = useAuth()
  const { resolved, setTheme } = useTheme()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      if (!mobile) setDrawerOpen(false)
    }
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (!drawerOpen || !isMobile) return
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    sidebarRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setDrawerOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !sidebarRef.current) return
      const focusable = Array.from(sidebarRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [drawerOpen, isMobile])

  const closeDrawer = () => setDrawerOpen(false)

  const handleLogout = async () => {
    closeDrawer()
    await logout()
    navigate('/login')
  }

  return (
    <>
      <header className="platform-mobile-bar">
        <button
          ref={menuButtonRef}
          type="button"
          className="platform-mobile-menu"
          aria-label={drawerOpen ? 'Close main navigation' : 'Open main navigation'}
          aria-controls="platform-sidebar"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((open) => !open)}
        >
          {drawerOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
        <Logo />
      </header>

      {isMobile && drawerOpen && (
        <button
          type="button"
          className="platform-sidebar-backdrop"
          aria-label="Close main navigation"
          onClick={closeDrawer}
        />
      )}

      <aside
        ref={sidebarRef}
        id="platform-sidebar"
        className={`platform-sidebar${drawerOpen ? ' is-open' : ''}`}
        aria-label="OyoConnect platform sidebar"
        aria-hidden={isMobile ? !drawerOpen : undefined}
      >
        <div className="platform-sidebar-brand"><Logo subtitle /></div>

        <nav className="platform-sidebar-nav" aria-label="Main navigation">
          {PLATFORM_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end ?? to === '/'}
              onClick={closeDrawer}
              className={({ isActive }) => `platform-sidebar-link${isActive ? ' is-active' : ''}`}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="platform-sidebar-bottom">
          <button
            type="button"
            className="platform-theme-toggle"
            aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
          >
            {resolved === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            <span>{resolved === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {initializing || loading ? (
            <div className="platform-sidebar-auth-status" aria-label="Loading account" aria-busy="true" />
          ) : isAuthenticated && user ? (
            <div className="platform-sidebar-account">
              <Link to="/profile" className="platform-sidebar-profile" onClick={closeDrawer}>
                <Avatar src={user.avatar} initials={getInitials(user.name)} size="sm" variant={user.avatar ? 'image' : 'gradient'} />
                <span><strong>{user.name}</strong><small>My account</small></span>
                <UserRound size={16} aria-hidden="true" />
              </Link>
              <Link to="/settings" className="platform-sidebar-account-link" onClick={closeDrawer}>Settings</Link>
              <button type="button" className="platform-sidebar-account-link" onClick={() => void handleLogout()}>
                <LogOut size={16} aria-hidden="true" /> Sign out
              </button>
            </div>
          ) : (
            <div className="platform-sidebar-auth">
              <ButtonLink to="/login" variant="outline" size="md" fullWidth onClick={closeDrawer}>Sign In</ButtonLink>
              <ButtonLink to="/signup" variant="primary" size="md" fullWidth onClick={closeDrawer}>Get Started</ButtonLink>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default PlatformSidebar
