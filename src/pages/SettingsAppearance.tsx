import { Monitor, Sun, Moon, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export function SettingsAppearance() {
  const { isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()
  const themes = [
    { value: 'light' as const, label: 'Light', description: 'Use a bright interface', icon: <Sun size={24} /> },
    { value: 'dark' as const, label: 'Dark', description: 'Use a darker interface', icon: <Moon size={24} /> },
    { value: 'system' as const, label: 'System', description: 'Match your device settings', icon: <Monitor size={24} /> },
  ]
  if (!isAuthenticated) {
    return <main className="page auth-page"><div className="container container--narrow"><div className="auth-card"><h1>Please sign in</h1><p>You need to be logged in to access appearance settings.</p></div></div></main>
  }
  return (
    <main className="page">
      <div className="container container--narrow">
        <header className="settings-page-header"><h1>Appearance</h1><p>Customize how OyoConnect looks and feels.</p></header>
        <section className="settings-card-group">
          <header className="card-group-header"><h2>Theme</h2><p>Choose your preferred color scheme.</p></header>
          <div className="theme-options">
            {themes.map(t=>(
              <label key={t.value} className={`theme-option ${theme===t.value?'selected':''}`}>
                <div className="theme-option-icon">{t.icon}</div>
                <div className="theme-option-content"><h3>{t.label}</h3><p>{t.description}</p></div>
                <div className="theme-option-indicator">{theme===t.value && <Check size={20}/>}</div>
                <input type="radio" name="theme" value={t.value} checked={theme===t.value} onChange={()=>setTheme(t.value)} className="visually-hidden"/>
              </label>
            ))}
          </div>
        </section>
        <div className="settings-footer-note"><p>Dark mode applies immediately and is saved locally.</p></div>
      </div>
    </main>
  )
}
export default SettingsAppearance
