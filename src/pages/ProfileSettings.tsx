import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { CheckCircle2, AlertCircle, Save, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ProfileCard, PhotoSection, PersonalInfoSection, SessionSection } from '../components/profile'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import './ProfileSettings.css'

function ProfileSettings() {
  const { user, logout, isAuthenticated, loading: authLoading, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null)
  const [avatarChanged, setAvatarChanged] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
      setAvatarChanged(true)
      setSuccess('Profile photo updated. Click "Save changes" to apply.')

      setTimeout(() => setIsUploading(false), 500)
    },
    [],
  )

  const handleRemoveAvatar = useCallback(() => {
    setAvatarPreview(null)
    setAvatarChanged(true)
    setSuccess('Profile photo removed. Click "Save changes" to apply.')
    setError('')
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }, [])

  const handleSaveAll = async () => {
    if (!avatarChanged) {
      setSuccess('No changes to save.')
      setTimeout(() => setSuccess(''), 3000)
      return
    }

    setIsSaving(true)
    setError('')
    try {
      await updateProfile({ avatar: avatarPreview || undefined })
      setSuccess('Profile saved successfully!')
      setAvatarChanged(false)
    } catch {
      setError('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

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
            <Button variant="primary" onClick={() => navigate('/login')}>
              Sign in
            </Button>
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

      {(success || error) && (
        <div className={`profile-message ${success ? 'profile-message--success' : 'profile-message--error'}`} role={success ? 'status' : 'alert'}>
          {success ? <CheckCircle2 className="profile-message__icon" size={20} aria-hidden="true" /> : <AlertCircle className="profile-message__icon" size={20} aria-hidden="true" />}
          <div className="profile-message__content">
            <p className="profile-message__text">{success || error}</p>
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
          <PersonalInfoSection user={user} onUpdate={updateProfile} />
        </ProfileCard>

        {avatarChanged && (
          <ProfileCard title="Pending Changes" description="You have unsaved profile photo changes.">
            <div className="profile-pending-changes">
              <p>Your profile photo has been updated locally but not saved.</p>
              <Button variant="primary" size="md" onClick={handleSaveAll} disabled={isSaving} fullWidth>
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="btn__spinner" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </ProfileCard>
        )}

        <ProfileCard title="Session" description="Manage your active session.">
          <SessionSection onSignOut={handleLogout} />
        </ProfileCard>
      </div>
    </main>
  )
}

export default ProfileSettings