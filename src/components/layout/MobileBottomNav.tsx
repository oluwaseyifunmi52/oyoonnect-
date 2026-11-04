import { BriefcaseBusiness, CreditCard, House, MessageCircle, Users, Wallet } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { messageService } from '../../services/messageService'
import './MobileBottomNav.css'

const destinations = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Jobs', to: '/jobs', icon: BriefcaseBusiness },
  { label: 'Community', to: '/community', icon: Users },
  { label: 'Messages', to: '/messages', icon: MessageCircle },
  { label: 'Services', to: '/services', icon: CreditCard },
  { label: 'Wallet', to: '/wallet', icon: Wallet },
] as const

export function MobileBottomNav() {
  const { pathname } = useLocation()
  const unreadMessages = messageService.getConversations().reduce((total, conversation) => total + conversation.unreadCount, 0)
  const visibleDestinations = pathname === '/' ? destinations.filter(({ label }) => label !== 'Wallet') : destinations

  if (pathname.startsWith('/admin')) return null

  return (
    <nav className={`site-mobile-nav${pathname === '/' ? ' site-mobile-nav--home' : ''}`} aria-label="Mobile navigation">
      {visibleDestinations.map(({ label, to, icon: Icon }) => {
        const active = to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`) || (to === '/wallet' && pathname.startsWith('/community/wallet'))
        return (
          <Link key={label} to={to} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
            <span className="site-mobile-nav__icon"><Icon size={20} aria-hidden="true" />
              {label === 'Messages' && unreadMessages > 0 && <span className="site-mobile-nav__badge">{unreadMessages > 9 ? '9+' : unreadMessages}</span>}
            </span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default MobileBottomNav
