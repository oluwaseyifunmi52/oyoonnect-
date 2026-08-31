import { useState } from 'react'
import { Shield, Lock, Key, UserCheck, AlertTriangle, Smartphone, Mail, CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAuth } from '../context/AuthContext'

interface SecurityState {
  twoFactorEnabled: boolean
  twoFactorMethod: 'authenticator' | 'sms'
  backupCodes: boolean
}

type SecurityKey = 'twoFactorEnabled' | 'twoFactorMethod' | 'backupCodes'

export function SettingsSecurity() {
  const { isAuthenticated } = useAuth()
  const [security, setSecurity] = useState<{ twoFactorEnabled: boolean; twoFactorMethod: 'authenticator' | 'sms'; backupCodes: boolean }>({
    twoFactorEnabled: false,
    twoFactorMethod: 'authenticator',
    backupCodes: false,
  })

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

  return (
    <main className="page">
      <div className="container container--narrow">
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
            <button className="btn btn--outline">View Backup Codes</button>
            <button className="btn btn--primary">Setup 2FA</button>
          </div>
        </section>

        <section className="settings-card-group">
          <header className="card-group-header">
            <h2>Password</h2>
            <p>Your password is the first line of defense for your account.</p>
          </header>
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
              <button className="btn btn--primary">Change Password</button>
            </div>
          </div>
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
              <button className="btn btn--outline">View Sessions</button>
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
              <button className="btn btn--primary" disabled>Create Passkey</button>
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
              <button className="btn btn--danger" onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion requires backend integration.')
                }
              }}>
                Delete Account
              </button>
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