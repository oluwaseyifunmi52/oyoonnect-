import { useState, useCallback } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Info } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { authService, AUTH_PROVIDER } from '../services/authService'

const DEV_RECOVERY_MESSAGE = "Password recovery will be available when OyoConnect's backend authentication system is connected."

type ForgotPasswordStep = 'request' | 'success'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ForgotPasswordStep>('request')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

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
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page auth-page">
      <div className="container container--narrow">
        <div className="auth-card">
          {step === 'request' && (
            <>
              <div className="auth-header">
                <Link to="/login" className="auth-back-link" aria-label="Back to login">
                  <ArrowLeft size={20} />
                </Link>
                <SectionHeading
                  eyebrow="Forgot Password"
                  title="Reset your password"
                  subtitle="Enter your email address and we'll send you a link to reset your password."
                />
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
                Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            </>
          )}

          {step === 'success' && (
            <div className="auth-card success-state">
              <div className="success-icon">
                <CheckCircle2 size={48} />
              </div>
              <h1>Check your email</h1>
              <p>We've sent a password reset link to <strong>{email}</strong>.</p>
              <p className="auth-success-note">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
              <div className="auth-success-actions">
                <ButtonLink to="/login" variant="primary" size="lg">
                  Back to Sign In
                </ButtonLink>
                <ButtonLink to="/forgot-password" variant="outline" size="lg" onClick={() => { setEmail(''); setStep('request'); }}>
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