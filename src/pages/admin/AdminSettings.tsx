import { useState } from 'react'
import type { FormEvent } from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type AdminSettingsTab = 'account' | 'notifications' | 'security' | 'delete'

interface AdminProfile {
  fullName: string
  email: string
  phone: string
}

export function AdminSettings() {
  const [tab, setTab] = useState<AdminSettingsTab>('account')
  const [profile, setProfile] = useState<AdminProfile>({ fullName: '', email: '', phone: '' })
  const [savedNotice, setSavedNotice] = useState<string | null>(null)

  const [notifications, setNotifications] = useState(notificationsInitial)

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    setSavedNotice('Profile details updated (frontend preview only — no changes are saved to a server).')
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const TABS: { id: AdminSettingsTab; label: string; icon: typeof User }[] = [
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'delete', label: 'Delete Account', icon: Trash2 },
  ]

  return (
    <section className="admin-section" aria-labelledby="admin-settings-title">
      <AdminPageHeader
        title="Settings"
        subtitle="Manage your admin account preferences."
        icon={<SettingsIcon size={20} />}
      />

      <div className="admin-settings">
        <nav className="admin-settings__tabs" aria-label="Settings sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-settings__tab ${tab === t.id ? 'admin-settings__tab--active' : ''}`}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
            >
              <t.icon size={18} aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-settings__panel">
          {savedNotice && (
            <div className="admin-alert admin-alert--success" role="status">
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{savedNotice}</span>
            </div>
          )}

          {tab === 'account' && (
            <form onSubmit={saveProfile} className="admin-settings-form" noValidate>
              <h2 className="admin-settings-form__title">Account Information</h2>
              <div className="form-grid">
                <Input
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Admin name"
                />
                <Input
                  label="Admin Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="admin@oyoconnect.ng"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+234 000 000 0000"
                />
              </div>
              <div className="admin-settings-form__actions">
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
              <p className="admin-settings-form__hint">Frontend preview — no data is saved or sent to a server.</p>
            </form>
          )}

          {tab === 'notifications' && (
            <div className="admin-settings-form">
              <h2 className="admin-settings-form__title">Notification Preferences</h2>
              <div className="admin-check-list">
                {(Object.keys(notifications) as (keyof typeof notifications)[]).map((key) => (
                  <label key={key} className="checkbox-wrapper admin-check-row">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => toggleNotification(key)}
                    />
                    <span className="checkbox-custom" aria-hidden="true" />
                    <span>{notificationsLabel[key]}</span>
                  </label>
                ))}
              </div>
              <div className="admin-settings-form__actions">
                <Button type="button" variant="primary" onClick={() => setSavedNotice('Notification preferences updated (frontend preview only).')}>Save Preferences</Button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="admin-settings-form">
              <h2 className="admin-settings-form__title">Security</h2>
              <p className="admin-settings-form__hint">
                Password management will require backend integration. No passwords are collected or stored by this frontend preview.
              </p>
              <div className="form-grid">
                <Input label="New Password" type="password" placeholder="Enter new password" />
                <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
              </div>
              <div className="admin-settings-form__actions">
                <Button type="button" variant="primary" onClick={() => setSavedNotice('Security changes require backend integration and are not applied (frontend preview only).')}>Update Password</Button>
              </div>
            </div>
          )}

          {tab === 'delete' && (
            <div className="admin-settings-form">
              <h2 className="admin-settings-form__title">Delete Account</h2>
              <div className="admin-danger-zone">
                <AlertTriangle size={24} aria-hidden="true" />
                <p>
                  Deleting your admin account is a destructive action. This is not implemented in the frontend preview —
                  it will require backend integration to permanently remove the account.
                </p>
              </div>
              <div className="admin-settings-form__actions">
                <Button type="button" variant="danger" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          <div className="admin-settings__role">
            <Select
              label="Role preview (for development)"
              value="admin"
              options={[{ value: 'admin', label: 'admin' }, { value: 'business_owner', label: 'business_owner' }]}
              onChange={() => {}}
            />
            <p className="admin-settings-form__hint">Role-based routing is prepared for the future. See <code>UserRole</code> type.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const notificationsLabel: Record<keyof typeof notificationsInitial, string> = {
  newBusinesses: 'New business registrations',
  pendingVerification: 'Pending verification requests',
  jobModeration: 'Job moderation queue',
  communityReports: 'New community reports',
  helpRequests: 'New help requests',
}

const notificationsInitial = {
  newBusinesses: true,
  pendingVerification: true,
  jobModeration: true,
  communityReports: true,
  helpRequests: true,
}

export default AdminSettings
