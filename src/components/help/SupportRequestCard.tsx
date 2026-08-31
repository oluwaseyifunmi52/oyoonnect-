import { Link } from 'react-router-dom'
import { MapPin, Users, Clock, Heart, ExternalLink } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { SupportRequest } from '../../types/help'
import { ProgressBar } from './ProgressBar'
import { VerificationBadge } from './VerificationBadge'

interface SupportRequestCardProps {
  request: SupportRequest
  onSupportClick?: (request: SupportRequest) => void
  showFullDescription?: boolean
}

export function SupportRequestCard({
  request,
  onSupportClick,
  showFullDescription = false
}: SupportRequestCardProps) {
  const percentage = request.targetAmount > 0
    ? Math.min(Math.round((request.amountRaised / request.targetAmount) * 100), 100)
    : 0

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(request.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <article className="support-request-card">
      <div className="support-request-card__header">
        <div className="support-request-card__requester">
          <img
            src={request.requesterAvatar || ''}
            alt=""
            className="support-request-card__avatar"
            loading="lazy"
          />
          <div className="support-request-card__requester-info">
            <h3 className="support-request-card__requester-name">{request.requesterName}</h3>
            <div className="support-request-card__meta">
              <span className="support-request-card__location">
                <MapPin size={13} aria-hidden="true" />
                {request.requesterLocation}
              </span>
              <span className="support-request-card__category">{request.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
          </div>
        </div>
        <VerificationBadge status={request.verificationStatus} size="sm" />
      </div>

      <h2 className="support-request-card__title">{request.title}</h2>

      <p className="support-request-card__description">
        {showFullDescription ? request.fullStory : request.description}
      </p>

      <div className="support-request-card__progress">
        <ProgressBar
          value={request.amountRaised}
          max={request.targetAmount}
          showPercentage
          showLabels
          size="md"
        />
        <div className="support-request-card__progress-meta">
          <span className="support-request-card__raised">
            <Heart size={14} aria-hidden="true" />
            {formatCurrency(request.amountRaised, { showDecimals: false })} raised
          </span>
          <span className="support-request-card__target">
            of {formatCurrency(request.targetAmount, { showDecimals: false })} target
          </span>
        </div>
      </div>

      <div className="support-request-card__stats">
        <div className="support-request-card__stat">
          <Users size={16} aria-hidden="true" />
          <span>{request.supportersCount} supporters</span>
        </div>
        <div className="support-request-card__stat">
          <Clock size={16} aria-hidden="true" />
          <span>{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</span>
        </div>
        <div className="support-request-card__stat">
          <span>Deadline: {formatDate(request.deadline)}</span>
        </div>
      </div>

      <div className="support-request-card__actions">
        <button
          type="button"
          className="btn btn--primary btn--md support-request-card__support-btn"
          onClick={() => onSupportClick?.(request)}
        >
          Support
        </button>
        <Link
          to={`/help/requests/${request.id}`}
          className="btn btn--outline btn--md support-request-card__details-btn"
        >
          View Details <ExternalLink size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}