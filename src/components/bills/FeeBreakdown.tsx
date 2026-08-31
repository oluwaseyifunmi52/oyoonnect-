import { formatCurrency } from '../../utils/currency'

interface FeeBreakdownProps {
  servicePrice: number
  platformFee?: number
  showServicePrice?: boolean
  showPlatformFee?: boolean
  label?: string
}

export function FeeBreakdown({
  servicePrice,
  platformFee = 50,
  showServicePrice = true,
  showPlatformFee = true,
  label = 'Total',
}: FeeBreakdownProps) {
  const total = servicePrice + platformFee

  return (
    <div className="fee-breakdown">
      <h4 className="fee-breakdown__title">Order Summary</h4>
      <dl className="fee-breakdown__list">
        {showServicePrice && (
          <div className="fee-breakdown__row">
            <dt>Service Price</dt>
            <dd>{formatCurrency(servicePrice)}</dd>
          </div>
        )}
        {showPlatformFee && (
          <div className="fee-breakdown__row">
            <dt>Platform Fee</dt>
            <dd>{formatCurrency(platformFee)}</dd>
          </div>
        )}
        <div className="fee-breakdown__row fee-breakdown__row--total">
          <dt>{label}</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>
      <p className="fee-breakdown__note">
        Platform fee is fixed at {formatCurrency(platformFee)} per transaction.
      </p>
    </div>
  )
}

interface SimpleFeeBreakdownProps {
  items: Array<{ label: string; value: number; isTotal?: boolean }>
}

export function SimpleFeeBreakdown({ items }: SimpleFeeBreakdownProps) {
  return (
    <div className="fee-breakdown">
      <dl className="fee-breakdown__list">
        {items.map((item, index) => (
          <div
            key={index}
            className={`fee-breakdown__row ${item.isTotal ? 'fee-breakdown__row--total' : ''}`}
          >
            <dt>{item.label}</dt>
            <dd>{formatCurrency(item.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}