import type { HTMLAttributes, ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react'
import './Badge.css'

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'info'
export type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  children: ReactNode
  dot?: boolean
}

export const Badge = Object.assign(
  (function Badge({
    variant = 'neutral',
    size = 'md',
    className = '',
    children,
    dot = false,
    ...props
  }: BadgeProps) {
    return (
      <span className={`badge badge--${variant} badge--${size} ${className}`} {...props}>
        {dot && <span className="badge__dot" aria-hidden="true" />}
        {children}
      </span>
    )
  }) as ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLSpanElement>>,
  { displayName: 'Badge' }
)