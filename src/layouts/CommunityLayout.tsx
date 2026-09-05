import { NavLink, Outlet } from 'react-router-dom'
import { MessageSquare, AlertTriangle } from 'lucide-react'
import { Logo } from '../components/layout/Logo'

const COMMUNITY_NAV = [
  { to: '/community', label: 'Community', icon: MessageSquare, end: true },
  { to: '/community/report', label: 'Report Issue', icon: AlertTriangle },
]

export function CommunityLayout() {
  return (
    <div className="community-layout functional-layout">
      <header className="community-layout__header functional-layout__header">
        <div className="community-layout__header-inner container">
          <NavLink to="/community" end className="community-layout__brand" aria-label="OyoConnect Community home">
            <Logo subtitle link={false} />
          </NavLink>
          <nav className="community-layout__nav" aria-label="Community navigation">
            {COMMUNITY_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `community-layout__nav-link ${isActive ? 'community-layout__nav-link--active' : ''}`}
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

export default CommunityLayout