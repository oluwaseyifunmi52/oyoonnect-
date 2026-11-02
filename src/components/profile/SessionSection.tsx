import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import './SessionSection.css'

interface SessionSectionProps {
  onSignOut: () => void
}

export function SessionSection({ onSignOut }: SessionSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="session-section">
      <div className="session-section__info">
        <p className="session-section__label">Signed in account</p>
        <p className="session-section__hint">End your session on this device.</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className="session-section__signout"
      >
        <LogOut size={17} aria-hidden="true" />
        <span>Sign out</span>
      </Button>
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Sign out?" size="sm" closeOnOverlayClick={false}>
        <div className="signout-dialog">
          <div className="signout-dialog__icon" aria-hidden="true"><LogOut size={24} /></div>
          <p className="signout-dialog__message">You’ll need to sign in again to use your account.</p>
          <div className="signout-dialog__actions">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={onSignOut}>Sign out</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
