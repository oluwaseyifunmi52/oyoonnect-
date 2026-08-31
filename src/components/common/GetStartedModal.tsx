import { Building2, UserRound } from 'lucide-react'
import { Modal } from '../common/Modal'
import { ButtonLink } from '../ui/Button'

interface GetStartedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How would you like to use OyoConnect?" size="md">
      <div className="get-started">
        <section className="get-started__option">
          <div className="get-started__icon get-started__icon--business" aria-hidden="true">
            <Building2 size={30} />
          </div>
          <div className="get-started__info">
            <h3 className="get-started__title">Manage a Business</h3>
            <p className="get-started__desc">Register and manage your business on OyoConnect.</p>
          </div>
          <ButtonLink to="/business/register" variant="primary" size="md" className="get-started__cta" onClick={onClose}>
            Manage a Business
          </ButtonLink>
        </section>

        <section className="get-started__option">
          <div className="get-started__icon get-started__icon--user" aria-hidden="true">
            <UserRound size={30} />
          </div>
          <div className="get-started__info">
            <h3 className="get-started__title">Use OyoConnect</h3>
            <p className="get-started__desc">Find businesses, jobs, community and help.</p>
          </div>
          <ButtonLink to="/register" variant="outline" size="md" className="get-started__cta" onClick={onClose}>
            Create Account
          </ButtonLink>
        </section>
      </div>
    </Modal>
  )
}
