import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { Modal } from '../common/Modal'
import { ButtonLink } from '../ui/Button'

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  actionLabel: string
  hint?: ReactNode
}

export function AuthRequiredModal({ isOpen, onClose, actionLabel, hint }: AuthRequiredModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign in to continue" size="sm">
      <div className="auth-required">
        <div className="auth-required__icon" aria-hidden="true">
          <Lock size={32} />
        </div>
        <p className="auth-required__text">
          You need an OyoConnect account to {actionLabel}.
        </p>
        {hint && <p className="auth-required__hint">{hint}</p>}
        <div className="auth-required__actions">
          <ButtonLink to="/login" variant="primary" size="lg" className="w-full" onClick={onClose}>
            Sign In
          </ButtonLink>
          <ButtonLink to="/register" variant="outline" size="lg" className="w-full" onClick={onClose}>
            Create Account
          </ButtonLink>
        </div>
        <p className="auth-required__note">
          Browsing is free — you only need an account for this action.
        </p>
      </div>
    </Modal>
  )
}
