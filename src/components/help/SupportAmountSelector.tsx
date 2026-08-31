import { useState } from 'react'
import { formatCurrency } from '../../utils/currency'
import { PLATFORM_FEE_PERCENTAGE, PAYMENT_GATEWAY_FEE_PERCENTAGE, SUGGESTED_SUPPORT_AMOUNTS } from '../../types/help'

interface SupportAmountSelectorProps {
  suggestedAmounts?: readonly number[]
  selectedAmount?: number
  onAmountChange: (amount: number) => void
  onCustomAmountChange?: (amount: number) => void
  showFeeBreakdown?: boolean
  platformFeePercentage?: number
  gatewayFeePercentage?: number
  onSupportClick?: () => void
  isProcessing?: boolean
}

export function SupportAmountSelector({
  suggestedAmounts = SUGGESTED_SUPPORT_AMOUNTS,
  selectedAmount,
  onAmountChange,
  onCustomAmountChange,
  showFeeBreakdown = true,
  platformFeePercentage = PLATFORM_FEE_PERCENTAGE,
  gatewayFeePercentage = PAYMENT_GATEWAY_FEE_PERCENTAGE,
}: SupportAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const totalFeePercentage = platformFeePercentage + gatewayFeePercentage

  const calculateFees = (amount: number) => {
    const platformFee = amount * (platformFeePercentage / 100)
    const gatewayFee = amount * (gatewayFeePercentage / 100)
    const totalFees = platformFee + gatewayFee
    const totalCharge = amount + totalFees
    return { platformFee, gatewayFee, totalFees, totalCharge }
  }

  const handleSuggestedClick = (amount: number) => {
    setIsCustom(false)
    setCustomAmount('')
    onAmountChange(amount)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setCustomAmount(value)
    setIsCustom(true)
    const amount = value ? parseInt(value, 10) : 0
    onAmountChange(amount)
    onCustomAmountChange?.(amount)
  }

  const handleCustomBlur = () => {
    if (customAmount) {
      const amount = parseInt(customAmount, 10)
      if (amount >= 100) {
        onAmountChange(amount)
        onCustomAmountChange?.(0)
      } else {
        setCustomAmount('')
        onAmountChange(0)
        onCustomAmountChange?.(0)
      }
    }
  }

  const currentAmount = isCustom ? (customAmount ? parseInt(customAmount, 10) : 0) : selectedAmount || 0
  const { platformFee, gatewayFee, totalFees, totalCharge } = calculateFees(currentAmount)

  return (
    <div className="support-amount-selector">
      <fieldset className="support-amount-selector__fieldset">
        <legend className="support-amount-selector__legend">Choose an amount to support</legend>

        <div className="support-amount-selector__grid" role="radiogroup" aria-label="Suggested support amounts">
          {suggestedAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              role="radio"
              aria-checked={!isCustom && selectedAmount === amount}
              className={`support-amount-selector__option ${!isCustom && selectedAmount === amount ? 'support-amount-selector__option--selected' : ''}`}
              onClick={() => handleSuggestedClick(amount)}
            >
              {formatCurrency(amount, { showDecimals: false })}
            </button>
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={isCustom}
            className={`support-amount-selector__option support-amount-selector__option--custom ${isCustom ? 'support-amount-selector__option--selected' : ''}`}
            onClick={() => {
              setIsCustom(true)
              setCustomAmount('')
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="Custom"
              value={customAmount}
              onChange={handleCustomChange}
              onBlur={handleCustomBlur}
              onFocus={() => setIsCustom(true)}
              className="support-amount-selector__custom-input"
              aria-label="Custom amount in Naira"
              maxLength={8}
            />
          </button>
        </div>

        {isCustom && customAmount && (
          <p className="support-amount-selector__hint">Minimum amount: ₦100</p>
        )}
      </fieldset>

      {showFeeBreakdown && currentAmount > 0 && (
        <div className="support-amount-selector__fee-breakdown">
          <h4 className="support-amount-selector__fee-title">Fee breakdown</h4>
          <dl className="support-amount-selector__fee-list">
            <div className="support-amount-selector__fee-row">
              <dt>Support amount</dt>
              <dd>{formatCurrency(currentAmount)}</dd>
            </div>
            <div className="support-amount-selector__fee-row">
              <dt>Platform fee ({platformFeePercentage}%)</dt>
              <dd>{formatCurrency(platformFee)}</dd>
            </div>
            <div className="support-amount-selector__fee-row">
              <dt>Payment gateway fee ({gatewayFeePercentage}%)</dt>
              <dd>{formatCurrency(gatewayFee)}</dd>
            </div>
            <div className="support-amount-selector__fee-row support-amount-selector__fee-row--total">
              <dt>Total charged to you</dt>
              <dd>{formatCurrency(totalCharge)}</dd>
            </div>
          </dl>
          <p className="support-amount-selector__fee-note">
            Your support amount is transferred directly to the requester. Fees cover platform
            operations and secure payment processing.
          </p>
        </div>
      )}
    </div>
  )
}
