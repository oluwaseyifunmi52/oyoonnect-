import { useState } from 'react'
import { Bell, Mail, Store, Heart, TrendingUp, AlertTriangle } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAuth } from '../context/AuthContext'

type NotificationKey = 
  | 'serviceUpdates'
  | 'businessActivity'
  | 'helpUpdates'
  | 'promotionalOffers'
  | 'weeklyDigest'
  | 'newBusinessAlerts'
  | 'serviceReminders'
  | 'securityAlerts'

interface NotificationsState {
  [key: string]: boolean
  serviceUpdates: boolean
  businessActivity: boolean
  helpUpdates: boolean
  promotionalOffers: boolean
  weeklyDigest: boolean
  newBusinessAlerts: boolean
  serviceReminders: boolean
  securityAlerts: boolean
}

export function SettingsNotifications() {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<NotificationsState>({
    serviceUpdates: true,
    businessActivity: true,
    helpUpdates: false,
    promotionalOffers: false,
    weeklyDigest: true,
    newBusinessAlerts: false,
    serviceReminders: true,
    securityAlerts: true,
  })

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <h1>Please sign in</h1>
            <p>You need to be logged in to access notification settings.</p>
          </div>
        </div>
      </main>
    )
  }

  const handleToggle = (key: NotificationKey) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationGroups = [
    {
      title: 'Service Updates',
      description: 'Updates about your digital services and transactions.',
      items: [
        { key: 'serviceUpdates', title: 'Service updates', description: 'Receive updates about your data, airtime, and bill payments.' },
        { key: 'serviceReminders', title: 'Service reminders', description: 'Get reminded about upcoming renewals and expiring services.' },
      ]
    },
    {
      title: 'Business & Listings',
      description: 'Updates about your saved and listed businesses.',
      items: [
        { key: 'businessActivity', title: 'Business activity', description: 'Get updates about your saved businesses and new listings.' },
        { key: 'newBusinessAlerts', title: 'New business alerts', description: 'Get notified when new businesses are added in your area.' },
      ]
    },
    {
      title: 'Community & Help',
      description: 'Updates about OyoConnect Help and community requests.',
      items: [
        { key: 'helpUpdates', title: 'Help updates', description: 'Receive updates about support requests you\'re following.' },
      ]
    },
    {
      title: 'Marketing & Updates',
      description: 'Optional updates about OyoConnect features and offers.',
      items: [
        { key: 'promotionalOffers', title: 'Promotional offers', description: 'Receive special offers and promotions from OyoConnect partners.' },
        { key: 'weeklyDigest', title: 'Weekly digest', description: 'Receive a weekly summary of popular businesses and trends.' },
      ]
    },
    {
      title: 'Security',
      description: 'Important security notifications.',
      items: [
        { key: 'securityAlerts', title: 'Security alerts', description: 'Receive alerts about suspicious login attempts and account changes.' },
      ]
    },
  ]

  return (
    <main className="page">
      <div className="container container--narrow">
        <header className="settings-page-header">
          <h1>Notifications</h1>
          <p>Choose which updates you want to receive and how you want to receive them.</p>
        </header>

        {notificationGroups.map((group) => (
          <section key={group.title} className="settings-card-group">
            <header className="card-group-header">
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </header>
            <div className="notification-settings-list">
              {group.items.map((item) => (
                <label key={item.key} className="notification-toggle-card">
                  <div className="notification-toggle-info">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleToggle(item.key as NotificationKey)}
                      disabled={item.key === 'securityAlerts'}
                    />
                    <span className="toggle-slider" aria-hidden="true" />
                  </div>
                  {item.key === 'securityAlerts' && (
                    <span className="toggle-locked-hint" title="Security alerts cannot be disabled">
                      <span className="lock-icon" aria-hidden="true">🔒</span>
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <div className="settings-footer-note">
          <p>Email and push notifications require backend integration. Currently, preferences are stored locally in your browser.</p>
        </div>
      </div>
    </main>
  )
}

export default SettingsNotifications