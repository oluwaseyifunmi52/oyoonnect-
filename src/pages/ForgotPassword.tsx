import { useState, useCallback } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Info } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { authService, AUTH_PROVIDER } from '../services/authService'
import { Logo } from '../components/layout/Logo'
import './Login.css'

const DEV_RECOVERY_MESSAGE = "Password recovery will be available when OyoConnect's backend authentication system is connected."

type ForgotPasswordStep = 'request' | 'success'

function ForgotPassword() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<ForgotPasswordStep>('request')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const stateFrom = (location.state as { from?: { pathname?: string; search?: string } | string } | null)?.from
  const stateFromPath =
    typeof stateFrom === 'string'
      ? stateFrom
      : stateFrom
        ? `${stateFrom.pathname ?? ''}${stateFrom.search ?? ''}`
        : ''
  const redirect = searchParams.get('redirect') || stateFromPath
  const loginPath = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'

  const isDevAuth = AUTH_PROVIDER === 'dev'

  const validateEmail = useCallback((value: string) => {
    const newErrors = { ...fieldErrors }
    if (!value.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = 'Please enter a valid email address'
    }
    setFieldErrors(newErrors)
    return !newErrors.email
  }, [fieldErrors])

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateEmail(email)) return

    setError('')
    setLoading(true)

    try {
      const result = await authService.forgotPassword({ email })
      if (result.success) {
        setStep('success')
      } else {
        setError(result.message)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
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
            <Link to={loginPath} className="auth-back-link" aria-label="Back to login">
              <ArrowLeft size={20} />
            </Link>
            <Logo subtitle link={false} />
            <h1 className="section-heading__title">Reset your password</h1>
            <p className="section-heading__subtitle">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {isDevAuth && (
            <div className="auth-notice" role="status">
              <Info size={18} aria-hidden="true" />
              <span>{DEV_RECOVERY_MESSAGE}</span>
            </div>
          )}
          {error && (
            <div className="auth-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {step === 'request' && (
            <>
              <form onSubmit={handleRequestReset} className="auth-form" noValidate>
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) validateEmail(e.target.value)
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  autoComplete="email"
                  icon={<Mail size={18} />}
                  error={fieldErrors.email}
                />

                <Button type="submit" size="lg" className="auth-submit" disabled={loading || isDevAuth} title={isDevAuth ? DEV_RECOVERY_MESSAGE : undefined} fullWidth>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="btn__spinner" aria-hidden="true" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <p className="auth-footer">
                Remember your password? <Link to={loginPath} className="auth-link">Sign in</Link>
              </p>
            </>
          )}

          {step === 'success' && (
            <div className="auth-form signup-success">
              <div className="success-icon">
                <CheckCircle2 size={48} />
              </div>
              <h1>Check your email</h1>
              <p>We've sent a password reset link to <strong>{email}</strong>.</p>
              <p className="auth-success-note">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
              <div className="auth-success-actions">
                <ButtonLink to={loginPath} variant="primary" size="lg" fullWidth className="auth-submit">
                  Back to Sign In
                </ButtonLink>
                <ButtonLink to="/forgot-password" variant="outline" size="lg" fullWidth onClick={() => { setEmail(''); setStep('request'); }}>
                  Resend Email
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword
