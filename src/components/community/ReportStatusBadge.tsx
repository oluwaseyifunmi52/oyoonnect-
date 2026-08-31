import type { ReportStatus } from '../../types/community'

const STATUS_TONES: Record<ReportStatus, 'danger' | 'warning' | 'verified' | 'success' | 'neutral'> = {
  urgent: 'danger',
  pending: 'warning',
  verified: 'verified',
  resolved: 'success',
  dismissed: 'neutral',
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  urgent: 'Urgent',
  pending: 'Pending Verification',
  verified: 'Verified',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

interface StatusBadgeProps {
  status: ReportStatus
}

export function ReportStatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${STATUS_TONES[status]}`}>{STATUS_LABELS[status]}</span>
}
