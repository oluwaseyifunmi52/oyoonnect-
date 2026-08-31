import { Link } from 'react-router-dom'
import { Shield, Home, ArrowLeft, Building2 } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { user, isAdmin, isBusinessOwner } = useAuth()

  const getRedirectPath = () => {
    if (isAdmin) return '/admin'
    if (isBusinessOwner) return '/business/dashboard'
    if (user) return '/profile'
    return '/'
  }

  const redirectLabel = () => {
    if (isAdmin) return 'Admin Dashboard'
    if (isBusinessOwner) return 'Business Dashboard'
    if (user) return 'My Profile'
    return 'Home'
  }

  return (
    <main className="page auth-page">
      <div className="container container--narrow">
        <div className="auth-card unauthorized-card">
          <div className="unauthorized-icon">
            <Shield size={48} />
          </div>
          <h1>Business Owner Access Required</h1>
          <p className="unauthorized-message">
            This area is available to Business Owners only.
          </p>
          <p className="unauthorized-detail">
            {user ? (
              <>
                Your account (<strong>{user.role.replace('_', ' ')}</strong>) doesn't have Business Owner access.
                Upgrade your account to create and manage business listings, access analytics, and more.
              </>
            ) : (
              'Please sign in with a Business Owner account to access this area.'
            )}
          </p>

          <div className="unauthorized-actions">
            {user?.role === 'user' && (
              <ButtonLink to="/become-a-business-owner" variant="primary" size="lg">
                <Building2 size={18} aria-hidden="true" />
                Become a Business Owner
              </ButtonLink>
            )}
            <ButtonLink to={getRedirectPath()} variant="primary" size="lg">
              <Home size={18} aria-hidden="true" />
              Go to {redirectLabel()}
            </ButtonLink>
            {!user && (
              <ButtonLink to="/login" variant="outline" size="lg">
                <ArrowLeft size={18} aria-hidden="true" />
                Sign In
              </ButtonLink>
            )}
          </div>

          <p className="unauthorized-help">
            Think this is a mistake?{' '}
            <Link to="/help" className="auth-link">Contact support</Link>
          </p>
        </div>
      </div>
    </main>
  )
}