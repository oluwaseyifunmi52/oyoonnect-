import { ShieldCheck, ShieldAlert, ShieldX, Clock } from 'lucide-react'
import type { VerificationStatus } from '../../types/help'

interface VerificationBadgeProps {
  status: VerificationStatus
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function VerificationBadge({ status, size = 'md', showLabel = true }: VerificationBadgeProps) {
  const config = {
    verified: {
      icon: ShieldCheck,
      label: 'Verified',
      tone: 'success' as const,
      description: 'Request has been verified by OyoConnect team'
    },
    verification_pending: {
      icon: Clock,
      label: 'Pending Review',
      tone: 'brand' as const,
      description: 'Request is under review by OyoConnect team'
    },
    pending: {
      icon: Clock,
      label: 'Pending Review',
      tone: 'brand' as const,
      description: 'Request is under review by OyoConnect team'
    },
    failed: {
      icon: ShieldAlert,
      label: 'Failed',
      tone: 'error' as const,
      description: 'Verification failed'
    },
    rejected: {
      icon: ShieldX,
      label: 'Not Verified',
      tone: 'error' as const,
      description: 'Request could not be verified'
    },
    unverified: {
      icon: ShieldX,
      label: 'Unverified',
      tone: 'neutral' as const,
      description: 'Not yet verified'
    }
  }

  const { icon: Icon, label, tone, description } = config[status] || config.unverified

  return (
    <span
      className={`verification-badge verification-badge--${tone} verification-badge--${size}`}
      title={description}
    >
      <Icon size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  )
}