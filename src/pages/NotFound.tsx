import { Compass } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'

function NotFound() {
  return (
    <main className="page">
      <div className="container">
        <div className="not-found">
          <p className="not-found__code">404</p>
          <div className="not-found__icon" aria-hidden="true">
            <Compass size={40} />
          </div>
          <h1 className="not-found__title">Page not found</h1>
          <p className="not-found__text">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="not-found__actions">
            <ButtonLink to="/" variant="primary">
              Back to home
            </ButtonLink>
            <ButtonLink to="/search" variant="outline">
              Explore businesses
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFound