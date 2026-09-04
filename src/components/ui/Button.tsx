import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

export const Button = Object.assign(
  (function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    loading = false,
    disabled,
    fullWidth = false,
    ...props
  }: ButtonProps) {
    return (
      <button
        className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="btn__spinner" aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }) as ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>,
  { displayName: 'Button' }
)

interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  disabled?: boolean
  fullWidth?: boolean
}

export const ButtonLink = Object.assign(
  (function ButtonLink({
    to,
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    disabled = false,
    fullWidth = false,
    ...props
  }: ButtonLinkProps) {
    return (
      <Link
        to={to}
        className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className} ${disabled ? 'btn--disabled' : ''}`}
        onClick={(e) => disabled && e.preventDefault()}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </Link>
    )
  }) as ForwardRefExoticComponent<ButtonLinkProps & RefAttributes<HTMLAnchorElement>>,
  { displayName: 'ButtonLink' }
)