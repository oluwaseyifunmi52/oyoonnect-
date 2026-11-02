import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import {
  User, Building2, Briefcase, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Info,
} from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/layout/Logo'
import './Login.css'
import './Signup.css'

type AccountType = 'customer' | 'service_provider' | 'business_owner'

interface AccountOption {
  type: AccountType
  icon: typeof User
  title: string
  description: string
  bullets: string[]
}

const ACCOUNT_TYPES: AccountOption[] = [
  {
    type: 'business_owner',
    icon: Building2,
    title: 'Manage a Business',
    description: 'Register your business, manage your profile, find workers, and connect with customers.',
    bullets: ['Business profile', 'Service listings', 'Customer leads'],
  },
  {
    type: 'customer',
    icon: User,
    title: 'Find a Worker or Service',
    description: 'Find skilled professionals, request services, and hire people for the work you need done.',
    bullets: ['Find professionals', 'Request a service', 'Access all features'],
  },
  {
    type: 'service_provider',
    icon: Briefcase,
    title: 'Offer Your Skills or Services',
    description: 'Create a professional profile, showcase your skills, and connect with people looking for your services.',
    bullets: ['Showcase skills', 'Manage requests', 'Get discovered'],
  },
]

const STEPS = ['Account type', 'Your details', 'Done']

function passwordChecks(pw: string) {
  return {
    len: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    num: /[0-9]/.test(pw),
  }
}

function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="password-toggle"
      onClick={onToggle}
      tabIndex={-1}
      aria-label={shown ? 'Hide password' : 'Show password'}
    >
      {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
    </button>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { signup } = useAuth()
  const [step, setStep] = useState<number>(0)
  const [accountType, setAccountType] = useState<AccountType | null>(() => {
    const requestedRole = searchParams.get('role')
    return ACCOUNT_TYPES.some((option) => option.type === requestedRole)
      ? requestedRole as AccountType
      : null
  })
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const stateFrom = (location.state as { from?: { pathname?: string; search?: string } | string } | null)?.from
  const stateFromPath =
    typeof stateFrom === 'string'
      ? stateFrom
      : stateFrom
        ? `${stateFrom.pathname ?? ''}${stateFrom.search ?? ''}`
        : ''
  const redirect = searchParams.get('redirect') || stateFromPath

  const checks = passwordChecks(form.password)
  const passwordScore = Object.values(checks).filter(Boolean).length

  function validate(values: typeof form) {
    const e: Record<string, string> = {}
    if (!values.fullName.trim()) e.fullName = 'Full name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email address'
    if (!/^\+?\d{7,15}$/.test(values.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid phone number'
    const checksForValue = passwordChecks(values.password)
    if (!checksForValue.len || !checksForValue.upper || !checksForValue.lower || !checksForValue.num) {
      e.password = 'Password must be 8+ chars with upper, lower & number'
    }
    if (values.confirmPassword !== values.password) e.confirmPassword = 'Passwords do not match'
    return e
  }

  function handleChange(field: keyof typeof form, value: string) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) setErrors(validate(next))
  }

  function handleBlur(field: keyof typeof form) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(form))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const e2 = validate(form)
    setErrors(e2)
    setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true })
    if (Object.keys(e2).length || !termsAccepted) {
      setSubmitError(!termsAccepted ? 'Please agree to the Terms & Privacy Policy to continue.' : 'Please fix the highlighted fields.')
      return
    }
    setLoading(true)
    setSubmitError('')
    try {
      await signup(
        {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
          role: accountType ?? 'customer',
          termsAccepted,
        },
        '/signup',
      )
      setStep(2)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleLoginRedirect() {
    const role = accountType ?? 'customer'
    const params = new URLSearchParams()
    if (role !== 'customer') params.set('type', role)
    if (redirect) params.set('redirect', redirect)
    const query = params.toString()
    navigate(`/login${query ? `?${query}` : ''}`)
  }

  const heading = accountType === 'business_owner'
    ? 'Create your business account'
    : accountType === 'service_provider'
      ? 'Create your professional account'
      : 'Create your account'

  return (
    <main className="login-page login-page--signup">
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
        <div className="login-page__form-card signup-card-wide">
          <div className="login-page__form-header">
            <Logo subtitle link={false} />
            <h1 className="section-heading__title">Create your account</h1>
            <p className="section-heading__subtitle">
              One account for everything in Oyo State — run a business, offer services, or find what you need.
            </p>
          </div>

          <ol className="signup-stepper" aria-label="Signup progress" style={{ marginBottom: '24px' }}>
            {STEPS.map((label, i) => {
              const isDone = i < step
              const isCurrent = i === step
              return (
                <li
                  key={label}
                  className={`signup-stepper__item ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="signup-stepper__dot">
                    {isDone ? <CheckCircle2 size={14} aria-hidden="true" /> : i + 1}
                  </span>
                  <span className="signup-stepper__label">{label}</span>
                </li>
              )
            })}
          </ol>

          {step === 0 && (
            <div className="auth-form">
              <div className="account-type-grid">
                {ACCOUNT_TYPES.map((opt) => {
                  const Icon = opt.icon
                  const selected = accountType === opt.type
                  return (
                    <button
                      type="button"
                      key={opt.type}
                      className={`account-type-card ${selected ? 'is-selected' : ''}`}
                      onClick={() => setAccountType(opt.type)}
                      aria-pressed={selected}
                    >
                      <span className="account-type-card__icon"><Icon size={24} aria-hidden="true" /></span>
                      <span className="account-type-card__body">
                        <span className="account-type-card__title">{opt.title}</span>
                        <span className="account-type-card__desc">{opt.description}</span>
                        <span className="account-type-card__bullets">
                          {opt.bullets.map((b) => (
                            <span key={b} className="account-type-card__bullet">{b}</span>
                          ))}
                        </span>
                      </span>
                      {selected && (
                        <span className="account-type-card__check" aria-hidden="true">
                          <CheckCircle2 size={20} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {!accountType && (
                <p className="auth-notice"><Info size={16} aria-hidden="true" /> Pick an account type to continue.</p>
              )}

              <div className="signup-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={!accountType}
                  onClick={() => setStep(1)}
                  fullWidth
                  className="auth-submit"
                >
                  Continue <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && accountType && (
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              <div className="signup-step__back">
                <button type="button" className="auth-link" onClick={() => setStep(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} aria-hidden="true" /> Change account type
                </button>
                <span className="signup-step__selected">
                  {ACCOUNT_TYPES.find((a) => a.type === accountType)?.title}
                </span>
              </div>

              <h2 className="section-heading__title signup-step__heading">{heading}</h2>

              <Input
                label="Full name"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                error={touched.fullName ? errors.fullName : undefined}
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                required
              />

              <Input
                label="Phone number"
                type="tel"
                name="phone"
                autoComplete="off"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={touched.phone ? errors.phone : undefined}
                required
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={touched.password ? errors.password : undefined}
                  rightIcon={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
                  required
                />
                {form.password && (
                  <div className="password-strength" data-score={passwordScore}>
                    <div className={`password-strength__bar password-strength__bar--${passwordScore}`} />
                    <span className="password-strength__label">
                      {['Weak', 'Fair', 'Good', 'Strong'][Math.min(passwordScore - 1, 3)] || 'Weak'}
                    </span>
                  </div>
                )}
              </div>

              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                rightIcon={<PasswordToggle shown={showConfirmPassword} onToggle={() => setShowConfirmPassword((s) => !s)} />}
                required
              />

              <label className="auth-checkbox signup-terms">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
                <span className="auth-checkbox__custom" aria-hidden="true" />
                <span>I agree to the Terms & Privacy Policy</span>
              </label>

              {submitError && (
                <p className="auth-error" role="alert"><AlertCircle size={16} aria-hidden="true" /> {submitError}</p>
              )}

              <div className="signup-actions">
                <Button type="submit" variant="primary" size="lg" loading={loading} disabled={loading} fullWidth className="auth-submit">
                  Create account
                </Button>
              </div>
            </form>
          )}

          {step === 2 && accountType && (
            <div className="auth-form signup-success">
              <span className="signup-success__icon"><CheckCircle2 size={44} aria-hidden="true" /></span>
              <h2 className="section-heading__title">You're all set!</h2>
              <p className="section-heading__subtitle">
                {accountType === 'business_owner'
                  ? 'Finish your business profile to start listing services.'
                  : accountType === 'service_provider'
                    ? 'Complete your provider profile so customers can find you.'
                    : 'Start exploring services and opportunities around Oyo State.'}
              </p>
              <div className="signup-actions signup-actions--stack">
                {accountType === 'business_owner' && (
                  <ButtonLink to="/business/register" variant="primary" size="lg" fullWidth className="auth-submit">Set up your business</ButtonLink>
                )}
                {accountType === 'service_provider' && (
                  <ButtonLink to="/provider/onboarding" variant="primary" size="lg" fullWidth className="auth-submit">Complete provider profile</ButtonLink>
                )}
                {accountType === 'customer' && (
                  <ButtonLink to="/dashboard" variant="primary" size="lg" fullWidth className="auth-submit">Go to dashboard</ButtonLink>
                )}
                <ButtonLink to="/login" variant="ghost" size="lg" fullWidth>I'll do this later</ButtonLink>
              </div>
            </div>
          )}

          <p className="auth-footer">
            Already have an account?{' '}
            <button type="button" className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }} onClick={handleLoginRedirect}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
