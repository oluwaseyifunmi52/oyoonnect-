import { useState, useCallback } from 'react'
import { CheckCircle2, Loader2, Shield, Eye, EyeOff } from 'lucide-react'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { payoutService } from '../../services/payoutService'
import { nigerianBanks } from '../../data/banks'
import { useAuth } from '../../context/AuthContext'
import type { PayoutDetails } from '../../types/business'

interface PayoutDetailsSectionProps {
  onSaved?: () => void
}

export function PayoutDetailsSection({ onSaved }: PayoutDetailsSectionProps) {
  const { user } = useAuth()
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const [form, setForm] = useState({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountHolderName: '',
  })

  const isOwner = user?.role === 'business_owner' || user?.role === 'admin'

  const loadPayoutDetails = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const details = payoutService.getPayoutDetails(user.id)
    if (details) {
      setPayoutDetails(details)
      setForm({
        bankName: details.bankName,
        bankCode: details.bankCode,
        accountNumber: details.accountNumber,
        accountHolderName: details.accountHolderName,
      })
      if (details.verified && details.accountHolderVerified) {
        setVerifiedAccountName(details.accountHolderVerified)
        setVerificationSuccess(true)
      }
    }
    setLoading(false)
  }, [user])

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    if (field === 'bankName') {
      const bank = nigerianBanks.find((b) => b.name === value)
      if (bank) {
        setForm((prev) => ({ ...prev, bankCode: bank.code }))
      }
    }
    if (field === 'accountNumber' || field === 'bankName') {
      setVerificationSuccess(false)
      setVerifiedAccountName(null)
    }
  }

  const handleVerifyAccount = async () => {
    const { accountNumber } = form
    if (!validateFormForVerification()) return

    setVerifying(true)
    setErrors((prev) => ({ ...prev, accountNumber: '' }))

    try {
      const result = await payoutService.verifyAccountNumber(accountNumber, form.bankCode)
      if (result.success && result.accountName) {
        setVerifiedAccountName(result.accountName)
        setVerificationSuccess(true)
        setForm((prev) => ({ ...prev, accountHolderName: result.accountName || '' }))
      } else {
        setErrors((prev) => ({ ...prev, accountNumber: result.error || 'Verification failed' }))
        setVerificationSuccess(false)
        setVerifiedAccountName(null)
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, accountNumber: 'Verification failed. Please try again.' }))
      setVerificationSuccess(false)
    } finally {
      setVerifying(false)
    }
  }

  const validateFormForVerification = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.bankName) newErrors.bankName = 'Please select a bank'
    if (!form.bankCode) newErrors.bankName = 'Invalid bank selection'
    if (!form.accountNumber) newErrors.accountNumber = 'Account number is required'
    else if (!/^\d{10}$/.test(form.accountNumber)) newErrors.accountNumber = 'Account number must be 10 digits'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.bankName) newErrors.bankName = 'Please select a bank'
    if (!form.bankCode) newErrors.bankCode = 'Invalid bank selection'
    if (!form.accountNumber) newErrors.accountNumber = 'Account number is required'
    else if (!/^\d{10}$/.test(form.accountNumber)) newErrors.accountNumber = 'Account number must be exactly 10 digits'
    if (!form.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !user) return

    setSaving(true)
    try {
      const details: PayoutDetails = {
        bankName: form.bankName,
        bankCode: form.bankCode,
        accountNumber: form.accountNumber,
        accountHolderName: form.accountHolderName,
        verified: !!verifiedAccountName,
        verifiedAt: new Date().toISOString(),
        accountHolderVerified: verifiedAccountName || undefined,
      }

      payoutService.savePayoutDetails(user.id, details)
      setPayoutDetails(details)
      setVerificationSuccess(true)
      setVerifiedAccountName(form.accountHolderName)
      onSaved?.()
      alert('Bank details saved successfully!')
    } catch (error) {
      console.error('Failed to save payout details:', error)
      alert('Failed to save bank details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber)
  }

  if (loading) {
    return (
      <div className="payout-section">
        <div className="section-skeleton" style={{ height: '200px' }} />
      </div>
    )
  }

  if (!isOwner) {
    return null
  }

  const displayAccountNumber = showAccountNumber
    ? (payoutDetails?.accountNumber || form.accountNumber)
    : maskAccountNumber(payoutDetails?.accountNumber || form.accountNumber || '')

  return (
    <section className="payout-section form-section" aria-labelledby="payout-heading">
      <header className="form-section-header">
        <h2 id="payout-heading" className="form-section-title">Payout Details</h2>
        <p className="form-section-description">
          Add your bank account information to receive payouts. Your details are encrypted and only visible to you and admins.
        </p>
      </header>

      <div className="payout-form">
        <div className="form-row">
          <Select
            label="Bank Name"
            name="bankName"
            required
            value={form.bankName}
            onChange={(value) => updateForm('bankName', value)}
            options={nigerianBanks.map((b) => ({ value: b.name, label: b.name }))}
            placeholder="Select your bank"
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label className="field__label" htmlFor="accountNumber">
              Account Number <span className="required">*</span>
            </label>
            <div className="input-with-button">
              <Input
                id="accountNumber"
                name="accountNumber"
                type="text"
                label="Account Number"
                placeholder="10-digit account number"
                value={form.accountNumber}
                onChange={(e) => updateForm('accountNumber', e.target.value)}
                error={errors.accountNumber}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVerifyAccount}
                disabled={verifying || !form.bankName || !form.accountNumber || !/^\d{10}$/.test(form.accountNumber)}
                className="verify-btn"
              >
                {verifying ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </Button>
            </div>
            {errors.accountNumber && <p className="field__error">{errors.accountNumber}</p>}
            {verificationSuccess && verifiedAccountName && (
              <div className="verification-success">
                <CheckCircle2 size={16} />
                <span>Verified: {verifiedAccountName}</span>
              </div>
            )}
          </div>
        </div>

        <Input
          label="Account Holder Name"
          name="accountHolderName"
          placeholder="As registered with your bank"
          required
          value={form.accountHolderName}
          onChange={(e) => updateForm('accountHolderName', e.target.value)}
          error={errors.accountHolderName}
          disabled={verificationSuccess}
        />

        <div className="payout-actions">
          <Button type="button" variant="outline" onClick={() => loadPayoutDetails()} disabled={saving}>
            Reset
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 size={18} className="spinning" />
                Saving...
              </>
            ) : (
              payoutDetails ? 'Update Bank Details' : 'Save Bank Details'
            )}
          </Button>
        </div>

        <div className="payout-security-notice">
          <Shield size={16} />
          <span>Your bank details are encrypted and stored securely. Only you and platform admins can view them. We never share this information publicly.</span>
        </div>

        {payoutDetails && (
          <div className="current-payout-details">
            <h4>Current Bank Details</h4>
            <dl className="payout-details-list">
              <dt>Bank</dt>
              <dd>{payoutDetails.bankName}</dd>
              <dt>Account Number</dt>
              <dd className="account-number-display">
                <span>{displayAccountNumber}</span>
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={handleToggleAccountNumber}
                  aria-label={showAccountNumber ? 'Hide account number' : 'Show account number'}
                >
                  {showAccountNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </dd>
              <dt>Account Name</dt>
              <dd>{payoutDetails.accountHolderName}</dd>
              {payoutDetails.verified && (
                <>
                  <dt>Verification</dt>
                  <dd className="verified-badge">
                    <CheckCircle2 size={14} />
                    Verified via Paystack {payoutDetails.verifiedAt ? `on ${new Date(payoutDetails.verifiedAt).toLocaleDateString()}` : ''}
                  </dd>
                </>
              )}
              <dt>Last Updated</dt>
              <dd>{payoutDetails.verifiedAt ? new Date(payoutDetails.verifiedAt).toLocaleDateString() : '—'}</dd>
            </dl>
          </div>
        )}
      </div>
    </section>
  )
}

function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 4) return accountNumber
  return '•'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
}

export default PayoutDetailsSection