import type { ReactNode } from 'react'

interface ContainerProps {
  className?: string
  children: ReactNode
}

export function Container({ className = '', children }: ContainerProps) {
  return <div className={`container ${className}`}>{children}</div>
}