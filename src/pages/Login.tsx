import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, Building2, Briefcase, ChevronRight, User, Lock } from 'lucide-react'
import { Logo } from '../components/layout/Logo'
import { Input } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import './Login.css'

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
    <main className="login-page login-page--signin">
      <div className="login-page__hero" aria-hidden="true">
        <div className="login-page__hero-gradient" />
        <img
          src="/images/oyo-hero.jpg"
          alt=""
          className="login-page__hero-image"
          loading="eager"
        />
        <div className="login-page__hero-content">
          <Logo subtitle />
          <p className="login-page__eyebrow">OYO STATE, NIGERIA</p>
          <h1 className="login-page__hero-title">Together for a better Oyo</h1>
          <p className="login-page__hero-description">
            One platform to find services, hire talent, grow your business,
            and connect with your community across all 33 LGAs.
          </p>
        </div>
      </div>

      <div className="login-page__form-wrapper">
        <div className="login-page__form-card">
          <div className="login-page__form-header">
            <Logo subtitle link={false} />
            <h1 className="login-page__heading">Welcome back</h1>
            <p className="login-page__subheading">Sign in to your OyoConnect account to continue.</p>
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

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-external-actions">
            <Link
              to="/business/register"
              className="auth-external-btn"
            >
              <span className="auth-external-btn__icon">
                <Building2 size={18} aria-hidden="true" />
              </span>
              <span className="auth-external-btn__text">List your business</span>
              <ChevronRight size={16} aria-hidden="true" className="auth-external-btn__arrow" />
            </Link>
            <Link
              to="/provider/onboarding"
              className="auth-external-btn"
            >
              <span className="auth-external-btn__icon">
                <Briefcase size={18} aria-hidden="true" />
              </span>
              <span className="auth-external-btn__text">Offer your skills</span>
              <ChevronRight size={16} aria-hidden="true" className="auth-external-btn__arrow" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
