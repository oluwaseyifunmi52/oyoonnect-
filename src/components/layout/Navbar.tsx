import { BriefcaseBusiness, Building2, Clapperboard, CreditCard, House, MessageCircle, Sun, Moon, Users, Wallet } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { ButtonLink } from '../ui/Button'
import { useTheme } from '../../context/ThemeContext'
import '../PublicLayout.css'

export function Navbar() {
  const { resolved, setTheme } = useTheme()
  const { pathname } = useLocation()
  const themeClass = resolved === 'dark' ? ' dark' : ''

  return (
    <header className={`navbar${themeClass}`}>
      <div className="navbar__inner container">
        <Logo subtitle />
        <nav className="public-navbar__nav" aria-label="Main navigation">
          <Link to="/"><House size={16} aria-hidden="true" /><span>Home</span></Link>
          <Link to="/jobs"><BriefcaseBusiness size={16} aria-hidden="true" /><span>Jobs</span></Link>
          <Link to="/business"><Building2 size={16} aria-hidden="true" /><span>Businesses</span></Link>
          <Link to="/community"><Users size={16} aria-hidden="true" /><span>Community</span></Link>
          <Link to="/watch"><Clapperboard size={16} aria-hidden="true" /><span>Watch</span></Link>
          <Link to="/messages"><MessageCircle size={16} aria-hidden="true" /><span>Messages</span></Link>
          <Link to="/services" aria-current={pathname.startsWith('/services') ? 'page' : undefined}><CreditCard size={16} aria-hidden="true" /><span>Services</span></Link>
          <Link to="/wallet"><Wallet size={16} aria-hidden="true" /><span>Wallet</span></Link>
        </nav>
        <div className="public-navbar__actions">
          <button
            type="button"
            className="navbar__theme-toggle"
            aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
          >
            {resolved === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          <ButtonLink to="/login" variant="ghost" size="sm">Sign In</ButtonLink>
          <ButtonLink
            to="/signup"
            variant="primary"
            size="sm"
            className="navbar__cta"
          >
            Get Started
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
