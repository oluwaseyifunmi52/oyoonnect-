import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Crown, Eye, EyeOff, Info, ShieldAlert } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateField = useCallback((name: string, value: string) => {
    const next = { ...fieldErrors }
    if (name === 'email') {
      if (!value.trim()) next.email = 'Admin email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) next.email = 'Please enter a valid email address'
      else delete next.email
    }
    if (name === 'password') {
      if (!value) next.password = 'Password is required'
      else delete next.password
    }
    setFieldErrors(next)
    return !next[name]
  }, [fieldErrors])

  const validateForm = useCallback((): boolean => {
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = 'Admin email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email address'
    if (!password) next.password = 'Password is required'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }, [email, password])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return
    setNotice(
      'Restricted Area - admin authentication requires backend integration. No login is performed in this frontend preview. Visit /admin/dashboard directly to preview the admin panel.'
    )
  }

  return (
    <main className="page auth-page admin-auth-page">
      <div className="container container--narrow">
        <div className="auth-card">
          <Link to="/" className="auth-back-link" aria-label="Back to home">
            <ArrowLeft size={20} />
          </Link>
          <div className="auth-header">
            <div className="auth-brand">
              <div className="auth-brand-icon auth-brand-icon--admin" aria-hidden="true">
                <Crown size={32} />
              </div>
            </div>
            <SectionHeading
              eyebrow="Admin"
              title="Admin Login"
              subtitle="This portal is for authorized OyoConnect administrators only."
            />
          </div>

          <div className="auth-badge">
            <ShieldAlert size={16} aria-hidden="true" />
            <span>Restricted Area</span>
          </div>

          {Object.keys(fieldErrors).length > 0 ? (
            <div className="auth-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>Please correct the highlighted fields.</span>
            </div>
          ) : null}

          {notice ? (
            <div className="auth-info" role="status">
              <Info size={18} aria-hidden="true" />
              <span>{notice}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <Input
              label="Admin Email"
              id="adminEmail"
              name="email"
              type="email"
              placeholder="admin@oyoconnect.ng"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (fieldErrors.email) validateField('email', event.target.value)
              }}
              onBlur={(event) => validateField('email', event.target.value)}
              autoComplete="username"
              error={fieldErrors.email}
            />

            <Input
              label="Password"
              id="adminPassword"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (fieldErrors.password) validateField('password', event.target.value)
              }}
              onBlur={(event) => validateField('password', event.target.value)}
              autoComplete="current-password"
              error={fieldErrors.password}
              rightIcon={
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Button type="submit" size="lg" className="auth-submit" fullWidth>
              Admin Sign In
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin
