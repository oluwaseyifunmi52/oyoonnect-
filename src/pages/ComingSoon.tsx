import { Link } from 'react-router-dom'
import { ArrowLeft, Construction, Briefcase } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ButtonLink } from '../components/ui/Button'

interface ComingSoonProps {
  feature: string
  description?: string
}

export function ComingSoon({ feature, description }: ComingSoonProps) {
  return (
    <main className="page coming-soon-page">
      <div className="container container--narrow">
        <div className="coming-soon-card">
          <div className="coming-soon-icon">
            <Construction size={48} />
          </div>
          <h1>{feature}</h1>
          <p className="coming-soon-description">
            {description || `The ${feature} feature is currently under development and will be available soon.`}
          </p>
          <div className="coming-soon-note">
            <p>We're building this feature to work seamlessly with our platform.</p>
            <p>Please check back later or explore other available features.</p>
          </div>
          <div className="coming-soon-actions">
            <ButtonLink to="/" variant="outline">
              <ArrowLeft size={18} />
              Back to Home
            </ButtonLink>
            <ButtonLink to="/jobs" variant="primary">
              <Briefcase size={18} />
              Browse Jobs
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ComingSoon