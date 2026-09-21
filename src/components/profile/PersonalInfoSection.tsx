import { Check, Lock } from 'lucide-react'
import type { User as UserType } from '../../types/business'
import { Badge } from '../ui/Badge'
import './PersonalInfoSection.css'

interface PersonalInfoSectionProps {
  user: UserType | null
}

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  admin: 'Administrator',
  business_owner: 'Business Owner',
  service_provider: 'Service Provider',
  customer: 'Customer',
  user: 'Customer',
}

export function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  const role = user?.role ?? 'user'
  const accountType = ACCOUNT_TYPE_LABEL[role] ?? 'Customer'

  return (
    <div className="personal-info__grid">
      <div className="personal-info__field personal-info__field--full">
        <label className="personal-info__label">Full name</label>
        <div className="personal-info__value">{user?.name || '—'}</div>
      </div>

      <div className="personal-info__field">
        <label className="personal-info__label">Account type</label>
        <div className="personal-info__value">
          <Badge variant="brand" size="sm">
            <Check size={12} aria-hidden="true" />
            {accountType}
          </Badge>
        </div>
      </div>

      <div className="personal-info__field personal-info__field--full">
        <label className="personal-info__label">Email address</label>
        <div className="personal-info__value personal-info__value--readonly">
          <span className="personal-info__email-text">{user?.email || '—'}</span>
          <Lock size={14} className="personal-info__lock-icon" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
