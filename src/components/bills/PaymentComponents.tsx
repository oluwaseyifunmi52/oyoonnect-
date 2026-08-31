import { ArrowRight, CheckCircle2, AlertCircle, Loader2, X, CreditCard, Shield, Clock } from 'lucide-react'
import { Button, ButtonLink } from '../ui/Button'
import { formatCurrency } from '../../utils/currency'

interface PaymentButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PaymentButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: PaymentButtonProps) {
  const baseClasses = `btn btn--${variant} btn--${size} payment-button`
  const combinedClasses = `${baseClasses} ${className}`.trim()

  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && (
        <>
          <Loader2 size={18} className="btn__spinner" aria-hidden="true" />
          Processing...
        </>
      )}
      {!loading && (
        <>
          {children}
          {variant === 'primary' && <ArrowRight size={18} aria-hidden="true" />}
        </>
      )}
    </button>
  )
}

interface PaymentStatusProps {
  status: 'success' | 'pending' | 'failed' | 'processing'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PaymentStatus({ status, label, size = 'md' }: PaymentStatusProps) {
  const labels = {
    success: 'Successful',
    pending: 'Pending',
    failed: 'Failed',
    processing: 'Processing...',
  }

  const icons = {
    success: <CheckCircle2 size={14} aria-hidden="true" />,
    pending: <Clock size={14} aria-hidden="true" />,
    failed: <AlertCircle size={14} aria-hidden="true" />,
    processing: <Loader2 size={14} className="spin" aria-hidden="true" />,
  }

  const sizeClasses = {
    sm: 'payment-status--sm',
    md: 'payment-status--md',
    lg: 'payment-status--lg',
  }

  const statusClasses = {
    success: 'payment-status--success',
    pending: 'payment-status--pending',
    failed: 'payment-status--failed',
    processing: 'payment-status--pending',
  }

  return (
    <span className={`payment-status ${statusClasses[status]} ${sizeClasses[size]}`}>
      {icons[status]}
      <span>{label || labels[status]}</span>
    </span>
  )
}

interface PaymentProcessingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PaymentProcessing({ message = 'Processing your payment...', size = 'md' }: PaymentProcessingProps) {
  return (
    <div className="payment-processing" role="status" aria-live="polite">
      <div className="payment-processing__spinner">
        <Loader2 size={size === 'sm' ? 24 : size === 'lg' ? 48 : 32} className="spin" aria-hidden="true" />
      </div>
      <p className="payment-processing__message">{message}</p>
      <p className="payment-processing__note">Please do not close this window or refresh the page.</p>
    </div>
  )
}

interface PaymentSuccessProps {
  title?: string
  message?: string
  reference?: string
  amount?: number
  onContinue?: () => void
  continueLabel?: string
  onViewReceipt?: () => void
}

export function PaymentSuccess({
  title = 'Payment Successful',
  message = 'Your payment has been processed successfully.',
  reference,
  amount,
  onContinue,
  continueLabel = 'Continue',
  onViewReceipt,
}: PaymentSuccessProps) {
  return (
    <div className="payment-success" role="status" aria-live="polite">
      <div className="payment-success__icon" aria-hidden="true">
        <CheckCircle2 size={64} />
      </div>
      <h2 className="payment-success__title">{title}</h2>
      <p className="payment-success__message">{message}</p>

      {(reference || amount !== undefined) && (
        <div className="payment-success__details">
          {reference && (
            <div className="payment-success__detail">
              <span className="payment-success__detail-label">Reference</span>
              <code className="payment-success__detail-value">{reference}</code>
            </div>
          )}
          {amount !== undefined && (
            <div className="payment-success__detail">
              <span className="payment-success__detail-label">Amount</span>
              <span className="payment-success__detail-value payment-success__detail-value--amount">
                {formatCurrency(amount)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="payment-success__actions">
        {onViewReceipt && (
          <Button variant="outline" onClick={onViewReceipt}>
            View Receipt
          </Button>
        )}
        {onContinue && (
          <Button variant="primary" onClick={onContinue} size="lg">
            {continueLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

interface PaymentFailedProps {
  title?: string
  message?: string
  errorCode?: string
  onRetry?: () => void
  retryLabel?: string
  onCancel?: () => void
  cancelLabel?: string
}

export function PaymentFailed({
  title = 'Payment Failed',
  message = 'We couldn\'t process your payment. Please try again.',
  errorCode,
  onRetry,
  retryLabel = 'Try Again',
  onCancel,
  cancelLabel = 'Cancel',
}: PaymentFailedProps) {
  return (
    <div className="payment-failed" role="alert" aria-live="assertive">
      <div className="payment-failed__icon" aria-hidden="true">
        <AlertCircle size={64} />
      </div>
      <h2 className="payment-failed__title">{title}</h2>
      <p className="payment-failed__message">{message}</p>

      {errorCode && (
        <p className="payment-failed__error-code">
          Error code: <code>{errorCode}</code>
        </p>
      )}

      <div className="payment-failed__actions">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} size="lg">
            {cancelLabel}
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry} size="lg">
            {retryLabel}
          </Button>
        )}
      </div>

      <p className="payment-failed__note">
        If the problem persists, please contact support with the error code above.
      </p>
    </div>
  )
}

interface ServiceConfirmationProps {
  title: string
  subtitle?: string
  summary: Array<{ label: string; value: React.ReactNode }>
  fees?: Array<{ label: string; value: number }>
  total: number
  currency?: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  terms?: React.ReactNode
}

export function ServiceConfirmation({
  title,
  subtitle,
  summary,
  fees,
  total,
  currency = 'NGN',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm & Pay',
  cancelLabel = 'Cancel',
  loading = false,
  terms,
}: ServiceConfirmationProps) {
  const formatAmount = (amount: number) => {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  }

  return (
    <div className="service-confirmation" role="dialog" aria-labelledby="confirmation-title" aria-modal="true">
      <header className="service-confirmation__header">
        <h2 id="confirmation-title" className="service-confirmation__title">{title}</h2>
        {subtitle && <p className="service-confirmation__subtitle">{subtitle}</p>}
      </header>

      <section className="service-confirmation__summary" aria-labelledby="summary-heading">
        <h3 id="summary-heading" className="service-confirmation__section-title">Order Summary</h3>
        <dl className="service-confirmation__details">
          {summary.map((item, index) => (
            <div key={index} className="service-confirmation__detail-row">
              <dt className="service-confirmation__detail-label">{item.label}</dt>
              <dd className="service-confirmation__detail-value">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {fees && fees.length > 0 && (
        <section className="service-confirmation__fees" aria-labelledby="fees-heading">
          <h3 id="fees-heading" className="service-confirmation__section-title">Fees</h3>
          <dl className="service-confirmation__details">
            {fees.map((fee, index) => (
              <div key={index} className="service-confirmation__detail-row">
                <dt className="service-confirmation__detail-label">{fee.label}</dt>
                <dd className="service-confirmation__detail-value">{formatCurrency(fee.value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

<section className="service-confirmation__total" aria-labelledby="total-heading">
          <h3 id="total-heading" className="service-confirmation__section-title">Total</h3>
          <div className="service-confirmation__total-amount">
            {formatCurrency(total)}
          </div>
        </section>

      {terms && (
        <div className="service-confirmation__terms">
          {terms}
        </div>
      )}

      <footer className="service-confirmation__footer">
        <Button variant="outline" onClick={onCancel} disabled={loading} size="lg">
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={loading} size="lg">
          {loading ? (
            <>
              <span className="btn__spinner" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </footer>
    </div>
  )
}

interface ServiceSuccessProps {
  title?: string
  message?: string
  reference?: string
  amount?: number
  onContinue?: () => void
  continueLabel?: string
  onViewReceipt?: () => void
  icon?: React.ReactNode
}

export function ServiceSuccess({
  title = 'Request Submitted Successfully',
  message = 'Your request has been processed successfully.',
  reference,
  amount,
  onContinue,
  continueLabel = 'Done',
  onViewReceipt,
  icon,
}: ServiceSuccessProps) {
  return (
    <div className="service-success" role="status" aria-live="polite">
      <div className="service-success__icon" aria-hidden="true">
        {icon || (
          <div className="service-success__icon-circle">
            <CheckCircle2 size={48} />
          </div>
        )}
      </div>
      <h2 className="service-success__title">{title}</h2>
      <p className="service-success__message">{message}</p>

      {(reference || amount !== undefined) && (
        <div className="service-success__details">
          {reference && (
            <div className="service-success__detail">
              <span className="service-success__detail-label">Reference</span>
              <code className="service-success__detail-value">{reference}</code>
            </div>
          )}
          {amount !== undefined && (
            <div className="service-success__detail">
              <span className="service-success__detail-label">Amount</span>
              <span className="service-success__detail-value service-success__detail-value--amount">
                {formatCurrency(amount)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="service-success__actions">
        {onViewReceipt && (
          <Button variant="outline" onClick={onViewReceipt}>
            View Receipt
          </Button>
        )}
        {onContinue && (
          <Button variant="primary" onClick={onContinue} size="lg">
            {continueLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

interface ServiceErrorProps {
  title?: string
  message?: string
  errorCode?: string
  onRetry?: () => void
  retryLabel?: string
  onCancel?: () => void
  cancelLabel?: string
  icon?: React.ReactNode
}

export function ServiceError({
  title = 'Something Went Wrong',
  message = 'We encountered an issue processing your request. Please try again.',
  errorCode,
  onRetry,
  retryLabel = 'Try Again',
  onCancel,
  cancelLabel = 'Cancel',
  icon,
}: ServiceErrorProps) {
  return (
    <div className="service-error" role="alert" aria-live="assertive">
      <div className="service-error__icon" aria-hidden="true">
        {icon || (
          <div className="service-error__icon-circle">
            <AlertCircle size={48} />
          </div>
        )}
      </div>
      <h2 className="service-error__title">{title}</h2>
      <p className="service-error__message">{message}</p>

      {errorCode && (
        <p className="service-error__error-code">
          Error code: <code>{errorCode}</code>
        </p>
      )}

      <div className="service-error__actions">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} size="lg">
            {cancelLabel}
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry} size="lg">
            {retryLabel}
          </Button>
        )}
      </div>

      <p className="service-error__note">
        If the problem persists, please contact support with the error code above.
      </p>
    </div>
  )
}