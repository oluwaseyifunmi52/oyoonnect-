import type { ReactNode, HTMLAttributes } from 'react'

type CardVariant = 'default' | 'elevated' | 'interactive' | 'skeleton'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  children: ReactNode
}

export function Card({ variant = 'default', padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div className={`card card--${variant} card--p${padding} ${className}`} {...props}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  className?: string
  children: ReactNode
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return <div className={`card__header ${className}`}>{children}</div>
}

interface CardBodyProps {
  className?: string
  children: ReactNode
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return <div className={`card__body ${className}`}>{children}</div>
}

interface CardFooterProps {
  className?: string
  children: ReactNode
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return <div className={`card__footer ${className}`}>{children}</div>
}
