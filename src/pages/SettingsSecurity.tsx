import { useState } from 'react'
import { Shield, Lock, Key, UserCheck, AlertTriangle, Smartphone, Mail, CheckCircle2, AlertCircle, Eye, EyeOff, Save, Loader2 } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { BackButton } from '../components/ui/BackButton'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

interface SecurityState {
  twoFactorEnabled: boolean
  twoFactorMethod: 'authenticator' | 'sms'
  backupCodes: boolean
}

type SecurityKey = 'twoFactorEnabled' | 'twoFactorMethod' | 'backupCodes'

export function SettingsSecurity() {
  const { isAuthenticated, changePassword } = useAuth()
  const [security, setSecurity] = useState<SecurityState>({
    twoFactorEnabled: false,
    twoFactorMethod: 'authenticator',
    backupCodes: false,
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <h1>Please sign in</h1>
            <p>You need to be logged in to access security settings.</p>
          </div>
        </div>
      </main>
    )
  }

  const handleToggle = (key: 'twoFactorEnabled' | 'backupCodes') => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelect = (key: 'twoFactorMethod', value: 'authenticator' | 'sms') => {
    setSecurity(prev => ({ ...prev, [key]: value }))
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required'
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required'
    else {
      const validationError = validatePassword(passwordForm.newPassword)
      if (validationError) errors.newPassword = validationError
    }
    if (!passwordForm.confirmPassword) errors.confirmPassword = 'Please confirm your new password'
    else if (passwordForm.confirmPassword !== passwordForm.newPassword) errors.confirmPassword = 'Passwords do not match'
    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswordForm()) return

    setPasswordSaving(true)
    setPasswordStatus('idle')
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordStatus('success')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      setTimeout(() => setPasswordStatus('idle'), 3000)
    } catch (err) {
      setPasswordErrors({ form: err instanceof Error ? err.message : 'Failed to change password. Please try again.' })
      setPasswordStatus('error')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handlePasswordInputChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    if (passwordErrors[field]) {
      setPasswordErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <main className="page">
      <div className="container container--narrow">
        <BackButton fallback="/dashboard" label="Back to settings" variant="ghost" size="sm" className="page-back-link" />
        <header className="settings-page-header">
          <h1>Security</h1>
          <p>Manage your password and account security settings.</p>
        </header>

        <section className="settings-card-group">
          <header className="card-group-header">
            <h2>Two-Factor Authentication</h2>
            <p>Add an extra layer of security to your account.</p>
          </header>
          <div className="security-setting">
            <div className="security-setting-info">
              <div className="security-setting-icon">
                <Shield size={24} />
              </div>
              <div className="security-setting-content">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security by requiring a code from your authenticator app when signing in.</p>
              </div>
            </div>
            <div className="security-setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={security.twoFactorEnabled}
                  onChange={() => handleToggle('twoFactorEnabled')}
                />
                <span className="toggle-slider" aria-hidden="true" />
              </label>
            </div>
            <div className="security-setting-note">
              <p>2FA setup requires backend integration. This feature will be fully functional when secure backend authentication is connected.</p>
            </div>
          </div>

          {security.twoFactorEnabled && (
            <div className="security-method-selector">
              <h4>Authentication Method</h4>
              <div className="method-options">
                <label className={`method-option ${security.twoFactorMethod === 'authenticator' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="twoFactorMethod"
                    value="authenticator"
                    checked={security.twoFactorMethod === 'authenticator'}
                    onChange={() => handleSelect('twoFactorMethod', 'authenticator')}
                  />
                  <div className="method-info">
                    <div className="method-icon">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h5>Authenticator App</h5>
                      <p>Use Google Authenticator, Authy, or similar apps.</p>
                    </div>
                  </div>
                </label>
                <label className={`method-option ${security.twoFactorMethod === 'sms' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="twoFactorMethod"
                    value="sms"
                    checked={security.twoFactorMethod === 'sms'}
                    onChange={() => handleSelect('twoFactorMethod', 'sms')}
                  />
                  <div className="method-info">
                    <div className="method-icon">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h5>SMS</h5>
                      <p>Receive codes via text message.</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="security-actions">
            <Button variant="outline" disabled>View Backup Codes</Button>
            <Button variant="primary" disabled>Setup 2FA</Button>
          </div>
        </section>

        <section className="settings-card-group">
          <header className="card-group-header">
            <h2>Password</h2>
            <p>Your password is the first line of defense for your account.</p>
          </header>

          {!showPasswordForm ? (
            <div className="security-setting">
              <div className="security-setting-info">
                <div className="security-setting-icon">
                  <Lock size={24} />
                </div>
                <div className="security-setting-content">
                  <h3>Change Password</h3>
                  <p>Update your password regularly to keep your account secure.</p>
                </div>
              </div>
              <div className="security-setting-control">
                <Button variant="primary" onClick={() => setShowPasswordForm(true)}>
                  <Key size={16} aria-hidden="true" />
                  Change Password
                </Button>
              </div>
            </div>
          ) : (
            <div className="security-setting">
              <div className="security-setting-info">
                <div className="security-setting-icon">
                  <Lock size={24} />
                </div>
                <div className="security-setting-content">
                  <h3>Change Password</h3>
                  <p>Enter your current password and a new secure password.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="password-change-form" noValidate>
                {passwordStatus === 'success' && (
                  <div className="password-success" role="status">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>Password changed successfully</span>
                  </div>
                )}

                {passwordStatus === 'error' && passwordErrors.form && (
                  <div className="password-error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{passwordErrors.form}</span>
                  </div>
                )}

                <Input
                  label="Current Password"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                  autoComplete="current-password"
                  required
                  error={passwordErrors.currentPassword}
                  rightIcon={
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(v => !v)}
                      aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                  autoComplete="new-password"
                  required
                  error={passwordErrors.newPassword}
                  hint="At least 8 characters with uppercase, lowercase, and number"
                  rightIcon={
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(v => !v)}
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  required
                  error={passwordErrors.confirmPassword}
                  rightIcon={
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <div className="password-form-actions">
                  <Button type="button" variant="outline" onClick={() => { setShowPasswordForm(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); setPasswordStatus('idle'); }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={passwordSaving}>
                    {passwordSaving ? (
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
              </form>
            </div>
          )}

        </section>

        <section className="settings-card-group">
          <header className="card-group-header">
            <h2>Login Activity</h2>
            <p>Review recent login sessions and devices.</p>
          </header>
          <div className="security-setting">
            <div className="security-setting-info">
              <div className="security-setting-icon">
                <UserCheck size={24} />
              </div>
              <div className="security-setting-content">
                <h3>Recent Sessions</h3>
                <p>View and manage devices currently logged into your account.</p>
              </div>
            </div>
            <div className="security-setting-control">
              <Button variant="outline" disabled>View Sessions</Button>
            </div>
          </div>
          <div className="security-setting-note">
            <p>Login activity tracking requires backend integration. This feature will be available when backend authentication is connected.</p>
          </div>
        </section>

        <section className="settings-card-group">
          <header className="card-group-header">
            <h2>Passkeys</h2>
            <p>Use your device's biometrics or PIN to sign in securely.</p>
          </header>
          <div className="security-setting">
            <div className="security-setting-info">
              <div className="security-setting-icon">
                <Key size={24} />
              </div>
              <div className="security-setting-content">
                <h3>Passkeys</h3>
                <p>Create and manage passkeys for faster, more secure sign-in.</p>
              </div>
            </div>
            <div className="security-setting-control">
              <Button variant="primary" disabled>Create Passkey</Button>
            </div>
            <div className="security-setting-note">
              <p>Passkey support requires WebAuthn backend integration.</p>
            </div>
          </div>
        </section>

        <section className="settings-card-group danger-zone">
          <header className="card-group-header">
            <h2>Danger Zone</h2>
            <p>Irreversible actions that affect your account.</p>
          </header>
          <div className="security-setting danger">
            <div className="security-setting-info">
              <div className="security-setting-icon warning">
                <AlertTriangle size={24} />
              </div>
              <div className="security-setting-content">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
            </div>
            <div className="security-setting-control">
              <Button variant="danger" onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion requires backend integration.')
                }
              }}>
                Delete Account
              </Button>
            </div>
          </div>
        </section>

        <div className="settings-footer-note">
          <p>Security features like 2FA, passkeys, and login activity require backend integration to function fully.</p>
        </div>
      </div>
    </main>
  )
}

export default SettingsSecurity