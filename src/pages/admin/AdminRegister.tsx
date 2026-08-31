import { useCallback, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Crown, Eye, EyeOff, Info } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { SectionHeading } from '../../components/ui/SectionHeading'

interface AdminSetupFieldErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function AdminRegister() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [notice, setNotice] = useState('')
  const [fieldErrors, setFieldErrors] = useState<AdminSetupFieldErrors>({})

  const passwordStrength = useMemo(() => {
    let score = 0
    if (form.password.length >= 8) score += 1
    if (/[A-Z]/.test(form.password)) score += 1
    if (/[0-9]/.test(form.password)) score += 1
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1
    if (score >= 3) return 'Strong'
    if (score === 2) return 'Medium'
    return form.password ? 'Weak' : ''
  }, [form.password])

  const validateForm = useCallback((): boolean => {
    const next: AdminSetupFieldErrors = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    else if (form.fullName.trim().split(/\s+/).length < 2) next.fullName = 'Please enter your full name'
    if (!form.email.trim()) next.email = 'Admin email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password'
    else if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }, [form])

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
    setNotice('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return
    setNotice(
      'Admin account setup is frontend-only. No admin account has been created and no password is saved. Backend integration is required for production.'
    )
  }

  return (
    <main className="page auth-page admin-auth-page">
      <div className="container container--narrow">
        <div className="auth-card">
          <Link to="/admin/login" className="auth-back-link" aria-label="Back to admin login">
            <ArrowLeft size={20} />
          </Link>
          <div className="auth-header">
            <div className="auth-brand">
              <div className="auth-brand-icon auth-brand-icon--admin" aria-hidden="true">
                <Crown size={32} />
              </div>
            </div>
            <SectionHeading
              eyebrow="Admin Setup - Frontend Only"
              title="Admin Setup"
              subtitle="This interface is for frontend development and future backend integration."
            />
          </div>

          <div className="auth-badge auth-badge--dev">
            <Info size={16} aria-hidden="true" />
            <span>Public users should not be able to create administrator accounts in production.</span>
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
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={(event) => setField('fullName', event.target.value)}
              placeholder="Admin full name"
              autoComplete="name"
              error={fieldErrors.fullName}
              required
            />
            <Input
              label="Admin Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
              placeholder="admin@oyoconnect.ng"
              autoComplete="email"
              error={fieldErrors.email}
              required
            />

            <div className="field">
              <label className="field__label" htmlFor="adminSetupPassword">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="adminSetupPassword"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setField('password', event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="input password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordStrength ? <p className="field__hint">Password strength: {passwordStrength}</p> : null}
              {fieldErrors.password ? <p className="field__error">{fieldErrors.password}</p> : null}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="adminSetupConfirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  id="adminSetupConfirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(event) => setField('confirmPassword', event.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className="input password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword ? <p className="field__error">{fieldErrors.confirmPassword}</p> : null}
            </div>

            <Button type="submit" size="lg" className="auth-submit">
              Create Admin Account
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminRegister
