import { Briefcase } from 'lucide-react'
import { ButtonLink } from '../ui/Button'

export function CreateOpportunityCard() {
  return (
    <div className="create-opportunity-card">
      <div className="create-opportunity-card__content">
        <h3 className="create-opportunity-card__title">Create Opportunity</h3>
        <p className="create-opportunity-card__desc">
          Post a job and connect with thousands of talented people across Oyo State.
        </p>
        <ButtonLink
          to="/jobs/post"
          variant="outline"
          size="md"
          className="create-opportunity-card__btn"
        >
          + Post a Job
        </ButtonLink>
      </div>
      <div
        className="create-opportunity-card__illustration"
        aria-hidden="true"
      >
        <Briefcase size={60} />
      </div>
    </div>
  )
}
