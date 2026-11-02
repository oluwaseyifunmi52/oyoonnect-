import { Link } from 'react-router-dom'
import { MapPin, Users, Clock, Heart, ExternalLink, CalendarDays } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { getCategoryById, type SupportRequest } from '../../types/help'
import { ProgressBar } from './ProgressBar'
import { VerificationBadge } from './VerificationBadge'
import { StatusBadge } from './StatusBadge'
import { HelpIcon } from './IconMapping'

interface SupportRequestCardProps {
  request: SupportRequest
  onSupportClick?: (_request: SupportRequest) => void
  showFullDescription?: boolean
}

export function SupportRequestCard({
  request,
  onSupportClick,
  showFullDescription = false
}: SupportRequestCardProps) {
  const deadlineTime = request.deadline ? new Date(request.deadline).getTime() : Number.NaN
  const daysLeft = Number.isNaN(deadlineTime)
    ? null
    : Math.max(0, Math.ceil((deadlineTime - Date.now()) / (1000 * 60 * 60 * 24)))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'Date unavailable'
    return date.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <article className="support-request-card" role="listitem">
      <div className="support-request-card__header">
        <div className="support-request-card__requester">
          {request.requesterAvatar
            ? <img src={request.requesterAvatar} alt="" className="support-request-card__avatar" loading="lazy" />
            : <span className="support-request-card__avatar support-request-card__avatar--fallback" aria-hidden="true"><HelpIcon name={getCategoryById(request.category)?.icon ?? 'heart'} size={19} /></span>}
          <div className="support-request-card__requester-info">
            {request.requesterName && <h3 className="support-request-card__requester-name">{request.requesterName}</h3>}
            <div className="support-request-card__meta">
              {request.requesterLocation && <span className="support-request-card__location"><MapPin size={13} aria-hidden="true" />{request.requesterLocation}</span>}
              <span className="support-request-card__category">{getCategoryById(request.category)?.label ?? request.category}</span>
            </div>
          </div>
        </div>
        <div className="support-request-card__badges">
          <VerificationBadge status={request.verificationStatus} size="sm" />
          <StatusBadge status={request.status} size="sm" />
        </div>
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
          <CalendarDays size={15} aria-hidden="true" />
          <span>Posted {formatDate(request.createdAt)}</span>
        </div>
        <div className="support-request-card__stat">
          <Users size={16} aria-hidden="true" />
          <span>{request.supportersCount} supporters</span>
        </div>
        {daysLeft !== null && <div className="support-request-card__stat">
          <Clock size={16} aria-hidden="true" />
          <span>{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</span>
        </div>}
        {request.deadline && <div className="support-request-card__stat"><span>Deadline: {formatDate(request.deadline)}</span></div>}
      </div>

      <div className="support-request-card__actions">
        {onSupportClick && <button
          type="button"
          className="btn btn--primary btn--md support-request-card__support-btn"
          onClick={() => onSupportClick?.(request)}
        >
          Support
        </button>}
        <Link
          to={`/community/help/requests/${request.id}`}
          className="btn btn--outline btn--md support-request-card__details-btn"
        >
          View Details <ExternalLink size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
