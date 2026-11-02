import { Shield, Users, MapPin, Folder, Settings, LogOut } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
}

const SIDEBAR_NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Businesses', to: '/categories' },
  { label: 'Community', to: '/community' },
  { label: 'Messages', to: '/messages' },
  { label: 'Wallet', to: '/wallet' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <h2>OyoConnect</h2>
      </div>
      <nav>
        {SIDEBAR_NAV.map((item) => (
          <div
            key={item.label}
            className="sidebar__nav-item"
            style={{
              borderRadius: 'var(--radius)',
              background: 'var(--color-brand-subtle)',
              margin: '4px 0',
            }}
          >
            <span className="sidebar__nav-dot" />
            <span className="sidebar__nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
      <hr className="sidebar__divider" />
      <div className="sidebar__quick-access">
        <h4 className="sidebar__quick-title">Quick Access</h4>
        <a href="/jobs/post" className="sidebar__quick-link">
          Post a Job
        </a>
        <a href="/categories" className="sidebar__quick-link">
          List Your Business
        </a>
        <a href="/community/report" className="sidebar__quick-link">
          Report an Issue
        </a>
      </div>
      <div className="sidebar__bottom">
        <p>Proudly Oyo. Built for our people.</p>
      </div>
    </aside>
  )
}