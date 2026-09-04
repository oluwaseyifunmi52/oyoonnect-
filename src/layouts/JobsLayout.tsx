import { NavLink, Outlet } from 'react-router-dom'
import { Briefcase, Plus, Search } from 'lucide-react'
import { Logo } from '../components/layout/Logo'

const JOBS_NAV = [
  { to: '/jobs', label: 'Find Jobs', icon: Briefcase, end: true },
  { to: '/jobs', label: 'Search', icon: Search },
  { to: '/jobs/post', label: 'Post a Job', icon: Plus },
]

export function JobsLayout() {
  return (
    <div className="jobs-layout functional-layout">
      <header className="jobs-layout__header functional-layout__header">
        <div className="jobs-layout__header-inner container">
          <NavLink to="/jobs" end className="jobs-layout__brand" aria-label="OyoConnect Jobs home">
            <Logo subtitle />
          </NavLink>
          <nav className="jobs-layout__nav" aria-label="Jobs navigation">
            {JOBS_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `jobs-layout__nav-link ${isActive ? 'jobs-layout__nav-link--active' : ''}`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="functional-layout__main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default JobsLayout