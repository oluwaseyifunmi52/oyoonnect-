import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import styles from './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: BaseButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        fullWidth && styles['button--full'],
        iconOnly && styles['button--icon'],
        loading && styles['button--loading'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          className={styles['button__spinner']}
          aria-hidden="true"
          size={size === 'sm' ? 16 : size === 'lg' ? 22 : 20}
        />
      )}
      <span className={loading ? styles['button__content--hidden'] : ''}>
        {children}
      </span>
    </button>
  );
}

interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={[
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        fullWidth && styles['button--full'],
        disabled && styles['button--disabled'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={(e) => disabled && e.preventDefault()}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </Link>
  );
}