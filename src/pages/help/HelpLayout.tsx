import { NavLink, Outlet } from 'react-router-dom'
import { ListFilter, PlusCircle } from 'lucide-react'
import { Logo } from '../../components/layout/Logo'
import { PLATFORM_NAV } from '../../components/navigation/PlatformNav'

const HELP_NAV = [
  ...PLATFORM_NAV,
  { to: '/help/requests', label: 'Browse Requests', icon: ListFilter },
  { to: '/help/request', label: 'Request Help', icon: PlusCircle },
]

export function HelpLayout() {
  return (
    <div className="help-layout functional-layout">
      <header className="help-layout__bar functional-layout__header">
        <div className="help-layout__bar-inner container">
          <NavLink to="/" end className="help-layout__brand" aria-label="OyoConnect home">
            <Logo subtitle link={false} />
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