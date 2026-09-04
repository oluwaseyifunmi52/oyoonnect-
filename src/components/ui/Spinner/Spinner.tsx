import styles from './Spinner.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'brand' | 'success' | 'error' | 'warning' | 'white';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  'aria-label'?: string;
}

export function Spinner({ size = 'md', color = 'brand', className = '', 'aria-label': ariaLabel = 'Loading' }: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[`spinner--${size}`], styles[`spinner--${color}`], className].filter(Boolean).join(' ')}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="visually-hidden">{ariaLabel}</span>
    </span>
  );
}