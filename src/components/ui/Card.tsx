import type { ReactNode, HTMLAttributes, ForwardRefExoticComponent, RefAttributes } from 'react'
import './Card.css'

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'skeleton'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  children: ReactNode
}

export const Card = Object.assign(
  (function Card({ variant = 'default', padding = 'md', className = '', children, ...props }: CardProps) {
    return (
      <div className={`card card--${variant} card--p${padding} ${className}`} {...props}>
        {children}
      </div>
    )
  }) as ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'Card' }
)

interface CardHeaderProps {
  className?: string
  children: ReactNode
}

export const CardHeader = Object.assign(
  (function CardHeader({ className = '', children }: CardHeaderProps) {
    return <div className={`card__header ${className}`}>{children}</div>
  }) as ForwardRefExoticComponent<CardHeaderProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'CardHeader' }
)

interface CardBodyProps {
  className?: string
  children: ReactNode
}

export const CardBody = Object.assign(
  (function CardBody({ className = '', children }: CardBodyProps) {
    return <div className={`card__body ${className}`}>{children}</div>
  }) as ForwardRefExoticComponent<CardBodyProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'CardBody' }
)

interface CardFooterProps {
  className?: string
  children: ReactNode
}

export const CardFooter = Object.assign(
  (function CardFooter({ className = '', children }: CardFooterProps) {
    return <div className={`card__footer ${className}`}>{children}</div>
  }) as ForwardRefExoticComponent<CardFooterProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'CardFooter' }
)