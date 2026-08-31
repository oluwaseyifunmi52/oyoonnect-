import { MapPin, Shield, Clock, ThumbsUp, ThumbsDown, MessageCircle, AlertCircle } from 'lucide-react'
import { ReportStatusBadge } from './ReportStatusBadge'
import { CommunityComments } from './CommunityComments'
import { formatRelativeTime, formatDate } from './utils'
import { communityCategoryBySlug } from '../../data/communityCategories'
import type { CommunityReport, CommunityComment } from '../../types/community'
import type { ComponentType } from 'react'

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  MapPin,
  AlertTriangle: MapPin,
  Car: MapPin,
  Zap: MapPin,
  Droplets: MapPin,
  Trash2: MapPin,
  Hammer: MapPin,
  Shield,
  Bus: MapPin,
  Camera: MapPin,
}

interface ReportDetailsProps {
  report: CommunityReport
  comments: CommunityComment[]
  currentUserId?: string
  onUpvote: () => void
  onDownvote: () => void
  onSubmitComment: (content: string) => Promise<void>
  loading?: boolean
}

export function CommunityReportDetails({
  report,
  comments,
  currentUserId,
  onUpvote,
  onDownvote,
  onSubmitComment,
  loading = false,
}: ReportDetailsProps) {
  const category = communityCategoryBySlug(report.category)
  const Icon = (category && ICON_MAP[category.icon]) || MapPin

  return (
    <article className="report-details">
      <header className="report-details__header">
        <div className="report-details__category">
          <span
            className="report-details__category-badge"
            style={{ backgroundColor: `${category?.color || '#0f766e'}1A`, color: category?.color || '#0f766e' }}
          >
            <Icon size={16} aria-hidden="true" />
            {category?.name || report.category}
          </span>
          {report.urgent && (
            <span className="report-details__urgent" title="Urgent report">
              <AlertCircle size={16} aria-hidden="true" />
              Urgent
            </span>
          )}
        </div>

        <h1 className="report-details__title">{report.title}</h1>

        <div className="report-details__status-row">
          <ReportStatusBadge status={report.status} />
          {report.verified && (
            <span className="report-details__verified" title="Community verified">
              <Shield size={16} aria-hidden="true" />
              Verified by community
            </span>
          )}
        </div>

        <div className="report-details__location">
          <MapPin size={18} aria-hidden="true" />
          <div>
            <span>{report.location.address}</span>
            <span>{report.location.town}, {report.location.lga} · {report.location.state}</span>
          </div>
        </div>

        <div className="report-details__meta">
          <span className="report-details__author">
            {report.authorAvatar ? (
              <img src={report.authorAvatar} alt={report.authorName} className="report-details__avatar" loading="lazy" />
            ) : (
              <span className="report-details__avatar--placeholder">
                {report.authorName?.charAt(0) || '?'}
              </span>
            )}
            {report.authorName}
          </span>
          <time className="report-details__time" dateTime={report.createdAt}>
            {formatRelativeTime(report.createdAt)}
          </time>
        </div>
      </header>

      <div className="report-details__content">
        {report.images && report.images.length > 0 && (
          <div className="report-details__gallery">
            {report.images.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Report photo ${i + 1}`}
                className="report-details__gallery-image"
                loading="lazy"
              />
            ))}
          </div>
        )}

        <div className="report-details__description">
          <p>{report.description}</p>
        </div>

        <div className="report-details__info">
          <div className="report-details__info-item">
            <span className="report-details__info-label">Reported</span>
            <span className="report-details__info-value">{formatDate(report.createdAt)}</span>
          </div>
          <div className="report-details__info-item">
            <span className="report-details__info-label">Last Updated</span>
            <span className="report-details__info-value">{formatDate(report.updatedAt)}</span>
          </div>
          {report.location.latitude && report.location.longitude && (
            <div className="report-details__info-item">
              <span className="report-details__info-label">Coordinates</span>
              <span className="report-details__info-value">
                {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
              </span>
            </div>
          )}
        </div>

        <div className="report-details__actions">
          <button
            type="button"
            className="report-details__action-btn"
            onClick={onUpvote}
            aria-label={`Confirm: ${report.upvotes} upvotes`}
          >
            <ThumbsUp size={18} aria-hidden="true" />
            Yes, I've seen this ({report.upvotes})
          </button>
          <button
            type="button"
            className="report-details__action-btn report-details__action-btn--secondary"
            onClick={onDownvote}
            aria-label={`Disagree: ${report.downvotes} downvotes`}
          >
            <ThumbsDown size={18} aria-hidden="true" />
            I'm affected ({report.downvotes})
          </button>
        </div>
      </div>

      <CommunityComments
        reportId={report.id}
        comments={comments}
        currentUserId={currentUserId}
        onAddComment={onSubmitComment}
        loading={loading}
      />
    </article>
  )
}
