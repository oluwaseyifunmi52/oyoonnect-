import { useState, useEffect } from 'react'
import { Share2, CreditCard, ArrowRight, Globe, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateEmail, validateAmount, combineValidations, validateRequired, validateUrl } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { SocialMediaPlatform, SocialMediaService, Transaction } from '../../types/bills'

interface SocialMediaFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
}

const PLATFORM_FEE = 50

export function SocialMediaForm({ onSuccess, onError }: SocialMediaFormProps) {
  const [platform, setPlatform] = useState<string>('')
  const [service, setService] = useState<string>('')
  const [targetUrl, setTargetUrl] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [platforms, setPlatforms] = useState<SocialMediaPlatform[]>([])
  const [services, setServices] = useState<SocialMediaService[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    loadPlatforms()
    loadWalletBalance()
  }, [])

  useEffect(() => {
    if (platform) {
      loadServices()
    } else {
      setServices([])
      setService('')
    }
  }, [platform])

  const loadPlatforms = async () => {
    try {
      const data = await billsService.getSocialMediaPlatforms()
      setPlatforms(data)
      if (data.length > 0) {
        setPlatform(data[0].id)
      }
    } catch {
      setPlatforms([])
    }
  }

  const loadServices = async () => {
    try {
      const platformData = platforms.find((p) => p.id === platform)
      if (platformData) {
        setServices(platformData.services)
        setService(platformData.services[0]?.id || '')
      } else {
        setServices([])
      }
    } catch {
      setServices([])
    }
  }

  const loadWalletBalance = async () => {
    try {
      setWalletBalance(0)
    } catch {
      setWalletBalance(0)
    }
  }

  const selectedPlatform = platforms.find((p) => p.id === platform)
  const selectedService = services.find((s) => s.id === service)
  const totalAmount = selectedService ? selectedService.price * quantity : 0

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(selectedService?.minQuantity || 1, Math.min(selectedService?.maxQuantity || 1000, parseInt(e.target.value) || 1))
    setQuantity(value)
  }

  const handleTargetUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUrl(e.target.value)
    if (errors.targetUrl) setErrors((prev) => ({ ...prev, targetUrl: undefined }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '')
    setPhoneNumber(value)
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
  }

  const validateForm = (): boolean => {
    const results = combineValidations(
      validateRequired(platform, 'platform'),
      validateRequired(service, 'service'),
      validateRequired(targetUrl, 'targetUrl'),
      validateUrl(targetUrl),
      validateRequired(String(quantity), 'quantity'),
      validateAmount(quantity, selectedService?.minQuantity || 1, selectedService?.maxQuantity || 1000),
      validatePhoneNumber(phoneNumber),
      validateEmail(email),
    )
    setErrors(results.errors)
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const platformData = platforms.find((p) => p.id === platform)
    const serviceData = services.find((s) => s.id === service)
    if (!platformData || !serviceData) return

    setSubmitting(true)
    try {
      const result = await billsService.purchaseSocialMedia({
        platformId: platform,
        serviceId: service,
        targetUrl: targetUrl,
        quantity,
        amount: serviceData.price * quantity,
      })

      if (result.success) {
        setTargetUrl('')
        setQuantity(1)
        setPhoneNumber('')
        setEmail('')
        onSuccess?.(result.transaction)
      } else {
        onError?.(result.message || 'Transaction failed')
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="social-media-form" noValidate>
      <div className="social-media-form__wallet-balance">
        <div className="social-media-form__balance-item">
          <span className="social-media-form__balance-label">Wallet Balance</span>
          <span className="social-media-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {totalAmount > 0 && (
          <div className="social-media-form__balance-item social-media-form__balance-item--remaining">
            <span className="social-media-form__balance-label">After Purchase</span>
            <span className="social-media-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance - totalAmount - PLATFORM_FEE) : '—'}</span>
          </div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Platform <span className="required">*</span></label>
          <div className="platform-selector">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`platform-option ${platform === p.id ? 'platform-option--selected' : ''}`}
                onClick={() => {
                  setPlatform(p.id)
                  setService('')
                }}
                style={{ '--platform-color': p.color } as React.CSSProperties}
              >
                <span className="platform-option__icon" style={{ backgroundColor: p.color }} aria-hidden="true">
                  <Globe size={20} />
                </span>
                <span className="platform-option__name">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedPlatform && (
        <div className="social-media-form__services">
          <p className="social-media-form__section-label">Select Service</p>
          <div className="social-media-form__service-grid">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`social-media-form__service-card ${service === s.id ? 'social-media-form__service-card--selected' : ''}`}
                onClick={() => setService(s.id)}
              >
                <h4>{s.name}</h4>
                <p>{s.description}</p>
                <div className="social-media-form__service-footer">
                  <span className="social-media-form__service-price">{formatCurrency(s.price)}</span>
                  <span className="social-media-form__service-unit">per {s.unit}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="targetUrl" className="form-label">
            Profile/Post URL <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <Globe size={18} className="input-icon" aria-hidden="true" />
            <input
              id="targetUrl"
              type="url"
              className={`form-input ${errors.targetUrl ? 'form-input--error' : ''}`}
              placeholder="https://instagram.com/username or https://instagram.com/p/..."
              value={targetUrl}
              onChange={handleTargetUrlChange}
              aria-invalid={!!errors.targetUrl}
              aria-describedby={errors.targetUrl ? 'target-url-error' : undefined}
            />
          </div>
          {errors.targetUrl && <p id="target-url-error" className="form-error" role="alert">{errors.targetUrl}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="quantity" className="form-label">
            Quantity <span className="required">*</span>
          </label>
          <div className="quantity-selector">
            <button
              type="button"
              className="quantity-btn"
              onClick={() => setQuantity(Math.max(selectedService?.minQuantity || 1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={handleQuantityChange}
              min={selectedService?.minQuantity || 1}
              max={selectedService?.maxQuantity || 1000}
            />
            <button
              type="button"
              className="quantity-btn"
              onClick={() => setQuantity(Math.min(selectedService?.maxQuantity || 1000, quantity + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {selectedService && (
            <p className="social-media-form__quantity-hint">
              {quantity} × {formatCurrency(selectedService.price)} = {formatCurrency(selectedService.price * quantity)}
            </p>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              id="phoneNumber"
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'form-input--error' : ''}`}
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9+]/g, '')
                setPhoneNumber(value)
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
              }}
              maxLength={14}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
            />
          </div>
          {errors.phoneNumber && <p id="phone-error" className="form-error" role="alert">{errors.phoneNumber}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
        </div>
      </div>

      <div className="social-media-form__notice">
        <AlertTriangle size={18} aria-hidden="true" />
        <div>
          <strong>Important:</strong> This is a demo transaction. No real social media service will be delivered.
          Results are simulated for demonstration purposes only.
        </div>
      </div>

      <FeeBreakdown
        servicePrice={totalAmount}
        platformFee={PLATFORM_FEE}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg social-media-form__submit"
        disabled={submitting || !platform || !service || !targetUrl}
      >
        {submitting ? (
          <>
            <span className="btn-spinner" aria-hidden="true"></span>
            Processing...
          </>
        ) : walletBalance === 0 ? (
          'Connect wallet to continue'
        ) : (
          <>
            Order Social Media Service
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default SocialMediaForm