import { useState } from 'react'
import type { HTMLAttributes, ForwardRefExoticComponent, RefAttributes, ReactNode } from 'react'
import './Avatar.css'

export type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  initials?: string
  size?: AvatarSize
  variant?: 'gradient' | 'image'
  children?: ReactNode
}

const sizeClass: Record<AvatarSize, string> = {
  sm: 'avatar--sm',
  md: 'avatar--md',
  lg: 'avatar--lg',
}

export const Avatar = Object.assign(
  (function Avatar({
    src,
    alt = '',
    initials = 'U',
    size = 'md',
    variant = 'gradient',
    className = '',
    children,
    ...props
  }: AvatarProps) {
    const baseClasses = `avatar ${sizeClass[size]} avatar--${variant} ${className}`
    const [imgError, setImgError] = useState(false)

    if (src && !imgError) {
      return (
        <span className={baseClasses} {...props}>
          <img
            src={src}
            alt={alt}
            className="avatar__img"
            onError={() => setImgError(true)}
            aria-hidden={alt === '' ? true : undefined}
          />
        </span>
      )
    }

    return (
      <span className={baseClasses} {...props}>
        <span className="avatar__initials" aria-hidden={!alt}>
          {children ?? initials}
        </span>
      </span>
    )
  }) as ForwardRefExoticComponent<AvatarProps & RefAttributes<HTMLSpanElement>>,
  { displayName: 'Avatar' }
)
