import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateAmount, combineValidations, validateRequired } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { Network, ElectricityProvider, Transaction, ElectricityVerification } from '../../types/bills'

interface ElectricityFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
}

const PLATFORM_FEE = 50
const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 20000]

export function ElectricityForm({ onSuccess, onError }: ElectricityFormProps) {
  const [provider, setProvider] = useState<string>('')
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid')
  const [meterNumber, setMeterNumber] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [verified, setVerified] = useState(false)
  const [verificationData, setVerificationData] = useState<ElectricityVerification | null>(null)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [providers, setProviders] = useState<ElectricityProvider[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    loadProviders()
    loadWalletBalance()
  }, [])

  const loadProviders = async () => {
    try {
      const data = await billsService.getElectricityProviders()
      setProviders(data)
    } catch {
      setProviders([])
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
    if (!provider || !meterNumber || !meterType) {
      setErrors((prev) => ({ ...prev, verify: 'Please fill in all required fields' }))
      return
    }

    setVerifying(true)
    setErrors((prev) => ({ ...prev, verify: undefined }))

    try {
      const result = await billsService.verifyMeter({
        providerId: provider,
        meterNumber: meterNumber.replace(/\s/g, ''),
        meterType,
      })

      if (result.success && result.data) {
        setVerified(true)
        setVerificationData(result.data)
        setCustomerName(result.data.customerName || '')
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

  const handleAmountSelect = (presetAmount: number) => {
    setAmount(String(presetAmount))
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }))
  }

  const handleMeterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setMeterNumber(value)
    if (errors.meterNumber) setErrors((prev) => ({ ...prev, meterNumber: undefined }))
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

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value)
  }

  const validateForm = (): boolean => {
    const results = combineValidations(
      validateRequired(provider, 'provider'),
      validateRequired(meterType, 'meterType'),
      validateRequired(meterNumber, 'meterNumber'),
      validateAmount(amount, 500, 500000),
    )
    setErrors((prev) => ({ ...prev, ...results.errors }))
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const result = await billsService.payElectricity({
        providerId: provider,
        meterNumber: meterNumber.replace(/\s/g, ''),
        meterType,
        amount: parseFloat(amount),
        customerName: customerName || verificationData?.customerName,
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
      })

      if (result.success) {
        setMeterNumber('')
        setAmount('')
        setCustomerName('')
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

  return (
    <form onSubmit={handleSubmit} className="electricity-form" noValidate>
      <div className="electricity-form__wallet-balance">
        <div className="electricity-form__balance-item">
          <span className="electricity-form__balance-label">Wallet Balance</span>
          <span className="electricity-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {amount && parseFloat(amount) > 0 && (
          <div className="electricity-form__balance-item electricity-form__balance-item--remaining">
            <span className="electricity-form__balance-label">After Payment</span>
            <span className="electricity-form__balance-value">
              {walletBalance > 0 ? formatCurrency(walletBalance - (amount ? parseFloat(amount) : 0) - PLATFORM_FEE) : '—'}
            </span>
          </div>
        )}
      </div>

      <div className="form-grid">
        <NetworkSelector
          label="Electricity Provider (Disco)"
          networks={providers.map((p) => ({ id: p.id, name: p.name, code: p.code, logo: p.logo, color: p.color, supportsData: false, supportsAirtime: false, supportsSME: false, supportsCorporateGifting: false, ussdCode: '' }))}
          value={provider}
          onChange={setProvider}
          required
          error={errors.provider}
          placeholder="Select electricity provider"
          showLogo={true}
        />

        <div className="form-field">
          <label className="form-label">Meter Type <span className="required">*</span></label>
          <div className="meter-type-options">
            <label className={`meter-type-option ${meterType === 'prepaid' ? 'meter-type-option--selected' : ''}`}>
              <input
                type="radio"
                name="meterType"
                value="prepaid"
                checked={meterType === 'prepaid'}
                onChange={(e) => setMeterType(e.target.value as 'prepaid' | 'postpaid')}
              />
              <span>Prepaid</span>
            </label>
            <label className={`meter-type-option ${meterType === 'postpaid' ? 'meter-type-option--selected' : ''}`}>
              <input
                type="radio"
                name="meterType"
                value="postpaid"
                checked={meterType === 'postpaid'}
                onChange={(e) => setMeterType(e.target.value as 'prepaid' | 'postpaid')}
              />
              <span>Postpaid</span>
            </label>
          </div>
          {errors.meterType && <p className="form-error" role="alert">{errors.meterType}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="meterNumber" className="form-label">
            Meter Number <span className="required">*</span>
          </label>
          <input
            id="meterNumber"
            type="text"
            className={`form-input ${errors.meterNumber ? 'form-input--error' : ''}`}
            placeholder="Enter meter number"
            value={meterNumber}
            onChange={handleMeterNumberChange}
            maxLength={13}
            aria-invalid={!!errors.meterNumber}
            aria-describedby={errors.meterNumber ? 'meter-error' : undefined}
          />
          <div className="form-field-actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={handleVerify}
              disabled={verifying || !provider || !meterNumber}
            >
              {verifying ? 'Verifying...' : 'Verify Meter'}
            </button>
          </div>
          {errors.verify && <p id="meter-error" className="form-error" role="alert">{errors.verify}</p>}
          {errors.meterNumber && <p id="meter-error" className="form-error" role="alert">{errors.meterNumber}</p>}
        </div>
      </div>

      {verified && verificationData && (
        <div className="electricity-form__verification">
          <h4>Verification Successful</h4>
          <div className="verification-details">
            <div className="verification-item">
              <strong>Customer Name:</strong> {verificationData.customerName || '—'}
            </div>
            <div className="verification-item">
              <strong>Meter Number:</strong> {verificationData.meterNumber}
            </div>
            <div className="verification-item">
              <strong>Provider:</strong> {verificationData.provider}
            </div>
            <div className="verification-item">
              <strong>Meter Type:</strong> {verificationData.meterType}
            </div>
            <div className="verification-item">
              <strong>Address:</strong> {verificationData.address || '—'}
            </div>
            {verificationData.outstandingBalance !== undefined && (
              <div className="verification-item">
                <strong>Outstanding Balance:</strong> {formatCurrency(verificationData.outstandingBalance)}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="customerName" className="form-label">
            Customer Name
          </label>
          <input
            id="customerName"
            type="text"
            className="form-input"
            placeholder="Customer name (optional)"
            value={customerName}
            onChange={handleCustomerNameChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <div className="input-wrapper">
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
          </div>
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

      <FeeBreakdown
        servicePrice={amount ? parseFloat(amount) : 0}
        platformFee={PLATFORM_FEE}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg electricity-form__submit"
        disabled={submitting || !verified}
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
            Pay Electricity Bill
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default ElectricityForm