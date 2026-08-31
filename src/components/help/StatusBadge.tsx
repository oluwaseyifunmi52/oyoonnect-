import type { SupportRequestStatus } from '../../types/help'
import { STATUS_LABELS } from '../../types/help'
import { HelpIcon } from './IconMapping'

interface StatusBadgeProps {
  status: SupportRequestStatus
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const STATUS_CONFIG: Record<SupportRequestStatus, { tone: 'neutral' | 'brand' | 'success' | 'warning' | 'error'; icon: string }> = {
  draft: { tone: 'neutral', icon: 'clock' },
  pending_review: { tone: 'brand', icon: 'shield-alert' },
  rejected: { tone: 'error', icon: 'shield-x' },
  active: { tone: 'success', icon: 'shield-check' },
  goal_reached_processing: { tone: 'warning', icon: 'clock' },
  payout_pending: { tone: 'warning', icon: 'clock' },
  payout_processing: { tone: 'brand', icon: 'loader2' },
  funded_and_paid_out: { tone: 'success', icon: 'check-circle2' },
  payout_failed: { tone: 'error', icon: 'alert-circle' },
  paused: { tone: 'neutral', icon: 'clock' },
  closed: { tone: 'neutral', icon: 'shield-x' },
}

export function StatusBadge({ status, size = 'md', showLabel = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  const iconSize = size === 'sm' ? 12 : 14

  return (
    <span
      className={`status-badge status-badge--${config.tone} status-badge--${size}`}
      title={STATUS_LABELS[status]}
    >
      <HelpIcon name={config.icon} size={iconSize} aria-hidden="true" />
      {showLabel && <span className="status-badge__label">{STATUS_LABELS[status]}</span>}
    </span>
  )
}
