import { Clapperboard, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ButtonLink } from '../ui/Button'
import { useTheme } from '../../context/ThemeContext'
import '../PublicLayout.css'

export function Navbar() {
  const { resolved, setTheme } = useTheme()
  const themeClass = resolved === 'dark' ? ' dark' : ''

  return (
    <header className={`navbar${themeClass}`}>
      <div className="navbar__inner container">
        <Logo subtitle />
        <div className="public-navbar__actions">
          <Link className="navbar__watch-link" to="/watch"><Clapperboard size={17} aria-hidden="true" /><span>Watch</span></Link>
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
