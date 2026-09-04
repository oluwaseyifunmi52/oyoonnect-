import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Building2, FolderOpen, BadgeCheck, Briefcase,
  Tags, Users, LifeBuoy, FileText, Settings, LogOut, Menu, X, Crown,
} from 'lucide-react'

interface AdminNavItem {
  label: string
  to: string
  icon: typeof Building2
  end?: boolean
}

const NAV_GROUPS: { title: string | null; items: AdminNavItem[] }[] = [
  {
    title: null,
    items: [{ label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Business',
    items: [
      { label: 'Businesses', to: '/admin/businesses', icon: Building2 },
      { label: 'Business Categories', to: '/admin/categories', icon: FolderOpen },
      { label: 'Business Verification', to: '/admin/verification', icon: BadgeCheck },
    ],
  },
  {
    title: 'Jobs',
    items: [
      { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
      { label: 'Job Categories', to: '/admin/job-categories', icon: Tags },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Community', to: '/admin/community', icon: Users },
      { label: 'Help Requests', to: '/admin/help', icon: LifeBuoy },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', to: '/admin/users', icon: Users },
      { label: 'Reports', to: '/admin/reports', icon: FileText },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className="page admin-dashboard">
      <div className="container">
        <div className="admin-layout functional-layout">
          <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
            <div className="admin-sidebar__brand">
              <div className="admin-sidebar__logo" aria-hidden="true">
                <Crown size={20} />
              </div>
              <div>
                <div className="admin-sidebar__name">OyoConnect Admin</div>
                <div className="admin-sidebar__subtitle">Frontend preview</div>
              </div>
            </div>

            <button
              type="button"
              className="admin-sidebar__close"
              aria-label="Close admin navigation"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>

            <nav className="admin-nav" aria-label="Admin navigation">
              {NAV_GROUPS.map((group, gi) => (
                <div key={gi} className="admin-nav__group-wrap">
                  {group.title ? (
                    <div className="admin-nav__group">{group.title}</div>
                  ) : null}
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `admin-nav__item ${isActive ? 'admin-nav__item--active' : ''}`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="admin-nav__icon" aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
              <div className="admin-nav__group-wrap">
                <div className="admin-nav__group">Account</div>
                <NavLink
                  to="/admin/login"
                  className={({ isActive }) => `admin-nav__item ${isActive ? 'admin-nav__item--active' : ''}`}
                >
                  <LogOut className="admin-nav__icon" aria-hidden="true" />
                  <span>Sign Out</span>
                </NavLink>
              </div>
            </nav>
          </aside>

          <div className="admin-content">
            <button
              type="button"
              className="admin-sidebar__toggle"
              aria-label="Open admin navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
              <span>Admin Menu</span>
            </button>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminLayout
