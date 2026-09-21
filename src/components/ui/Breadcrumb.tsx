import type { ReactNode } from 'react'
import './Breadcrumb.css'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      className={`breadcrumb ${className}`}
      aria-label="Breadcrumb"
      role="navigation"
    >
      <ol className="breadcrumb__list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            {item.current || !item.href ? (
              <span
                className="breadcrumb__current"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <a href={item.href} className="breadcrumb__link">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
