import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { Logo } from './Logo'
import { ButtonLink, Button } from '../ui/Button'
import { useTheme } from '../../context/ThemeContext'

export function Navbar() {
  const { resolved, setTheme } = useTheme()
  const navigate = useNavigate()

  const themeClass = resolved === 'dark' ? ' dark' : ''

  return (
    <header className={`navbar${themeClass}`}>
      <div className="navbar__inner container">
        <Logo subtitle />
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
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => navigate('/get-started')}
            className="navbar__cta"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
