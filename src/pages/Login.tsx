import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Building2, Briefcase, HeartHandshake, Megaphone, ShieldCheck, User, Lock } from 'lucide-react'
import { Logo } from '../components/layout/Logo'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const LOGIN_BENEFITS = [
  { icon: Briefcase, label: 'Discover local businesses' },
  { icon: Megaphone, label: 'Find opportunities' },
  { icon: HeartHandshake, label: 'Support your community' },
  { icon: ShieldCheck, label: 'Stay informed & secure' },
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login, isAuthenticated, user } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const stateFrom = (location.state as { from?: { pathname?: string; search?: string } | string } | null)?.from
  const stateFromPath =
    typeof stateFrom === 'string'
      ? stateFrom
      : stateFrom
        ? `${stateFrom.pathname ?? ''}${stateFrom.search ?? ''}`
        : ''
  const redirect = searchParams.get('redirect') || stateFromPath

  if (isAuthenticated) {
    if (redirect) return <Navigate to={redirect} replace />
    if (user?.role === 'business_owner') return <Navigate to="/business/dashboard" replace />
    if (user?.role === 'service_provider') return <Navigate to="/provider/dashboard" replace />
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Please enter your email or phone and your password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { redirectPath } = await login({ identifier, password, rememberMe }, redirect || undefined, 'main')
      const dest = redirect || redirectPath
      navigate(dest, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page auth-page">
      <div className="auth-split">
        <aside className="auth-split__brand" aria-hidden="true">
          <div className="auth-split__brand-inner">
            <Logo to="/" subtitle />
            <h2 className="auth-split__brand-title">
              Welcome back to OyoConnect — your account for business, jobs, community and help.
            </h2>
            <ul className="auth-split__benefits">
              {LOGIN_BENEFITS.map((b) => (
                <li key={b.label}>
                  <span className="auth-split__benefit-icon">
                    <b.icon size={18} />
                  </span>
                  {b.label}
                </li>
              ))}
            </ul>
            <p className="auth-split__brand-note">
              One account for everything OyoConnect. We&apos;ll take you to the right dashboard based on your account type.
            </p>
          </div>
        </aside>

        <div className="auth-split__panel">
          <div className="auth-mobile-header">
            <Logo to="/" subtitle />
          </div>

          <div className="auth-card auth-card--wide">
            <Link to="/" className="auth-back-link">
              <ArrowLeft size={18} /> Back
            </Link>

            <div className="auth-header">
              <span className="auth-eyebrow">Sign in</span>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to your OyoConnect account to continue.</p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <Input
                label="Email or Phone Number"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone number"
                autoComplete="username"
                required
                icon={<User size={18} />}
              />

              <div className="field">
                <label className="field__label" htmlFor="login-password">
                  Password <span className="required" aria-hidden="true">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <Lock size={18} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input password-input"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-form-row">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-custom" aria-hidden="true" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-link">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="btn__spinner" aria-hidden="true" /> Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="auth-footer">
              Don&apos;t have an account?{' '}
              <Link to={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="auth-link">
                Create account
              </Link>
            </p>

            <p className="auth-footer" style={{ marginTop: 8 }}>
              <Link to="/business/register" className="auth-link auth-link--secondary">
                <Building2 size={14} /> Want to list a business?
              </Link>
            </p>

            <p className="auth-footer" style={{ marginTop: 8 }}>
              <Link to="/provider/onboarding" className="auth-link auth-link--secondary">
                <Briefcase size={14} /> Want to offer your skills?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
