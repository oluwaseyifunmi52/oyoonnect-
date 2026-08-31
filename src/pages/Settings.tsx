import { NavLink } from 'react-router-dom'
import { User, Shield, Bell, Monitor, Eye, Lock, Key, AlertTriangle, LogOut, Building2, ChevronRight, HelpCircle } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAuth } from '../context/AuthContext'

const settingsCategories = [
  {
    group: 'Account',
    items: [
      {
        key: 'personal',
        title: 'Personal Information',
        description: 'Update your name, profile photo, and personal details.',
        icon: User,
        path: '/profile',
      },
      {
        key: 'security',
        title: 'Security',
        description: 'Manage your password, two-factor authentication, and account security.',
        icon: Shield,
        path: '/settings/security',
      },
    ]
  },
  {
    group: 'Preferences',
    items: [
      {
        key: 'notifications',
        title: 'Notifications',
        description: 'Choose which updates you want to receive and how.',
        icon: Bell,
        path: '/settings/notifications',
      },
      {
        key: 'appearance',
        title: 'Appearance',
        description: 'Customize how OyoConnect looks and feels.',
        icon: Monitor,
        path: '/settings/appearance',
      },
    ]
  },
  {
    group: 'Privacy & Data',
    items: [
      {
        key: 'privacy',
        title: 'Privacy',
        description: 'Control how your information is displayed and managed.',
        icon: Eye,
        path: '/settings/privacy',
      },
    ]
  },
  {
    group: 'Help & Support',
    items: [
      {
        key: 'help',
        title: 'Help Center',
        description: 'Get help, request support, or browse help categories.',
        icon: HelpCircle,
        path: '/help',
      },
    ]
  },
]

export function Settings() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <h1>Please sign in</h1>
            <p>You need to be logged in to access your settings.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container container--narrow">
        <header className="settings-page-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and customize your OyoConnect experience.</p>
        </header>

        {settingsCategories.map((category) => (
          <section key={category.group} className="settings-card-group">
            <header className="card-group-header">
              <h2>{category.group}</h2>
            </header>
            <div className="settings-cards">
              {category.items.map((item) => (
                <NavLink key={item.key} to={item.path} className="settings-card">
                  <div className="settings-card-icon">
                    <item.icon size={24} aria-hidden="true" />
                  </div>
                  <div className="settings-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <ChevronRight size={20} aria-hidden="true" />
                </NavLink>
              ))}
            </div>
          </section>
        ))}

        <section className="settings-card-group danger-zone">
          <header className="card-group-header">
            <h2>Account Actions</h2>
          </header>
          <div className="settings-cards">
            <NavLink to="/" className="settings-card danger" onClick={() => { logout(); }}>
              <div className="settings-card-icon danger">
                <LogOut size={24} aria-hidden="true" />
              </div>
              <div className="settings-card-content">
                <h3>Sign Out</h3>
                <p>Sign out of your OyoConnect account.</p>
              </div>
              <ChevronRight size={20} aria-hidden="true" />
            </NavLink>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Settings