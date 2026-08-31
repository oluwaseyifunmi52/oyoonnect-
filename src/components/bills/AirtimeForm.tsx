import { useState, useEffect } from 'react'
import { Smartphone, CreditCard, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateAmount, combineValidations, validateRequired } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { Network, Transaction } from '../../types/bills'

interface AirtimeFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
  initialNetwork?: string
  initialAmount?: string
}

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000, 10000]
const PLATFORM_FEE = 50

export function AirtimeForm({
  onSuccess,
  onError,
  initialNetwork,
  initialAmount,
}: AirtimeFormProps) {
  const [network, setNetwork] = useState<string>(initialNetwork || '')
  const [amount, setAmount] = useState<string>(initialAmount || '')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [networks, setNetworks] = useState<Network[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    loadNetworks()
    loadWalletBalance()
  }, [])

  const loadNetworks = async () => {
    try {
      const nets = await billsService.getNetworksForAirtime()
      setNetworks(nets)
      if (!network && nets.length > 0) {
        setNetwork(nets[0].id)
      }
    } catch {
      setNetworks([])
    }
  }

  const loadWalletBalance = async () => {
    try {
      setWalletBalance(0)
    } catch {
      setWalletBalance(0)
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '')
    setPhoneNumber(value)
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
  }

  const validateForm = (): boolean => {
    const results = combineValidations(
      validatePhoneNumber(phoneNumber, network),
      validateAmount(amount, 50, 100000),
      validateRequired(network, 'network')
    )
    setErrors(results.errors)
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const result = await billsService.purchaseAirtime({
        networkId: network,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        amount: parseFloat(amount),
      })

      if (result.success) {
        setPhoneNumber('')
        setAmount('')
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

  const remainingBalance = walletBalance - (amount ? parseFloat(amount) : 0) - PLATFORM_FEE

  return (
    <form onSubmit={handleSubmit} className="airtime-form" noValidate>
      <div className="airtime-form__wallet-balance">
        <div className="airtime-form__balance-item">
          <span className="airtime-form__balance-label">Wallet Balance</span>
          <span className="airtime-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {amount && parseFloat(amount) > 0 && (
          <div className="airtime-form__balance-item airtime-form__balance-item--remaining">
            <span className="airtime-form__balance-label">After Purchase</span>
            <span className="airtime-form__balance-value">
              {walletBalance > 0 ? formatCurrency(remainingBalance) : '—'}
            </span>
          </div>
        )}
      </div>

      <div className="form-grid">
        <NetworkSelector
          label="Network"
          networks={networks}
          value={network}
          onChange={setNetwork}
          required
          error={errors.network}
          placeholder="Select network"
        />

        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <Smartphone size={18} className="input-icon" aria-hidden="true" />
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
          <label className="form-label">
            Amount <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="input-prefix">₦</span>
            <input
              id="amount"
              name="amount"
              type="text"
              className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              autoComplete="off"
            />
          </div>
          {errors.amount && <p id="amount-error" className="form-error" role="alert">{errors.amount}</p>}
        </div>
      </div>

      <div className="airtime-form__presets">
        <p className="airtime-form__presets-label">Quick Amounts</p>
        <div className="airtime-form__preset-buttons">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`airtime-form__preset-btn ${amount === String(preset) ? 'airtime-form__preset-btn--active' : ''}`}
              onClick={() => handleAmountSelect(preset)}
            >
              ₦{preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <FeeBreakdown
        servicePrice={amount ? parseFloat(amount) : 0}
        platformFee={PLATFORM_FEE}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg airtime-form__submit"
        disabled={submitting || !network || !amount || walletBalance === 0}
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
            Purchase Airtime
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default AirtimeForm