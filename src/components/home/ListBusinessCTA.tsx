import { Store, ArrowRight, UserPlus } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

export function ListBusinessCTA() {
  const { isAuthenticated, user } = useAuth()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault()
      // Navigate to signup with business_owner role pre-selected
      window.location.href = '/register?role=business_owner'
    }
    // If authenticated, let the link work normally to /list-business
  }

  const buttonText = !isAuthenticated 
    ? 'Create free account & list' 
    : user?.role === 'business_owner' 
      ? 'Add your business' 
      : 'Upgrade to list'

  return (
    <section className="cta">
      <div className="container cta__inner">
        <div className="cta__icon" aria-hidden="true">
          <Store size={32} />
        </div>
        <h2 className="cta__title">List your business for free</h2>
        <p className="cta__description">
          Get discovered by customers across Oyo State. Sign up for free and create your business listing in minutes.
        </p>
        <ButtonLink to="/list-business" variant="primary" size="lg" onClick={handleClick}>
          {buttonText}
          <ArrowRight size={18} />
        </ButtonLink>
        {!isAuthenticated && (
          <p className="cta__note">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        )}
        {isAuthenticated && user?.role === 'user' && (
          <p className="cta__note">
            Need a Business Owner account? <a href="/register?role=business_owner">Upgrade here</a>
          </p>
        )}
      </div>
    </section>
  )
}