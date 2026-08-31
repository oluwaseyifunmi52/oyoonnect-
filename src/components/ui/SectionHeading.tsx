import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  action?: ReactNode
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  action,
  id,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`} id={id}>
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  )
}