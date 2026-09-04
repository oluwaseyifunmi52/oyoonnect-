import styles from './Progress.css';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressTone = 'brand' | 'success' | 'warning' | 'error' | 'info';
export type ProgressVariant = 'linear' | 'circular';

interface ProgressProps {
  value: number;
  max?: number;
  size?: ProgressSize;
  tone?: ProgressTone;
  variant?: ProgressVariant;
  showLabel?: boolean;
  showValue?: boolean;
  label?: string;
  valueLabel?: string;
  className?: string;
  'aria-label'?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  tone = 'brand',
  variant = 'linear',
  showLabel = false,
  showValue = false,
  label,
  valueLabel,
  className = '',
  'aria-label': ariaLabel,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isIndeterminate = value < 0;

  if (variant === 'circular') {
    return (
      <div
        className={[
          styles.progress,
          styles['progress--circular'],
          styles[`progress--${size}`],
          styles[`progress--${tone}`],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        style={{ '--progress': percentage / 100 } as React.CSSProperties}
      >
        <div className={styles['progress__track']} />
        <div className={styles['progress__label']}>
          <span className={styles['progress__value']}>{Math.round(percentage)}%</span>
          {label && <span className={styles['progress__label-text']}>{label}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        styles.progress,
        styles[`progress--${size}`],
        styles[`progress--${tone}`],
        isIndeterminate && styles['progress--indeterminate'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      {(showLabel || showValue) && (
        <div className={styles['progress__label']}>
          {label && <span>{label}</span>}
          {showValue && (
            <span>
              {valueLabel || `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}
      <div className={styles['progress__track']}>
        <div
          className={styles['progress__fill']}
          style={{ width: `${percentage}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}