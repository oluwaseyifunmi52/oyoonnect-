import { Link } from 'react-router-dom'
import { Building2, LogIn, UserPlus, ArrowLeft } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'

export function BusinessPortal() {
  return (
    <main className="page business-portal-page">
      <div className="container container--narrow">
        <Link to="/" className="auth-back-link" aria-label="Back to home">
          <ArrowLeft size={20} />
        </Link>

        <header className="business-portal__header">
          <div className="business-portal__brand" aria-hidden="true">
            <Building2 size={40} />
          </div>
          <h1 className="business-portal__title">Business Portal</h1>
          <p className="business-portal__subtitle">
            Manage your business listing, services, reviews, and more on OyoConnect.
          </p>
        </header>

        <div className="business-portal__sections">
          <section className="business-portal-card">
            <div className="business-portal-card__icon" aria-hidden="true">
              <LogIn size={26} />
            </div>
            <div className="business-portal-card__body">
              <h2 className="business-portal-card__title">Already have a business account?</h2>
              <p className="business-portal-card__desc">
                Sign in to manage your existing business profile and dashboard.
              </p>
            </div>
            <ButtonLink to="/login" variant="primary" size="lg" className="business-portal-card__cta">
              Sign In
            </ButtonLink>
          </section>

          <section className="business-portal-card business-portal-card--highlight">
            <div className="business-portal-card__icon" aria-hidden="true">
              <UserPlus size={26} />
            </div>
            <div className="business-portal-card__body">
              <h2 className="business-portal-card__title">New to OyoConnect?</h2>
              <p className="business-portal-card__desc">
                Register your business in a few easy steps and get discovered by customers.
              </p>
            </div>
            <ButtonLink to="/business/register" variant="primary" size="lg" className="business-portal-card__cta">
              Register Your Business
            </ButtonLink>
          </section>
        </div>

        <footer className="business-portal__footer">
          <p>Prefer to browse before signing up?</p>
          <Link to="/search" className="auth-link">Explore businesses</Link>
        </footer>
      </div>
    </main>
  )
}

export default BusinessPortal
