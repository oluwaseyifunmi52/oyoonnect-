import { useState, useCallback, useRef } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { User as UserIcon, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, LogOut, Building2, Camera, X, Loader2, Shield, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'

// Type aliases for ProfileMainContent props
import type { User } from '../types/business'

interface ProfileMainContentProps {
  form: {
    firstName: string
    lastName: string
    displayName: string
    email: string
    phone: string
  }
  isDirty: boolean
  loading: boolean
  error: string
  success: string
  user: User | null
  passwordForm: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  showCurrentPassword: boolean
  setShowCurrentPassword: (value: boolean) => void
  showNewPassword: boolean
  setShowNewPassword: (value: boolean) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (value: boolean) => void
  handleProfileChange: (field: string, value: string) => void
  handlePasswordChange: (field: string, value: string) => void
  handleProfileSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  handlePasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  checkDirty: () => void
  handleCancel: () => void
}

function Profile() {
  const { user, updateProfile, logout, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')

  // Profile form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phone: '',
  })
  const [originalForm, setOriginalForm] = useState(form)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // UI state
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Initialize form from user data
  const initializeForm = useCallback(() => {
    if (user) {
      const nameParts = user.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      const initialForm = {
        firstName,
        lastName,
        displayName: user.name,
        email: user.email || '',
        phone: '',
      }
      setForm(initialForm)
      setOriginalForm(initialForm)
    }
  }, [user])

  // Initialize form when user changes
  const initDone = useRef(false)
  if (user && !initDone.current) {
    initializeForm()
    initDone.current = true
  }

  const handleProfileChange = useCallback((field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      return next
    })
    setError('')
    setSuccess('')
  }, [])

  const checkDirty = useCallback(() => {
    const dirty = JSON.stringify(form) !== JSON.stringify(originalForm) ||
      avatarPreview !== null ||
      avatarFile !== null
    setIsDirty(dirty)
  }, [form, originalForm, avatarPreview, avatarFile])

  const handleAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setError('')
    setSuccess('')
    checkDirty()
  }, [checkDirty])

  const handleRemoveAvatar = useCallback(() => {
    setAvatar(null)
    setAvatarPreview(null)
    setAvatarFile(null)
    setError('')
    setSuccess('')
    checkDirty()
  }, [checkDirty])

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!form.firstName.trim()) {
      setError('First name is required')
      return
    }
    if (!form.lastName.trim()) {
      setError('Last name is required')
      return
    }
    if (form.displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters')
      return
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.phone && !/^(\+234|0)[789][01]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid Nigerian phone number')
      return
    }

    setLoading(true)

    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim()
      const updated = await updateProfile({
        name: fullName,
        email: form.email.trim().toLowerCase(),
      })

      if (updated) {
        // Update local avatar if changed
        if (avatarFile) {
          const avatarUrl = avatarPreview
          if (avatarUrl) {
            localStorage.setItem('oyoconnect_avatar', avatarUrl)
          }
        }

        setOriginalForm(form)
        setAvatarFile(null)
        setAvatarPreview(null)
        setSuccess('Profile updated successfully')
        setIsDirty(false)
      } else {
        setError('Failed to update profile')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = useCallback(() => {
    setForm(originalForm)
    setAvatarPreview(null)
    setAvatarFile(null)
    setIsDirty(false)
    setError('')
    setSuccess('')
  }, [originalForm])

  const handlePasswordChange = useCallback((field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }, [])

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      // In a real app, this would call an API to change password
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      setError('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (authLoading) {
    return (
      <main className="page">
        <div className="container container--narrow">
          <div className="profile-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '200px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--media" style={{ aspectRatio: '16/9', borderRadius: '16px', marginBottom: '24px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ marginBottom: '16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ marginBottom: '16px' }} />
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <SectionHeading
              title="Please sign in"
              subtitle="You need to be logged in to access your profile."
            />
            <div className="auth-actions">
              <ButtonLink to="/login" variant="primary">
                Sign in
              </ButtonLink>
              <ButtonLink to="/register" variant="outline">
                Create account
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const currentAvatar = avatarPreview || user?.avatar || null

  return (
    <main className="page">
      <div className="profile-settings">
        {/* Page Header */}
        <header className="profile-settings__header">
          <h1 className="profile-settings__title">Profile Settings</h1>
          <p className="profile-settings__subtitle">
            Manage your personal information and profile preferences.
          </p>
        </header>

        {/* Success/Error Messages */}
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

        <div className="profile-layout">
          <ProfileSidebar
            user={user}
            avatarPreview={avatarPreview}
            currentAvatar={currentAvatar}
            avatarFile={avatarFile}
            loading={loading}
            isDirty={isDirty}
            handleAvatarChange={handleAvatarChange}
            handleRemoveAvatar={handleRemoveAvatar}
            handleLogout={handleLogout}
            handleProfileChange={handleProfileChange}
            checkDirty={checkDirty}
            handleCancel={handleCancel}
            handleProfileSubmit={handleProfileSubmit}
          />

          <div className="profile-layout__main">
            <ProfileMainContent
              form={form}
              isDirty={isDirty}
              loading={loading}
              error={error}
              success={success}
              user={user}
              passwordForm={passwordForm}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              handleProfileChange={handleProfileChange}
              handlePasswordChange={handlePasswordChange}
              handleProfileSubmit={handleProfileSubmit}
              handlePasswordSubmit={handlePasswordSubmit}
              checkDirty={checkDirty}
              handleCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function ProfileMainContent(props: ProfileMainContentProps) {
  const {
    form,
    isDirty,
    loading,
    error,
    success,
    user,
    passwordForm,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleProfileChange,
    handlePasswordChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    checkDirty,
    handleCancel,
  } = props

  // ... existing implementation
  return null
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { test: password.length >= 8, label: 'At least 8 characters' },
    { test: /[A-Z]/.test(password), label: 'One uppercase letter' },
    { test: /[a-z]/.test(password), label: 'One lowercase letter' },
    { test: /[0-9]/.test(password), label: 'One number' },
    { test: /[^A-Za-z0-9]/.test(password), label: 'One special character' },
  ]

  const passed = checks.filter((c) => c.test).length
  const strength = passed <= 1 ? 'weak' : passed <= 3 ? 'fair' : 'strong'

  return (
    <div className={`password-strength-meter ${strength}`}>
      <div className="password-strength-bar">
        <div className="password-strength-fill" style={{ width: `${(passed / checks.length) * 100}%` }} />
      </div>
      <ul className="password-strength-checks" aria-label="Password requirements">
        {checks.map((check, i) => (
          <li key={i} className={check.test ? 'passed' : ''}>
            <CheckCircle2 size={14} aria-hidden="true" />
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NotificationToggle({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label className="notification-toggle">
      <div className="notification-toggle-info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <span className="toggle-slider" aria-hidden="true" />
      </div>
    </label>
  )
}

export default Profile