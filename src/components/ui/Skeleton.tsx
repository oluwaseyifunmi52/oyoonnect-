import type { HTMLAttributes, ForwardRefExoticComponent, RefAttributes } from 'react'
import './Skeleton.css'

type SkeletonVariant = 'text' | 'media' | 'avatar' | 'btn' | 'badge' | 'circle' | 'rect'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  className?: string
}

export const Skeleton = Object.assign(
  (function Skeleton({
    variant = 'text',
    width,
    height,
    className = '',
    ...props
  }: SkeletonProps) {
    const style: React.CSSProperties = {}
    if (width) style.width = typeof width === 'number' ? `${width}px` : width
    if (height) style.height = typeof height === 'number' ? `${height}px` : height

    return (
      <div
        className={`skeleton skeleton--${variant} ${className}`}
        style={style}
        role="status"
        aria-label="Loading..."
        {...props}
      />
    )
  }) as ForwardRefExoticComponent<SkeletonProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'Skeleton' }
)

// Preset skeleton components
export const SkeletonText = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Skeleton variant="text" className={className} {...props} />
)

export const SkeletonMedia = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Skeleton variant="media" className={className} {...props} />
)

export const SkeletonAvatar = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Skeleton variant="avatar" className={className} {...props} />
)

export const SkeletonButton = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Skeleton variant="btn" className={className} {...props} />
)

export const SkeletonBadge = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <Skeleton variant="badge" className={className} {...props} />
)

export const SkeletonCircle = ({ size = 48, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { size?: number }) => (
  <Skeleton variant="circle" width={size} height={size} className={className} {...props} />
)

export const SkeletonRect = ({ width = '100%', height = 16, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { width?: string | number; height?: string | number }) => (
  <Skeleton variant="rect" width={width} height={height} className={className} {...props} />
)

interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SkeletonCard({ className = '', ...props }: SkeletonCardProps) {
  return (
    <div
      className={`skeleton-card card ${className}`}
      role="status"
      aria-label="Loading card"
      {...props}
    >
      <SkeletonMedia />
      <div className="card__body">
        <SkeletonText style={{ width: '70%' }} className="card__title" />
        <SkeletonText style={{ width: '40%' }} />
        <SkeletonText style={{ width: '90%' }} />
        <SkeletonText style={{ width: '80%' }} />
        <div className="card__actions">
          <Skeleton variant="btn" width={96} />
          <Skeleton variant="btn" width={96} />
        </div>
      </div>
    </div>
  )
}