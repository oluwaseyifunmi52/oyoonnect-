import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  House,
  Users,
  HeartPulse,
  Shield,
  Folder,
  Menu,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '@/components/ui/Toast/Toast'
import { ButtonLink, Button } from '../ui/Button'
import { Logo } from './Logo'
import { Modal } from '../ui/Modal'

interface NavItem {
  to: string
  label: string
  icon: typeof Briefcase | typeof Users | typeof HeartPulse | typeof Shield | typeof Folder
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps = {}) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false !== isOpen ? isOpen : window.innerWidth > 768)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  useEffect(() => {
    // Close sidebar on route change when mobile
    const handleRouteChange = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('hashchange', handleRouteChange)
    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('hashchange', handleRouteChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [sidebarOpen])

  const handleClose = () => {
    setSidebarOpen(false)
    onClose?.()
  }

  const handleNavClick = (to: string) => {
    navigate(to)
    handleClose()
  }

  const handleSignOutClick = () => {
    setShowSignOutDialog(true)
  }

  const handleSignOutConfirm = async () => {
    setShowSignOutDialog(false)
    await logout()
    navigate('/')
    handleClose()
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: House },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/business', label: 'Businesses', icon: Folder },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/messages', label: 'Messages', icon: HeartPulse },
    { to: '/wallet', label: 'Wallet', icon: Shield },
  ]

  const quickActions = [
    {
      to: '/jobs/post',
      label: 'Post a Job',
      Icon: Menu,
      bg: '#16a34a',
    },
    {
      to: '/categories',
      label: 'List Your Business',
      Icon: Folder,
      bg: '#16a34a',
    },
    {
      to: '/community/report',
      label: 'Report an Issue',
      Icon: Shield,
      bg: '#dc2626',
    },
  ]

  const isMobile = window.innerWidth <= 768

  return (
    <>
      <aside
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!sidebarOpen}
        onClick={e => e.target === e.currentTarget ? handleClose() : null}
      >
        <header className="sidebar__header">
          <Logo subtitle />
        </header>

        <nav className="sidebar__nav">
          <ul className="sidebar__list" role="list">
            {navLinks.map((item) => (
              <li key={item.to} className="sidebar__item">
                <NavLink
                  to={item.to}
                  className={`sidebar__link ${isMobile ? '' : 'sidebar__link--desktop'}`}
                  onClick={() => handleNavClick(item.to)}
                >
                  <span className="sidebar__link-icon">
                    <item.icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="sidebar__link-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <hr className="sidebar__divider" />

        <div className="sidebar__quick-access">
          <h4 className="sidebar__quick-heading">Quick Access</h4>
          {quickActions.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className="sidebar__quick-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                borderRadius: 'calc(var(--radius) + 2px)',
                background: item.bg === '#16a34a' ? '#ecfdf5' : '#fecaca',
                color: item.bg === '#16a34a' ? '#059669' : '#dc2626',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginTop: '4px',
              }}
            >
              <item.Icon className="w-4 h-4" aria-hidden="true" style={{ marginRight: '4px' }} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {isAuthenticated ? (
          <div className="sidebar__footer" style={{ marginTop: 'auto' }}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSignOutClick}
              aria-label="Sign out of your account"
              className="sidebar__signout"
              fullWidth
            >
              <LogOut size={18} aria-hidden="true" />
              <span>Sign out</span>
            </Button>
            <div className="sidebar__footer-bg" />
            <p className="sidebar__footer-text">
              Proudly Oyo. Built for our people.
            </p>
          </div>
        ) : (
          <>
            <div className="sidebar__bottom">
              <ButtonLink
                to="/login"
                variant="ghost"
                size="sm"
                style={{ width: '100%', marginBottom: '4px' }}
              >
                Sign In
              </ButtonLink>
              <ButtonLink
                to="/signup"
                variant="ghost"
                size="sm"
              >
                Get Started
              </ButtonLink>
            </div>

            <div className="sidebar__footer" style={{ marginTop: 'auto' }}>
              <div className="sidebar__footer-bg" />
              <p className="sidebar__footer-text">
                Proudly Oyo. Built for our people.
              </p>
            </div>
          </>
        )}

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
      </aside>
    </>
  )
}
