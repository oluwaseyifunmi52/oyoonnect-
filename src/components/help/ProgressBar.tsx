import { formatCurrency } from '../../utils/currency'

interface ProgressBarProps {
  value: number
  max?: number
  showPercentage?: boolean
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showPercentage = true,
  showLabels = false,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      className={`progress-bar progress-bar--${size} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${Math.round(percentage)}% funded`}
    >
      {showLabels && (
        <div className="progress-bar__labels">
          <span className="progress-bar__label progress-bar__label--raised">
            Raised: {formatCurrency(value)}
          </span>
          <span className="progress-bar__label progress-bar__label--target">
            Target: {formatCurrency(max)}
          </span>
        </div>
      )}
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
      {showPercentage && (
        <div className="progress-bar__percentage" aria-hidden="true">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}
