import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <><Loader2 size={18} className="btn__spinner" aria-hidden="true" />{children}</>
      ) : (
        children
      )}
    </button>
  )
}

interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  disabled?: boolean
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`btn btn--${variant} btn--${size} ${className} ${disabled ? 'btn--disabled' : ''}`}
      onClick={(e) => disabled && e.preventDefault()}
      {...props}
    >
      {children}
    </Link>
  )
}