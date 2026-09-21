import { useState, useCallback, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ProfileCard, PhotoSection, PersonalInfoSection, SessionSection } from '../components/profile'
import { useAuth } from '../context/AuthContext'
import './ProfileSettings.css'

function ProfileSettings() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U'

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, WebP)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      setIsUploading(true)
      setError('')
      setSuccess('')

      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
      setSuccess('Profile photo updated. Click "Save changes" to apply.')

      setTimeout(() => setIsUploading(false), 500)
    },
    [],
  )

  const handleRemoveAvatar = useCallback(() => {
    setAvatarPreview(null)
    setSuccess('Profile photo removed. Click "Save changes" to apply.')
    setError('')
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (authLoading) {
    return (
      <main className="profile-settings-page">
        <div className="profile-settings__skeleton">
          <div className="profile-card-skeleton" />
          <div className="profile-card-skeleton" />
          <div className="profile-card-skeleton" />
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="profile-settings-page auth-fallback">
        <ProfileCard title="Please sign in" description="You need to be logged in to access your profile settings.">
          <div className="profile-auth-fallback">
            <button type="button" className="btn btn--primary" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </div>
        </ProfileCard>
      </main>
    )
  }

  const displayAvatar = avatarPreview || user.avatar

  return (
    <main className="profile-settings-page">
      <header className="profile-settings__header">
        <h1 className="profile-settings__title">Profile settings</h1>
        <p className="profile-settings__subtitle">
          Manage your personal information, profile photo, and account preferences.
        </p>
      </header>

      {success && (
        <div className="profile-message profile-message--success" role="status">
          <CheckCircle2 className="profile-message__icon" size={20} aria-hidden="true" />
          <div className="profile-message__content">
            <p className="profile-message__text">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="profile-message profile-message--error" role="alert">
          <AlertCircle className="profile-message__icon" size={20} aria-hidden="true" />
          <div className="profile-message__content">
            <p className="profile-message__text">{error}</p>
          </div>
        </div>
      )}

      <div className="profile-settings__sections">
        <ProfileCard title="Profile Photo" description="Add or remove your profile picture.">
          <PhotoSection
            src={displayAvatar}
            initials={getInitials(user.name)}
            onAvatarChange={handleAvatarChange}
            onRemove={handleRemoveAvatar}
            disabled={isUploading}
          />
        </ProfileCard>

        <ProfileCard title="Personal Information" description="Your public profile details. Email cannot be changed here.">
          <PersonalInfoSection user={user} />
        </ProfileCard>

        <ProfileCard title="Session" description="Manage your active session.">
          <SessionSection onSignOut={handleLogout} />
        </ProfileCard>
      </div>
    </main>
  )
}

export default ProfileSettings
