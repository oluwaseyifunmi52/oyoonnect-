import { LogOut } from 'lucide-react'
import './SessionSection.css'

interface SessionSectionProps {
  onSignOut: () => void
}

export function SessionSection({ onSignOut }: SessionSectionProps) {
  return (
    <div className="session-section">
      <div className="session-section__info">
        <p className="session-section__label">Signed in account</p>
        <p className="session-section__hint">End your session on this device.</p>
      </div>
      <button type="button" className="session-section__signout" onClick={onSignOut}>
        <LogOut size={17} aria-hidden="true" />
        <span>Sign out</span>
      </button>
    </div>
  )
}
