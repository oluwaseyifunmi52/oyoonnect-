import { NavLink, Outlet } from 'react-router-dom'
import { CreditCard, Smartphone, Zap, Tv, GraduationCap, Key, Box, Gamepad2, MessageSquare, Wallet, User } from 'lucide-react'
import { Logo } from '../components/layout/Logo'

const SERVICES_CUSTOMER_NAV = [
  { to: '/services', label: 'Services', icon: CreditCard, end: true },
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

export function ServicesCustomerLayout() {
  return (
    <div className="services-customer-layout functional-layout">
      <header className="services-customer-layout__header functional-layout__header">
        <div className="services-customer-layout__header-inner container">
          <NavLink to="/services" end className="services-customer-layout__brand" aria-label="OyoConnect Services home">
            <Logo subtitle />
          </NavLink>
          <nav className="services-customer-layout__nav" aria-label="Services navigation">
            {SERVICES_CUSTOMER_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `services-customer-layout__nav-link ${isActive ? 'services-customer-layout__nav-link--active' : ''}`}
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

export default ServicesCustomerLayout