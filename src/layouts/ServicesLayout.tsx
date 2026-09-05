import { NavLink, Outlet } from 'react-router-dom'
import { CreditCard, Smartphone, Zap, Tv, GraduationCap, Key, Box, Gamepad2, MessageSquare, Wallet, User } from 'lucide-react'
import { Logo } from '../components/layout/Logo'

const SERVICES_NAV = [
  { to: '/services', label: 'Services Home', icon: CreditCard, end: true },
  { to: '/services/data', label: 'Data Bundles', icon: Smartphone },
  { to: '/services/airtime', label: 'Airtime', icon: Smartphone },
  { to: '/services/electricity', label: 'Electricity', icon: Zap },
  { to: '/services/tv', label: 'TV Subscriptions', icon: Tv },
  { to: '/services/education', label: 'Education', icon: GraduationCap },
  { to: '/services/recharge-pin', label: 'Recharge PIN', icon: Key },
  { to: '/services/digital-products', label: 'Digital Products', icon: Box },
  { to: '/services/games', label: 'Games', icon: Gamepad2 },
  { to: '/services/social-media', label: 'Social Media', icon: MessageSquare },
  { to: '/services/wallet', label: 'Wallet', icon: Wallet },
  { to: '/services/profile', label: 'Profile', icon: User },
]

export function ServicesLayout() {
  return (
    <div className="services-layout functional-layout">
      <header className="services-layout__header functional-layout__header">
        <div className="services-layout__header-inner container">
          <NavLink to="/services" end className="services-layout__brand" aria-label="OyoConnect Services home">
            <Logo subtitle link={false} />
          </NavLink>
          <nav className="services-layout__nav" aria-label="Services navigation">
            {SERVICES_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `services-layout__nav-link ${isActive ? 'services-layout__nav-link--active' : ''}`}
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

export default ServicesLayout