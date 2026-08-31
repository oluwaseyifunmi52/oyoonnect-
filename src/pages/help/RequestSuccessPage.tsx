import { Link } from 'react-router-dom'
import { CheckCircle, Shield } from 'lucide-react'
import { ButtonLink } from '../../components/ui/Button'

export function RequestSuccessPage() {
  return (
    <div className="request-success-page">
      <div className="container request-success-page__container">
        <div className="request-success-page__card">
          <div className="request-success-page__icon">
            <CheckCircle size={64} aria-hidden="true" />
          </div>

          <h1 className="request-success-page__title">Request Submitted Successfully</h1>
          <p className="request-success-page__subtitle">
            Your request has been submitted for review. You will be notified when
            its status changes.
          </p>

          <div className="request-success-page__status">
            <div className="request-success-page__status-badge">
              <Shield size={20} aria-hidden="true" />
              <span>Under Review</span>
            </div>
            <p className="request-success-page__status-note">
              Your request is <strong>not yet visible</strong> to the community. Our team
              will review it within 24-48 hours.
            </p>
          </div>

          <div className="request-success-page__steps">
            <h3 className="request-success-page__steps-title">What happens next?</h3>
            <ol className="request-success-page__steps-list">
              <li>
                <span className="request-success-page__step-number">1</span>
                <div>
                  <strong>Document Verification</strong>
                  <p>Our team reviews your supporting documents and details.</p>
                </div>
              </li>
              <li>
                <span className="request-success-page__step-number">2</span>
                <div>
                  <strong>Approval & Publication</strong>
                  <p>If approved, your request goes live for community support.</p>
                </div>
              </li>
              <li>
                <span className="request-success-page__step-number">3</span>
                <div>
                  <strong>Receive Support</strong>
                  <p>Community members can support your request. Funds held securely.</p>
                </div>
              </li>
              <li>
                <span className="request-success-page__step-number">4</span>
                <div>
                  <strong>Funds Transfer</strong>
                  <p>Upon completion, funds are transferred to your verified account.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="request-success-page__actions">
            <ButtonLink to="/help/requests" variant="primary" size="lg">
              View Requests
            </ButtonLink>
            <ButtonLink to="/help" variant="outline" size="lg">
              Back to Help
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestSuccessPage
