import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Building2, FolderOpen, Briefcase,
  Users, LifeBuoy, FileText, Settings, LogOut, Menu, X, Crown,
  Bell, Activity, ClipboardList, Truck, ShieldCheck, Server,
} from 'lucide-react'

interface AdminNavItem {
  label: string
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  end?: boolean
}

const NAV_GROUPS: { title: string | null; items: AdminNavItem[] }[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', to: '/admin/users', icon: Users },
      { label: 'Businesses', to: '/admin/businesses', icon: Building2 },
      { label: 'Business Categories', to: '/admin/categories', icon: FolderOpen },
      { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
      { label: 'Job Applications', to: '/admin/job-applications', icon: ClipboardList },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Community Reports', to: '/admin/community', icon: Users },
      { label: 'Comments / Moderation', to: '/admin/community/moderation', icon: FileText },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Requests', to: '/admin/help', icon: LifeBuoy },
      { label: 'Contributions / Payout Review', to: '/admin/payouts', icon: ShieldCheck },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { label: 'Service Providers', to: '/admin/providers', icon: Truck },
      { label: 'Services', to: '/admin/services', icon: Briefcase },
      { label: 'Service Requests', to: '/admin/service-requests', icon: ClipboardList },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Notifications', to: '/admin/notifications', icon: Bell },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
      { label: 'Audit Logs', to: '/admin/audit-logs', icon: Activity },
    ],
  },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setSidebarOpen(false)
  }

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
                <div className="admin-sidebar__subtitle">Administration Workspace</div>
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
                        `admin-nav__item ${isActive ? 'admin-nav__item--active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="admin-nav__icon" aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
              <div className="admin-nav__group-wrap admin-nav__user-section">
                <div className="admin-nav__user">
                  <div className="admin-nav__user-avatar" aria-hidden="true">
                    {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                  </div>
                  <div className="admin-nav__user-info">
                    <span className="admin-nav__user-name">{user?.name ?? 'Administrator'}</span>
                    <span className="admin-nav__user-role">Admin</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-nav__logout"
                  onClick={handleLogout}
                  aria-label="Sign out"
                >
                  <LogOut className="admin-nav__icon" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
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
