import { NavLink, Outlet } from 'react-router-dom'
import { HeartHandshake, ListFilter, PlusCircle } from 'lucide-react'
import { Logo } from '../../components/layout/Logo'

const HELP_NAV: { to: string; label: string; icon: typeof HeartHandshake; end?: boolean }[] = [
  { to: '/help', label: 'Home', icon: HeartHandshake, end: true },
  { to: '/help/requests', label: 'Browse Requests', icon: ListFilter },
  { to: '/help/request', label: 'Request Help', icon: PlusCircle },
]

export function HelpLayout() {
  return (
    <div className="help-layout functional-layout">
      <header className="help-layout__bar functional-layout__header">
        <div className="help-layout__bar-inner container">
          <NavLink to="/help" end className="help-layout__brand" aria-label="OyoConnect Help home">
            <Logo subtitle />
          </NavLink>
          <nav className="help-layout__nav" aria-label="Help section">
            {HELP_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `help-layout__nav-link ${isActive ? 'help-layout__nav-link--active' : ''}`}
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
        <Outlet />
      </main>
    </div>
  )
}

export default HelpLayout