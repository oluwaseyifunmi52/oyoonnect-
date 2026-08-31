import { useState, useEffect } from 'react'
import { Smartphone, CreditCard, ArrowRight, Key } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateAmount, combineValidations, validateRequired } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { RechargePinProduct, Network, Transaction } from '../../types/bills'

interface RechargePinFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
  initialNetwork?: string
}

const DENOMINATIONS = [100, 200, 500, 1000, 2000, 5000]

export function RechargePinForm({ onSuccess, onError, initialNetwork }: RechargePinFormProps) {
  const [network, setNetwork] = useState<string>(initialNetwork || '')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [selectedDenomination, setSelectedDenomination] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [networks, setNetworks] = useState<Network[]>([])
  const [products, setProducts] = useState<RechargePinProduct[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    loadNetworks()
    loadWalletBalance()
  }, [])

  useEffect(() => {
    if (network) {
      loadProducts()
    } else {
      setProducts([])
      setSelectedDenomination(0)
    }
  }, [network])

  const loadNetworks = async () => {
    try {
      const nets = await billsService.getNetworksForAirtime()
      setNetworks(nets)
      if (!initialNetwork && nets.length > 0) {
        setNetwork(nets[0].id)
      }
    } catch {
      setNetworks([])
    }
  }

  const loadProducts = async () => {
    try {
      const data = await billsService.getRechargePinProducts(network)
      setProducts(data)
      setSelectedDenomination(data[0]?.denomination || 0)
    } catch {
      setProducts([])
    }
  }

  const loadWalletBalance = async () => {
    try {
      setWalletBalance(0)
    } catch {
      setWalletBalance(0)
    }
  }

  const selectedProduct = products.find((p) => p.denomination === selectedDenomination)
  const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0

  const handleDenominationSelect = (denom: number) => {
    setSelectedDenomination(denom)
    setErrors((prev) => ({ ...prev, denomination: undefined }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
    setQuantity(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '')
    setPhoneNumber(value)
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
  }

  const validateForm = (): boolean => {
    const results = combineValidations(
      validatePhoneNumber(phoneNumber, network),
      validateRequired(network, 'network'),
      validateRequired(String(selectedDenomination), 'denomination'),
    )
    setErrors(results.errors)
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const product = products.find((p) => p.denomination === selectedDenomination)
    if (!product) return

    setSubmitting(true)
    try {
      const result = await billsService.purchaseRechargePin({
        networkId: network,
        productId: product.id,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        quantity,
        amount: product.price * quantity,
      })

      if (result.success) {
        setPhoneNumber('')
        setQuantity(1)
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

  const availableDenominations = products.map((p) => p.denomination)
  const uniqueDenominations = [...new Set(availableDenominations)].sort((a, b) => a - b)

  return (
    <form onSubmit={handleSubmit} className="recharge-pin-form" noValidate>
      <div className="recharge-pin-form__wallet-balance">
        <div className="recharge-pin-form__balance-item">
          <span className="recharge-pin-form__balance-label">Wallet Balance</span>
          <span className="recharge-pin-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {totalAmount > 0 && (
          <div className="recharge-pin-form__balance-item recharge-pin-form__balance-item--remaining">
            <span className="recharge-pin-form__balance-label">After Purchase</span>
            <span className="recharge-pin-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance - totalAmount) : '—'}</span>
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
      </div>

      <div className="recharge-pin-form__denominations">
        <p className="recharge-pin-form__section-label">Select Denomination</p>
        <div className="recharge-pin-form__denomination-buttons">
          {uniqueDenominations.map((denom) => (
            <button
              key={denom}
              type="button"
              className={`recharge-pin-form__denom-btn ${selectedDenomination === denom ? 'recharge-pin-form__denom-btn--active' : ''}`}
              onClick={() => handleDenominationSelect(denom)}
            >
              <Key size={16} aria-hidden="true" />
              <span>₦{denom.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="recharge-pin-form__quantity">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <div className="quantity-selector">
            <button
              type="button"
              className="quantity-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
              min={1}
              max={100}
            />
            <button
              type="button"
              className="quantity-btn"
              onClick={() => setQuantity(Math.min(100, quantity + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="recharge-pin-form__quantity-hint">
            {quantity} × ₦{selectedProduct.price.toLocaleString()} = {formatCurrency(totalAmount)}
          </p>
        </div>
      )}

      <div className="recharge-pin-form__notice">
        <Key size={18} aria-hidden="true" />
        <div>
          <strong>Important:</strong> This is a demo transaction. No real recharge PIN will be delivered.
          Generated PINs are clearly marked as <strong>DEMO — NOT A REAL RECHARGE PIN</strong>.
        </div>
      </div>

      <FeeBreakdown
        servicePrice={totalAmount}
        platformFee={50}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg recharge-pin-form__submit"
        disabled={submitting || !network || !selectedDenomination}
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
            Purchase Recharge PIN
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default RechargePinForm