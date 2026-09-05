import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Building2, Briefcase, HeartHandshake, Megaphone, ShieldCheck, User, Lock } from 'lucide-react'
import { Logo } from '../components/layout/Logo'
import { Input, Button } from '../components/ui'
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
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Logo to="/" subtitle />
          <h1 className="section-heading__title">Welcome back</h1>
          <p className="section-heading__subtitle">Sign in to your OyoConnect account to continue.</p>
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

          <Input
            label="Password"
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            icon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="auth-form-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="auth-checkbox__custom" aria-hidden="true" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="auth-submit" disabled={loading} fullWidth>
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

        <p className="auth-footer auth-footer--bare">
          <Link to="/business/register" className="auth-link">
            <Building2 size={14} /> Want to list a business?
          </Link>
        </p>

        <p className="auth-footer auth-footer--bare">
          <Link to="/provider/onboarding" className="auth-link">
            <Briefcase size={14} /> Want to offer your skills?
          </Link>
        </p>
      </div>
    </main>
  )
}