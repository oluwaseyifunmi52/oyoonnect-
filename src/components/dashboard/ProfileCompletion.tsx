import type { ReactNode } from 'react'
import { MapPin, Phone, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ButtonLink } from '../ui/Button'

interface ProfileCompletionProps {
  profile?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    town?: string
    lga?: string
    picture?: string
    onEdit?: () => void
  }
  compact?: boolean
  onEdit?: () => void
}

export function ProfileCompletion({
  profile,
  compact = false,
  onEdit,
}: ProfileCompletionProps) {
  const { user } = useAuth()
  const displayedName = user?.name?.trim().split(/\s+/)[0] || 'Oluwaseyifunmi'

  if (!profile && !user) {
    return null
  }

  const profileData = profile || {
    firstName: displayedName,
  }

  if (compact) {
    return (
      <div className="profile-summary">
        <span className="profile-summary-name">{displayedName}</span>
        {profileData.town && (
          <span className="profile-summary-location">
            <MapPin size={14} aria-hidden="true" /> {profileData.town}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="profile-card">
      <div className="profile-card__header">
        {profileData.picture ? (
          <img
            src={profileData.picture}
            alt={displayedName}
            className="profile-card__image"
          />
        ) : (
          <div className="profile-card__initials">
            {displayedName.charAt(0)}{(displayedName.split(' ')[1]?.[0] || '').toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="profile-card__name">{displayedName}</h3>
          {profileData.email && <p className="profile-card__email">{profileData.email}</p>}
        </div>
      </div>

      <div className="profile-card__body">
        {profileData.phone && (
          <p className="profile-card__phone">
            <Phone size={14} aria-hidden="true" /> {profileData.phone}
          </p>
        )}
        {profileData.town && (
          <p className="profile-card__location">
            <MapPin size={14} aria-hidden="true" /> {profileData.town}, {profileData.lga || ''}
          </p>
        )}

        {onEdit && (
          <ButtonLink
            to="/profile"
            variant="outline"
            size="sm"
            style={{ marginTop: '12px', display: 'inline-block' }}
          >
            Edit Profile
          </ButtonLink>
        )}
      </div>
    </div>
  )
}