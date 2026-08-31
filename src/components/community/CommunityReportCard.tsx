import { Link } from 'react-router-dom'
import {
  MapPin,
  AlertTriangle,
  AlertCircle,
  Car,
  Zap,
  Droplets,
  Trash2,
  Hammer,
  Shield,
  Bus,
  Camera,
  Clock,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react'
import { ReportStatusBadge } from './ReportStatusBadge'
import { formatRelativeTime } from './utils'
import { communityCategoryBySlug } from '../../data/communityCategories'
import type { CommunityReport } from '../../types/community'
import type { ComponentType } from 'react'

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  MapPin,
  AlertTriangle,
  Car,
  Zap,
  Droplets,
  Trash2,
  Hammer,
  Shield,
  Bus,
  Camera,
}

interface ReportCardProps {
  report: CommunityReport
}

export function CommunityReportCard({ report }: ReportCardProps) {
  const category = communityCategoryBySlug(report.category)
  const Icon = (category && ICON_MAP[category.icon]) || MapPin

  return (
    <article className="report-card" role="listitem">
      <Link to={`/community/report/${report.id}`} className="report-card__link">
        <div className="report-card__header">
          <span
            className="report-card__category"
            style={{ backgroundColor: `${category?.color || '#0f766e'}1A`, color: category?.color || '#0f766e' }}
          >
            <Icon size={14} aria-hidden="true" />
            {category?.name || report.category}
          </span>
          {report.urgent && (
            <span className="report-card__urgent" title="Urgent report">
              <AlertCircle size={14} aria-hidden="true" />
            </span>
          )}
          <time className="report-card__time" dateTime={report.createdAt}>
            {formatRelativeTime(report.createdAt)}
          </time>
        </div>

        <h3 className="report-card__title">{report.title}</h3>
        <p className="report-card__excerpt">{report.excerpt || report.description.substring(0, 160)}</p>

        <div className="report-card__location">
          <MapPin size={14} aria-hidden="true" />
          <span>{report.location.town}, {report.location.lga}</span>
        </div>

        {report.image && (
          <div className="report-card__image">
            <img src={report.image} alt={report.title} loading="lazy" />
          </div>
        )}

        <div className="report-card__footer">
          <div className="report-card__meta">
            <ReportStatusBadge status={report.status} />
            {report.verified && (
              <span className="report-card__verified" title="Community verified">
                <Shield size={12} aria-hidden="true" />
              </span>
            )}
          </div>
          <div className="report-card__engagement">
            <span className="report-card__engagement-item">
              <ThumbsUp size={14} aria-hidden="true" />
              {report.upvotes}
            </span>
            <span className="report-card__engagement-item">
              <MessageCircle size={14} aria-hidden="true" />
              {report.commentCount}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
