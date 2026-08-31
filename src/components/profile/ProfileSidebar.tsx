import { useState, useCallback } from 'react'
import type { ChangeEvent } from 'react'
import type { User } from '../../types/business'
import { User as UserIcon, LogOut, Building2, Camera, X, Loader2, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button, ButtonLink } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

interface ProfileSidebarProps {
  user: User | null
  avatarPreview: string | null
  currentAvatar: string | null
  avatarFile: File | null
  loading: boolean
  isDirty: boolean
  handleAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveAvatar: () => void
  handleLogout: () => void
  handleProfileChange: (field: string, value: string) => void
  checkDirty: () => void
  handleCancel: () => void
  handleProfileSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function ProfileSidebar({
  user,
  avatarPreview,
  currentAvatar,
  avatarFile,
  loading,
  isDirty,
  handleAvatarChange,
  handleRemoveAvatar,
  handleLogout,
  handleProfileChange,
  checkDirty,
  handleCancel,
  handleProfileSubmit,
}: ProfileSidebarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const resolvedAvatar = avatarPreview || user?.avatar || null

  const avatarContent = avatarPreview ? (
    <div>
      <img
        src={avatarPreview}
        alt={`${user?.name}'s profile photo`}
        className="profile-photo__preview-image"
      />
      <button
        type="button"
        className="profile-photo__remove-btn"
        onClick={handleRemoveAvatar}
        aria-label="Remove profile photo"
        disabled={loading}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  ) : resolvedAvatar ? (
    <div>
      <img
        src={resolvedAvatar}
        alt={`${user?.name}'s profile photo`}
        className="profile-photo__preview-image"
      />
      <button
        type="button"
        className="profile-photo__remove-btn"
        onClick={handleRemoveAvatar}
        aria-label="Remove profile photo"
        disabled={loading}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  ) : (
    <div className="profile-photo__avatar-placeholder" aria-hidden="true">
      {getInitials(user?.name || 'U')}
    </div>
  )

  return (
    <aside className="profile-sidebar">
      {/* Profile Photo Section */}
      <section className="profile-card profile-photo-section" aria-labelledby="profile-photo-title">
        <h2 id="profile-photo-title" className="profile-photo__label">Profile Photo</h2>
        <p className="profile-photo__hint">JPG, PNG or WebP. Max 5MB.</p>

        <div className="profile-photo__avatar-wrapper">
          <div>
            {avatarPreview ? (
              <div>
                <img
                  src={avatarPreview}
                  alt={`${user?.name}'s profile photo`}
                  className="profile-photo__preview-image"
                />
                <button
                  type="button"
                  className="profile-photo__remove-btn"
                  onClick={handleRemoveAvatar}
                  aria-label="Remove profile photo"
                  disabled={loading}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            ) : currentAvatar ? (
              <div>
                <img
                  src={currentAvatar}
                  alt={`${user?.name}'s profile photo`}
                  className="profile-photo__preview-image"
                />
                <button
                  type="button"
                  className="profile-photo__remove-btn"
                  onClick={handleRemoveAvatar}
                  aria-label="Remove profile photo"
                  disabled={loading}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
) : (
              <div className="profile-photo__avatar-placeholder" aria-hidden="true">
                {getInitials(user?.name || 'U')}
              </div>
            )}
          </div>
        </div>

          <input
            type="file"
            id="avatar-upload"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="visually-hidden"
            disabled={loading}
          />

          <label
            htmlFor="avatar-upload"
            className={`btn btn--primary profile-photo__edit-btn ${loading ? 'btn--disabled' : ''}`}
            aria-label="Change profile photo"
          >
            <Camera size={18} aria-hidden="true" />
            Change Photo
          </label>

          <div className="profile-photo__actions">
            <button
              type="button"
              className={`btn btn--primary ${loading ? 'btn--disabled' : ''}`}
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={loading}
            >
              <Camera size={18} aria-hidden="true" />
              Change Photo
            </button>
            {(currentAvatar || avatarPreview) && !avatarFile && (
              <button
                type="button"
                className={`btn btn--outline ${loading ? 'btn--disabled' : ''}`}
                onClick={handleRemoveAvatar}
                disabled={loading}
              >
                <X size={16} aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
        </section>

        {/* Profile Info Display */}
        <div className="profile-info-display">
          <h3 className="profile-info-display__name">{user?.name}</h3>
          <p className="profile-info-display__email">{user?.email}</p>
          <span className={`profile-info-display__role role-${user?.role}`}>
            {user?.role === 'admin' ? 'Administrator' : user?.role === 'business_owner' ? 'Business Owner' : 'Customer'}
          </span>
        </div>

      {/* Quick Actions */}
      <section className="profile-card">
        <ButtonLink
          to="/"
          variant="ghost"
          className="profile-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Sign out</span>
        </ButtonLink>
      </section>
    </aside>
  )
}

export default ProfileSidebar