import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateEmail, validateAmount, combineValidations, validateRequired } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { TVProvider, TVPackage, Transaction, ElectricityVerification } from '../../types/bills'

interface TVFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
}

const PLATFORM_FEE = 50

export function TVForm({ onSuccess, onError }: TVFormProps) {
  const [provider, setProvider] = useState<string>('')
  const [smartCardNumber, setSmartCardNumber] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [verified, setVerified] = useState(false)
  const [verificationData, setVerificationData] = useState<ElectricityVerification | null>(null)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [providers, setProviders] = useState<TVProvider[]>([])
  const [packages, setPackages] = useState<TVPackage[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    loadProviders()
    loadWalletBalance()
  }, [])

  useEffect(() => {
    if (provider) {
      loadPackages()
    } else {
      setPackages([])
      setSelectedPackage('')
    }
  }, [provider])

  const loadProviders = async () => {
    try {
      const data = await billsService.getTVProviders()
      setProviders(data)
    } catch {
      setProviders([])
    }
  }

  const loadPackages = async () => {
    try {
      const data = await billsService.getTVPackages(provider)
      setPackages(data)
      setSelectedPackage(data[0]?.id || '')
    } catch {
      setPackages([])
    }
  }

  const loadWalletBalance = async () => {
    try {
      setWalletBalance(0)
    } catch {
      setWalletBalance(0)
    }
  }

  const handleVerify = async () => {
    if (!provider || !smartCardNumber) {
      setErrors((prev) => ({ ...prev, verify: 'Please select a provider and enter smart card number' }))
      return
    }

    setVerifying(true)
    setErrors((prev) => ({ ...prev, verify: undefined }))

    try {
      const result = await billsService.verifyTVCustomer(provider, smartCardNumber.replace(/\s/g, ''))

      if (result.success && result.data) {
        setVerified(true)
        setVerificationData(result.data)
      } else {
        setErrors((prev) => ({ ...prev, verify: result.error || 'Verification failed' }))
        setVerified(false)
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, verify: 'Verification failed. Please try again.' }))
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  const handleSmartCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setSmartCardNumber(value)
    if (errors.smartCardNumber) setErrors((prev) => ({ ...prev, smartCardNumber: undefined }))
    if (verified) {
      setVerified(false)
      setVerificationData(null)
    }
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
      validateRequired(provider, 'provider'),
      validateRequired(smartCardNumber, 'smartCardNumber'),
      validateRequired(selectedPackage, 'package'),
      validatePhoneNumber(phoneNumber),
      validateEmail(email),
    )
    setErrors((prev) => ({ ...prev, ...results.errors }))
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const pkg = packages.find((p) => p.id === selectedPackage)
    if (!pkg) return

    setSubmitting(true)
    try {
      const result = await billsService.subscribeTV({
        providerId: provider,
        smartCardNumber: smartCardNumber.replace(/\s/g, ''),
        packageId: pkg.id,
        duration: pkg.duration,
        amount: pkg.price,
      })

      if (result.success) {
        setSmartCardNumber('')
        setPhoneNumber('')
        setEmail('')
        setVerified(false)
        setVerificationData(null)
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

  const selectedProvider = providers.find((p) => p.id === provider)
  const selectedPkg = packages.find((p) => p.id === selectedPackage)

  return (
    <form onSubmit={handleSubmit} className="tv-form" noValidate>
      <div className="tv-form__wallet-balance">
        <div className="tv-form__balance-item">
          <span className="tv-form__balance-label">Wallet Balance</span>
          <span className="tv-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {selectedPkg && (
          <div className="tv-form__balance-item tv-form__balance-item--remaining">
            <span className="tv-form__balance-label">After Payment</span>
            <span className="tv-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance - selectedPkg.price - PLATFORM_FEE) : '—'}</span>
          </div>
        )}
      </div>

      <div className="form-grid">
        <NetworkSelector
          label="TV Provider"
          networks={providers.map((p) => ({ id: p.id, name: p.name, code: p.code, logo: p.logo, color: p.color, supportsData: false, supportsAirtime: false, supportsSME: false, supportsCorporateGifting: false, ussdCode: '' }))}
          value={provider}
          onChange={setProvider}
          required
          error={errors.provider}
          placeholder="Select TV provider"
          showLogo={true}
        />

        <div className="form-field">
          <label htmlFor="smartCardNumber" className="form-label">
            Smart Card / IUC Number <span className="required">*</span>
          </label>
          <input
            id="smartCardNumber"
            type="text"
            className={`form-input ${errors.smartCardNumber ? 'form-input--error' : ''}`}
            placeholder="Enter smart card number"
            value={smartCardNumber}
            onChange={handleSmartCardChange}
            maxLength={20}
            aria-invalid={!!errors.smartCardNumber}
            aria-describedby={errors.smartCardNumber ? 'smartcard-error' : undefined}
          />
          <div className="form-field-actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={handleVerify}
              disabled={verifying || !provider || !smartCardNumber}
            >
              {verifying ? 'Verifying...' : 'Verify Smart Card'}
            </button>
          </div>
          {errors.verify && <p id="smartcard-error" className="form-error" role="alert">{errors.verify}</p>}
          {errors.smartCardNumber && <p id="smartcard-error" className="form-error" role="alert">{errors.smartCardNumber}</p>}
        </div>
      </div>

      {verified && verificationData && (
        <div className="tv-form__verification">
          <h4>Verification Successful</h4>
          <div className="verification-details">
            <div className="verification-item">
              <strong>Customer Name:</strong> {verificationData.customerName || '—'}
            </div>
            <div className="verification-item">
              <strong>Smart Card:</strong> {verificationData.smartCardNumber}
            </div>
            <div className="verification-item">
              <strong>Current Package:</strong> {verificationData.package || '—'}
            </div>
          </div>
        </div>
      )}

      <div className="tv-form__packages">
        <p className="tv-form__section-label">Select Package</p>
        {packages.length === 0 ? (
          <div className="tv-form__no-packages">
            <p>Select a TV provider to view available packages</p>
          </div>
        ) : (
          <div className="tv-package-grid">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                className={`tv-package-card ${selectedPackage === pkg.id ? 'tv-package-card--selected' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="tv-package-card__header">
                  <h4>{pkg.name}</h4>
                  <span className="tv-package-card__channels">{pkg.channels} channels</span>
                </div>
                <p className="tv-package-card__description">{pkg.description}</p>
                <div className="tv-package-card__footer">
                  <span className="tv-package-card__price">{formatCurrency(pkg.price)}</span>
                  <span className="tv-package-card__duration">{pkg.duration}</span>
                </div>
                {selectedPackage === pkg.id && (
                  <div className="tv-package-card__check" aria-hidden="true">✓</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            className={`form-input ${errors.phoneNumber ? 'form-input--error' : ''}`}
            placeholder="08012345678"
            value={phoneNumber}
            onChange={handlePhoneChange}
            maxLength={14}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
          />
          {errors.phoneNumber && <p id="phone-error" className="form-error" role="alert">{errors.phoneNumber}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            placeholder="email@example.com"
            value={email}
            onChange={handleEmailChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
        </div>
      </div>

      <div className="tv-form__notice">
        <span className="tv-form__notice-icon" aria-hidden="true">ℹ️</span>
        <div>
          <strong>Demo Mode:</strong> This is a simulated transaction. No actual TV subscription will be processed.
          The smart card verification uses demo data.
        </div>
      </div>

      <FeeBreakdown
        servicePrice={selectedPkg?.price ?? 0}
        platformFee={PLATFORM_FEE}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg tv-form__submit"
        disabled={submitting || !verified || !selectedPackage}
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
            Subscribe to TV
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default TVForm