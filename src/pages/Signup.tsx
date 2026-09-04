import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Building2, Briefcase, Mail, Phone, Lock, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Info,
} from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/layout/Logo'

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

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [step, setStep] = useState<number>(0)
  const [accountType, setAccountType] = useState<AccountType | null>(null)
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

  const checks = passwordChecks(form.password)
  const passwordScore = Object.values(checks).filter(Boolean).length

  function validate(values: typeof form) {
    const e: Record<string, string> = {}
    if (!values.fullName.trim()) e.fullName = 'Full name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email address'
    if (!/^\+?\d{7,15}$/.test(values.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid phone number'
    if (!checks.len || !checks.upper || !checks.lower || !checks.num) {
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
    if (Object.keys(e2).length) {
      setSubmitError('Please fix the highlighted fields.')
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
          termsAccepted: true,
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
    navigate('/login' + (role !== 'customer' ? `?type=${role}` : ''))
  }

  const heading = accountType === 'business_owner'
    ? 'Create your business account'
    : accountType === 'service_provider'
      ? 'Create your professional account'
      : 'Create your account'

  const intro: ReactNode = (
    <div className="signup-intro">
      <Logo to="/" subtitle />
      <h1 className="signup-intro__title">One account for everything in Oyo State.</h1>
      <p className="signup-intro__subtitle">
        Whether you run a business, need a service, or want to offer your skills —
        your single OyoConnect account keeps it all together.
      </p>
      <ul className="signup-intro__points">
        <li><CheckCircle2 size={18} aria-hidden="true" /> One login for Business, Services, Jobs, Community &amp; Help</li>
        <li><CheckCircle2 size={18} aria-hidden="true" /> Switch between workspaces anytime</li>
        <li><CheckCircle2 size={18} aria-hidden="true" /> Upgrade your account as your needs grow</li>
      </ul>
    </div>
  )

  return (
    <div className="signup-page">
      <div className="signup-page__inner">
        <aside className="signup-page__intro">{intro}</aside>

        <main className="signup-page__main">
          <div className="signup-card">
            <ol className="signup-stepper" aria-label="Signup progress">
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
              <div className="signup-step">
                <header className="signup-step__header">
                  <h2 className="signup-step__title">Create your account</h2>
                  <p className="signup-step__lede">Choose how you'll mainly use OyoConnect. You can switch later.</p>
                </header>

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
                  <p className="signup-hint"><Info size={14} aria-hidden="true" /> Pick an account type to continue.</p>
                )}

                <div className="signup-actions">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    disabled={!accountType}
                    onClick={() => setStep(1)}
                  >
                    Continue <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && accountType && (
              <form onSubmit={handleSubmit} noValidate className="signup-step">
                <div className="signup-step__back">
                  <button type="button" className="signup-link" onClick={() => setStep(0)}>
                    <ArrowLeft size={14} aria-hidden="true" /> Change account type
                  </button>
                  <span className="signup-step__selected">
                    {ACCOUNT_TYPES.find((a) => a.type === accountType)?.title}
                  </span>
                </div>

                <header className="signup-step__header">
                  <h2 className="signup-step__title">{heading}</h2>
                </header>

                <div className="signup-field">
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
                </div>

                <div className="signup-field">
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
                </div>

                <div className="signup-field">
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
                </div>

                <div className="signup-field">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    error={touched.password ? errors.password : undefined}
                    rightIcon={
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((s) => !s)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                      </button>
                    }
                    required
                  />
                  {form.password && (
                    <div className="password-strength">
                      <div className={`password-strength__bar password-strength__bar--${passwordScore}`} />
                      <span className="password-strength__label">
                        {['Weak', 'Fair', 'Good', 'Strong'][Math.min(passwordScore - 1, 3)] || 'Weak'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="signup-field">
                  <Input
                    label="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={touched.confirmPassword ? errors.confirmPassword : undefined}
                    rightIcon={
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                      </button>
                    }
                    required
                  />
                </div>

                <label className="signup-terms">
                  <input type="checkbox" checked readOnly /> I agree to the Terms &amp; Privacy Policy
                </label>

                {submitError && (
                  <p className="signup-error" role="alert"><AlertCircle size={15} aria-hidden="true" /> {submitError}</p>
                )}

                <div className="signup-actions">
                  <Button type="submit" variant="primary" size="lg" loading={loading} disabled={loading}>
                    Create account
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && accountType && (
              <div className="signup-step signup-success">
                <span className="signup-success__icon"><CheckCircle2 size={44} aria-hidden="true" /></span>
                <h2 className="signup-step__title">You're all set!</h2>
                <p className="signup-step__lede">
                  {accountType === 'business_owner'
                    ? 'Finish your business profile to start listing services.'
                    : accountType === 'service_provider'
                      ? 'Complete your provider profile so customers can find you.'
                      : 'Start exploring services and opportunities around Oyo State.'}
                </p>
                <div className="signup-actions signup-actions--stack">
                  {accountType === 'business_owner' && (
                    <ButtonLink to="/business/register" variant="primary" size="lg">Set up your business</ButtonLink>
                  )}
                  {accountType === 'service_provider' && (
                    <ButtonLink to="/provider/onboarding" variant="primary" size="lg">Complete provider profile</ButtonLink>
                  )}
                  {accountType === 'customer' && (
                    <ButtonLink to="/dashboard" variant="primary" size="lg">Go to dashboard</ButtonLink>
                  )}
                  <ButtonLink to="/login" variant="ghost" size="lg">I'll do this later</ButtonLink>
                </div>
              </div>
            )}

            <p className="signup-foot">
              Already have an account?{' '}
              <button type="button" className="signup-link signup-link--bold" onClick={handleLoginRedirect}>
                Log in
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
