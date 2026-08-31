import { useState } from 'react'
import { Shield, Eye, UserCheck, Database, Trash2, AlertTriangle, Check } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAuth } from '../context/AuthContext'

type PrivacyKey = 
  | 'profileVisibility'
  | 'businessContactVisibility'
  | 'showSavedBusinesses'
  | 'showActivity'
  | 'dataCollection'
  | 'deleteAccount'

interface PrivacyState {
  profileVisibility: 'public' | 'connections' | 'private'
  businessContactVisibility: 'public' | 'connections' | 'private'
  showSavedBusinesses: boolean
  showActivity: boolean
  dataCollection: boolean
  deleteAccount: boolean
}

type PrivacyItemType = 'toggle' | 'select' | 'danger'

interface PrivacyItem {
  key: PrivacyKey
  type: PrivacyItemType
  title: string
  description: string
  icon: React.ReactNode
  disabled?: boolean
  variant?: 'default' | 'danger'
  options?: Array<{ value: string; label: string; description: string }>
}

interface PrivacyGroup {
  title: string
  description: string
  items: PrivacyItem[]
}

export function SettingsPrivacy() {
  const { isAuthenticated } = useAuth()
  const [privacy, setPrivacy] = useState<PrivacyState>({
    profileVisibility: 'public',
    businessContactVisibility: 'public',
    showSavedBusinesses: true,
    showActivity: true,
    dataCollection: true,
    deleteAccount: false,
  })

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <h1>Please sign in</h1>
            <p>You need to be logged in to access privacy settings.</p>
          </div>
        </div>
      </main>
    )
  }

  const handleToggle = (key: PrivacyKey) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelect = (key: PrivacyKey, value: string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

  const privacyGroups = [
    {
      title: 'Profile Visibility',
      description: 'Control who can see your profile and activity.',
      items: [
        {
          key: 'profileVisibility' as PrivacyKey,
          type: 'select' as const,
          title: 'Profile visibility',
          description: 'Choose who can view your profile.',
          icon: <Eye size={20} />,
          options: [
            { value: 'public', label: 'Public', description: 'Anyone can view your profile.' },
            { value: 'connections', label: 'Connections only', description: 'Only your connections can view your profile.' },
            { value: 'private', label: 'Private', description: 'Only you can view your profile.' },
          ]
        },
        {
          key: 'businessContactVisibility' as PrivacyKey,
          type: 'select' as const,
          title: 'Business contact visibility',
          description: 'Choose who can see your contact information on business listings.',
          icon: <Shield size={20} />,
          options: [
            { value: 'public', label: 'Public', description: 'Anyone can see your contact details.' },
            { value: 'connections', label: 'Connections only', description: 'Only your connections can see your contact details.' },
            { value: 'private', label: 'Private', description: 'No one can see your contact details.' },
          ]
        },
        {
          key: 'showSavedBusinesses' as PrivacyKey,
          type: 'toggle' as const,
          title: 'Show saved businesses',
          description: 'Allow others to see the businesses you\'ve saved.',
          icon: <Eye size={20} />,
        },
        {
          key: 'showActivity' as PrivacyKey,
          type: 'toggle' as const,
          title: 'Show activity',
          description: 'Show your recent activity on your profile.',
          icon: <UserCheck size={20} />,
        },
      ]
    },
    {
      title: 'Data & Privacy',
      description: 'Control how your data is collected and used.',
      items: [
        {
          key: 'dataCollection' as PrivacyKey,
          type: 'toggle' as const,
          title: 'Analytics & data collection',
          description: 'Allow OyoConnect to collect usage data to improve the platform.',
          icon: <Database size={20} />,
        },
      ]
    },
    {
      title: 'Account Actions',
      description: 'Irreversible account actions.',
      items: [
        {
          key: 'deleteAccount' as PrivacyKey,
          type: 'danger' as const,
          title: 'Delete account',
          description: 'Permanently delete your account and all data. This action cannot be undone.',
          icon: <Trash2 size={20} />,
          variant: 'danger' as const,
        },
      ]
    },
  ]

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <h1>Please sign in</h1>
            <p>You need to be logged in to access privacy settings.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container container--narrow">
        <header className="settings-page-header">
          <h1>Privacy</h1>
          <p>Control how your information is displayed and managed.</p>
        </header>

        {privacyGroups.map((group) => (
          <section key={group.title} className="settings-card-group">
            <header className="card-group-header">
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </header>
            <div className="privacy-settings-list">
              {group.items.map((item) => {
                const key = item.key
                const isDisabled = item.type === 'danger'
                return (
                  <div key={item.key} className={`privacy-setting ${item.type === 'danger' ? 'danger' : ''}`}>
                    <div className="privacy-setting-info">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="privacy-setting-control">
                      {item.type === 'toggle' && (
                        <label className="toggle-switch">
<input
                            type="checkbox"
                            checked={Boolean(privacy[key])}
                            onChange={() => handleToggle(key)}
                            disabled={isDisabled}
                          />
                          <span className="toggle-slider" aria-hidden="true" />
                        </label>
                      )}
                      {item.type === 'select' && (
<select
                          value={String(privacy[key])}
                          onChange={(e) => handleSelect(key, e.target.value)}
                          disabled={isDisabled}
                          className="privacy-select"
                        >
                          {item.options!.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {item.type === 'danger' && (
                        <button
                          className="btn btn--danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                              alert('Account deletion requires backend integration.')
                            }
                          }}
                          disabled={false}
                        >
                          Delete Account
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        <div className="settings-footer-note">
          <p>Privacy settings are stored locally. Some features require backend integration to take full effect.</p>
        </div>
      </div>
    </main>
  )
}

export default SettingsPrivacy